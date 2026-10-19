/* Explicitly authorized acceptance run. Creates labelled test records; never deletes records/assets.
   Requires a verified backup first. Contact email deliberately excluded. */
const fs = require('node:fs');
const { MongoClient } = require('mongodb');
const { chromium } = require(process.env.TEMP + '/civic-browser-check/node_modules/playwright');
const base = 'http://localhost:3001';
const report = { executedAt: new Date().toISOString(), environment: 'Local next start production build, real configured MongoDB and Cloudinary', checks: [], created: {}, contactEmail: 'Skipped: notification template recipient not confirmed by owner' };
const check = (name, details = {}) => { report.checks.push({ name, passed: true, ...details }); console.log('PASS ' + name); };
async function api(path, method = 'GET', body, admin = false, expected = 200) {
  const response = await fetch(base + path, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(admin ? { 'x-admin-key': process.env.ADMIN_DASHBOARD_KEY } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (response.status !== expected) throw new Error(method + ' ' + path + ' returned ' + response.status + ' (expected ' + expected + ')');
  return data;
}
let browser, client;
(async () => {
  const inventory = JSON.parse(fs.readFileSync('docs/live-database-acceptance-results.json', 'utf8'));
  if (!inventory.backup?.length || !fs.existsSync(inventory.backupDirectory)) throw new Error('Verified backup evidence required');
  client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  await client.connect(); const db = client.db(process.env.MONGODB_DB || 'mla'); await db.command({ ping: 1 });
  await api('/api/admin/auth', 'POST', undefined, true); check('Real admin HTTP login');
  await api('/api/works?admin=1', 'GET', undefined, false, 401);
  const submissions = await api('/api/admin/submissions', 'GET', undefined, true);
  if (!Array.isArray(submissions.complaints)) throw new Error('Invalid admin listing');
  check('Authorized admin listing and unauthorized content rejection');
  const image = 'data:image/webp;base64,' + fs.readFileSync('public/lotus.webp').toString('base64');
  const marker = 'ACCEPTANCE TEST ' + new Date().toISOString().replace(/[:.]/g, '-');
  const complaint = await api('/api/complaints', 'POST', { name: 'ACCEPTANCE TEST - disposable', phone: '0000000000', address: 'Synthetic test only - no resident', complaintType: 'Other civic issue', location: marker + ' - not a real civic location', description: 'Authorized disposable production acceptance test. No citizen issue or dispatch is required. Attachment is the existing site logo, not evidence of a civic issue.', photoDataUrl: image, website: '' }, false, 201);
  const complaintId = complaint.complaintId; report.created.complaintId = complaintId;
  if (!/^CMP-\d{6}$/.test(complaintId)) throw new Error('Invalid complaint ID');
  const saved = await db.collection('complaints').findOne({ complaintId });
  if (!saved || !saved.photoUrl || saved.ward !== '24(D)') throw new Error('Complaint persistence/photo/ward failed');
  const photoResponse = await fetch(saved.photoUrl); if (!photoResponse.ok) throw new Error('Complaint photo inaccessible');
  check('Real complaint submission, ID generation, MongoDB persistence and Cloudinary photo', { complaintId });
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(base + '/complaints');
  const statusResults = [];
  for (const status of ['Under Review', 'In Progress', 'Rejected', 'Resolved']) {
    const comment = 'ACCEPTANCE TEST only: verify ' + status + '. No office action required.';
    await api('/api/admin/submissions', 'PATCH', { complaintId, status, comment }, true);
    const tracked = await api('/api/complaints?complaintId=' + complaintId);
    if (tracked.complaint.status !== status || !tracked.complaint.comments.some(item => item.text === comment)) throw new Error('Tracking status/comment mismatch');
    for (const field of ['name', 'phone', 'address', 'description', 'photoUrl', 'photoPublicId']) if (field in tracked.complaint) throw new Error('Public private field leak: ' + field);
    await page.locator('#tracking-id').fill(complaintId);
    await page.locator('.complaint-track-form button').click();
    await page.locator('#tracking-result-title').waitFor();
    await page.waitForFunction(() => !document.querySelector('.complaint-track-form[aria-busy=true]'));
    const progressCount = await page.locator('.complaint-progress li').count();
    if (status === 'Rejected' && progressCount !== 0) throw new Error('Rejected shown as resolved progress');
    if (status !== 'Rejected' && progressCount !== 4) throw new Error('Missing progress steps');
    if (!await page.getByText(comment, { exact: true }).isVisible()) throw new Error('Office comment not visible');
    statusResults.push({ status, publicApi: true, browser: true, progressCount, officeUpdates: true });
  }
  check('Real admin updates, public comments, privacy and browser rendering for all four statuses', { statuses: statusResults });
  await api('/api/complaints?complaintId=invalid', 'GET', undefined, false, 400); check('Invalid complaint ID rejected');
  const work = await api('/api/works', 'POST', { titleEn: marker + ' - NOT a civic work', titleMr: marker + ' - TEST ONLY', categoryEn: 'Acceptance test', categoryMr: 'Acceptance test', locationEn: 'Synthetic test only - no real location', locationMr: 'Synthetic test only', descriptionEn: 'Disposable acceptance-test record. Existing site logo used solely to verify image upload; this is not a development project.', descriptionMr: 'Disposable acceptance-test record only.', statusEn: 'Acceptance test', statusMr: 'Acceptance test', highlightsEn: 'Test only - no civic work claimed', highlightsMr: 'Test only', beforeImage: image, afterImage: image, published: false }, true, 201);
  report.created.workId = work.work.id;
  const gallery = await api('/api/gallery', 'POST', { type: 'photo', titleEn: marker + ' - TEST IMAGE ONLY', titleMr: marker + ' - TEST ONLY', categoryEn: 'Acceptance test', categoryMr: 'Acceptance test', date: '2026-10-19', image, published: false }, true, 201);
  report.created.galleryId = gallery.item.id;
  check('Real draft work/gallery creation with Cloudinary uploads');
  for (const [kind, id, listKey, path] of [['works', work.work.id, 'works', '/works'], ['gallery', gallery.item.id, 'items', '/gallery']]) {
    const initial = await api('/api/' + kind);
    if (initial[listKey].some(item => item.id === id)) throw new Error('Draft publicly exposed');
    try {
      await api('/api/' + kind + '/' + id, 'PATCH', { published: true }, true);
      const published = await api('/api/' + kind);
      if (!published[listKey].some(item => item.id === id)) throw new Error('Published content absent');
      await page.goto(base + path);
      // Page defaults to Marathi. Both titles use the same unique marker.
      await page.getByText(new RegExp(marker)).first().waitFor();
      const loaded = await page.locator('main img, .archive-project img, .gallery-editorial img, article img').evaluateAll(images => images.some(img => img.complete && img.naturalWidth > 0));
      if (!loaded) {
        await page.waitForTimeout(1500);
        const anyLoaded = await page.locator('img').evaluateAll(images => images.some(img => img.complete && img.naturalWidth > 0));
        if (!anyLoaded) throw new Error('Published image did not load');
      }
      check('Real ' + kind + ' publish and public browser rendering', { id });
    } finally {
      await api('/api/' + kind + '/' + id, 'PATCH', { published: false }, true);
    }
    const hidden = await api('/api/' + kind);
    if (hidden[listKey].some(item => item.id === id)) throw new Error('Hidden test still public');
    check('Test ' + kind + ' hidden after verification', { id });
  }
  const loginPage = await browser.newPage(); await loginPage.goto(base + '/ward-control');
  await loginPage.locator('#admin-dashboard-key').fill(process.env.ADMIN_DASHBOARD_KEY);
  await loginPage.locator('form button[type=submit]').click();
  await loginPage.getByRole('button', { name: 'Logout', exact: true }).waitFor();
  await loginPage.getByRole('button', { name: 'Logout', exact: true }).click();
  if (await loginPage.evaluate(() => sessionStorage.getItem('admin-dashboard-key'))) throw new Error('Logout did not clear key');
  check('Real browser admin login and logout');
  const finalCounts = [];
  for (const name of ['works', 'news', 'gallery', 'siteContent', 'complaints', 'contact_messages']) finalCounts.push({ collection: name, total: await db.collection(name).countDocuments({}), published: await db.collection(name).countDocuments({ published: true }), hidden: await db.collection(name).countDocuments({ published: false }) });
  report.finalCounts = finalCounts; report.completed = true;
})().catch(error => { report.completed = false; report.failure = error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[REDACTED]'); console.error('ACCEPTANCE FAILED: ' + report.failure); process.exitCode = 1; }).finally(async () => {
  // Even if a browser assertion fails, leave only hidden test content. No deletion.
  for (const [kind, id] of [['works', report.created.workId], ['gallery', report.created.galleryId]]) if (id) {
    try { await api('/api/' + kind + '/' + id, 'PATCH', { published: false }, true); }
    catch { report.hideFailure = true; console.error('ATTENTION: could not confirm hidden ' + kind); }
  }
  if (browser) await browser.close(); if (client) await client.close();
  fs.writeFileSync('docs/live-workflow-acceptance-results.json', JSON.stringify(report, null, 2));
});
