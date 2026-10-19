# Production readiness audit — 19 October 2026

**Update:** MongoDB connectivity has since been restored. See [the live acceptance report](PRODUCTION_ACCEPTANCE.md) for successful live tests, final inventory and current delivery conditions. The blocked status below records the earlier audit stage.

## Delivery status

**Not ready for production acceptance until MongoDB connectivity is restored and live acceptance tests pass.** The configured MongoDB SRV lookup returns `ENOTFOUND`. Repeated read-only connection attempts could not inspect collections. Credentials/hostnames are deliberately omitted here. The owner is checking the local `.env` configuration. Restart the server after correcting environment variables.

No deployment, live test submission, database deletion, Cloudinary deletion, or real email send was performed. Public visual design and colours were preserved.

## Issues fixed

- Public works, news and gallery appended bundled examples even when no real content existed or the database failed. Public consumers now use published database content plus an explicit, initially empty static-content allowlist. Empty states replace unverified examples. Detail routes obey the same boundary.
- Former dashboard demo-fill controls were removed. Two exact generated demo titles are excluded publicly but remain visible to the administrator. No records were deleted.
- Unauthorized works/news reads previously reached MongoDB before checking credentials. Authorization now precedes database access. Create/update/delete handlers remain protected on the server.
- Work/news edits could not replace images; gallery editing was limited to prompts. Editors now support image replacement and bilingual fields, dates/categories where applicable, draft creation, publish/hide and confirmed deletion. Work status and highlights remain editable. Existing uploaded originals are retained.
- Image selection is validated for supported type/size, and save/publish waits for FileReader. Server-side validation also applies. Edit links reject non-HTTP(S) schemes.
- Contact submissions previously only sent EmailJS while the admin inbox expected MongoDB records. Valid messages now persist first in the existing `contact_messages` collection, then use existing email delivery. A notification failure does not discard the saved message or encourage duplicate submission. Database failure returns an error.
- Complaint image-size validation previously checked an already truncated string. Oversized raw attachments now fail before truncation. Existing IDs, fixed ward, statuses, comments and public privacy projection remain intact.
- Site-content errors now surface instead of appearing to be successful empty responses. Failed loading cannot overwrite settings. Banner replacement and partial updates are supported.
- Admin session restore handles network errors. Admin/API responses have private no-store headers; admin pages have noindex headers.
- Historical editor snapshots caused lint failures and are excluded from lint/deployment. Private backups are ignored by Git/deployment.

## Content audit and reversible isolation

| Source | Classification | Public treatment / follow-up |
| --- | --- | --- |
| Former generated titles `Demo Road Improvement Work`, `Demo Ward Development Update` | Clearly identified demo, from removed admin generators | Exact-title exclusion; records remain admin-visible, if present. No broad keyword or age-based classification. |
| `components/workData.js`, bundled before/after assets | Unverified static project examples, not independently confirmed real | Retained on disk, excluded by empty `verifiedStaticContent.works` allowlist. Client must confirm provenance before use. |
| Static news data used by `lib/news.js` | Unverified bundled articles | Retained, excluded by empty news allowlist; no automatic fallback to examples. |
| Photo/reel arrays in `app/gallery/GalleryPageClient.jsx` and homepage gallery preview | Unverified bundled photographs/reels | Retained, excluded by photo/video/preview allowlists. Do not infer demo from age alone. |
| Statistics and testimonials in `data/siteContent.ts` | Require manual verification, including 1,820 resolved / 15,000 served claims | Existing unused data retained; not mounted on the current public homepage. Do not publish without evidence. |
| Default announcement copy in static content | Sample/unverified | Public announcement bar was already unmounted by the previous requested changes; not re-enabled. Admin explains that retained settings are currently inactive. |
| Existing portrait, lotus, biography, office address, Instagram and ward identity | Existing owner-provided identity/contact content; no independent factual verification | Preserved. Client should confirm address/identity details for handover. No new contact details invented. |
| MongoDB works/news/gallery/site content and uploads | Cannot classify while DNS fails | No records inspected, changed, purged or automatically marked demo. Published records remain the primary content source after reconnection, except the two exact known demo titles above. |

`lib/publicContent.js` is the reversible curation boundary. After confirmation, add the existing static ID/slug to its matching allowlist, or preferably upload verified content through admin. A blank allowlist does not remove assets. Renaming a known demo is not verification; replace it with confirmed content deliberately.

### Real content needed from the client

- Verified works: bilingual title/category/location/description, genuine before/after images, status, highlights.
- Verified news: title, actual date, summary/article text and rights-cleared image; Marathi where available.
- Verified gallery: genuine images/video links, bilingual titles/categories, accurate dates.
- Approved homepage banner and confirmation of existing biography/address/social links.
- Evidence for any statistics/testimonials before enabling them.

## Executed verification

| Check | Result / scope |
| --- | --- |
| `npm run lint` | PASS after final source changes. |
| `npm run build` | PASS; all 31 static pages generated, dynamic routes compiled, Contact prerender succeeds. |
| `npm run test:production` | PASS, nine groups using real route modules with isolated in-memory MongoDB and stubbed Cloudinary/EmailJS. Includes all four complaint statuses, ID collision retry, photo validation, comments, privacy, CRUD authorization, image replacement, publish/hide/delete and contact durability. **Not live integration tests.** |
| Real admin login/logout | PASS via HTTP/browser with configured key. Session storage cleared on logout. No secret logged. |
| Unauthorized management HTTP requests | PASS: rejected before DB access; see live HTTP artifact. |
| Real public page HTTP checks | PASS 200 for Home, About, Works, Complaints, Contact, Gallery, News. A 200 page does not prove its database content loaded. |
| Cloudinary read-only ping | PASS. Actual uploads/replacements not exercised against the live account. |
| Browser admin operations | PASS using intercepted API fixtures: complaint update/comment; works/news/gallery create/edit/image replacement/hide/publish/delete; banner update; logout. No live mutations. |
| Browser citizen complaint workflow | PASS using intercepted complaint API: photo included in submission, ID display/copy, invalid tracking error, office updates and Under Review / In Progress / Resolved / Rejected presentation. Rejected has no resolution-progress tracker. |
| Browser responsive overflow | PASS at 375, 430, 768, 1024, 1440 for Home, Works, Complaints and Contact. This is an overflow check, not an exhaustive visual/device certification. |
| Browser contact/map/navigation | PASS contact success and submitted payload with intercepted POST; real Leaflet rendered and zoom control clicked; switched to English; mobile Track Complaint link navigated and menu closed. No live contact message sent. |
| Built client secret scan | PASS: zero built client files containing the configured admin key, MongoDB URI, Cloudinary secret or EmailJS private key values. |
| Real MongoDB / public content API | BLOCKED: DNS `ENOTFOUND`; works/news/gallery return failure and site-content returns 503. No live persistence, record audit, publishing or tracking acceptance claimed. |
| `git diff --check` | PASS. |

Evidence: `route-check-results.json`, `live-http-check-results.json`, `live-page-check-results.json`, `browser-admin-check-results.json`, `browser-public-check-results.json`, `browser-contact-navigation-check-results.json` in this directory. Fixture data never went into the real database.

## Handover / remaining acceptance

1. Correct the Atlas connection hostname/cluster state and local or deployment `MONGODB_URI`; check DNS/network access and Atlas access list. Keep secrets out of chat and Git. Restart the server and retry read-only connection.
2. Before any approved cleanup, run `npm run backup:content`. It exports Extended JSON for content, complaints and contact inbox under ignored `backups/`. Restrict access: backups contain personal information. No successful backup exists yet because DB connectivity is blocked. Never perform destructive cleanup without a verified backup and explicit confirmation.
3. Inspect the actual collections and have the client classify uncertain records. Hide uncertain records through admin rather than deleting them. Backup before any approved deletion. Public filtering does not change stored records.
4. With client-authorized test content, perform a real complaint submission with photo, verify returned ID and stored document, check admin listing, add a public-safe office comment, set all four statuses in turn and verify public tracking (particularly Resolved and Rejected). Public results intentionally exclude name/phone/address/description/photo URL. Comments are public: do not include private contact details.
5. Create a real draft work/news/gallery item, replace images, publish, inspect publicly, hide, and confirm routes; test deletion only on explicitly disposable test records after backup. No live deletion has been attempted during this audit.
6. Send one authorized contact message and verify both the MongoDB inbox and actual EmailJS delivery. Email delivery was simulated in tests, not sent to real recipients.
7. Confirm mobile navigation and language switching manually on production. Existing language initialization can cause a hydration warning when English is persisted across a reload; language-system code was not changed in this audit. Initial Marathi and subsequent switching remain outside any schema/API changes.
8. Preserve the existing admin key flow over HTTPS, use a strong server-only secret, and log out on shared devices. Existing process-local rate limits are not distributed across server instances; no authentication rewrite was performed.
9. Deployment requires separate owner confirmation. This audit did not deploy.

## Files changed and purpose

| Files | Purpose |
| --- | --- |
| `app/api/complaints/route.js` | Correct attachment validation; preserve complaint contract/privacy. |
| `app/api/contact/route.js` | Persist existing contact fields before EmailJS notification. |
| `app/api/works/route.js`, `app/api/news/route.js`, `app/api/gallery/route.js` | Published source filtering, authorized admin listing, draft creation, validated uploads/links. |
| `app/api/works/[id]/route.js`, `app/api/news/[id]/route.js`, `app/api/gallery/[id]/route.js` | Reuse authorized validated edit/delete handlers with replacement images. |
| `app/api/site-content/route.js` | Safe authorized partial updates and banner replacement/error handling. |
| `lib/adminContent.js`, `lib/contentImages.js`, `lib/adminImageFile.js` | Shared server authorization/edit logic and server/client image validation. |
| `lib/publicContent.js`, `lib/news.js` | Explicit verified-static boundary and dynamic published news. |
| `app/works/[slug]/page.jsx`, `app/news/[slug]/page.jsx` | Published dynamic detail lookup; exclude unverified static detail routes. |
| `components/BeforeAfterShowcase.jsx`, `components/home/HomepageSections.jsx`, `app/gallery/GalleryPageClient.jsx` | Stop appending unverified samples; show existing-style empty states without redesign. |
| `app/ward-control/AdminPageClient.jsx` | Remove demo generators; validate images and prevent publishing while reads are pending. |
| `components/admin/AdminShell.jsx` | Session restore failure handling and login label. |
| `components/admin/ContentManager.jsx` | Work/news creation and full editing, status, image replacement, publication controls. |
| `components/admin/GalleryManager.jsx` | Full gallery editing/image replacement/publication controls. |
| `components/admin/SiteContentManager.jsx` | Safe loading, error handling, banner replacement; explain disabled announcement presentation. |
| `next.config.mjs` | No-store admin/API responses and admin noindex. |
| `eslint.config.mjs`, `.gitignore`, `.vercelignore` | Exclude historical snapshots/private backups from lint, Git and deployment as appropriate. |
| `package.json`, `scripts/production-route-checks.cjs`, `scripts/backup-content.cjs` | Repeatable isolated route tests and read-only backup command. |
| `docs/PRODUCTION_READINESS.md`, `docs/route-check-results.json`, `docs/live-http-check-results.json`, `docs/live-page-check-results.json`, `docs/browser-admin-check-results.json`, `docs/browser-public-check-results.json`, `docs/browser-contact-navigation-check-results.json` | Audit, handover and executed test evidence. |

MongoDB schemas, complaint status values, public colours/layout, homepage priorities and existing routes were not redesigned. API implementation fixes were intentional and are listed above; API contracts and existing integrations were preserved.
