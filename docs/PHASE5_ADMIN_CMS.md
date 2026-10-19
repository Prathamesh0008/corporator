# Phase 5 — Admin CMS and protected website previews

## Result

The existing `/ward-control` workspace now has a sidebar, compact header, overview, dedicated complaints inbox, contact inbox and consistent Works/Gallery/News editors. Existing MongoDB/Cloudinary integration and key authentication remain in use. Public design, homepage order, public navigation, official information and EmailJS were not redesigned or changed in this phase. No production records/assets were created, updated, published or deleted during Phase 5 testing. No deployment was performed.

### Existing operations preserved

- Server-authorized complaint listing and updates, unchanged complaint IDs and four status values, public comments, photo attachments and public tracking privacy projection.
- Works/news/gallery creation, editing, image replacement, publish/hide and confirmed record deletion. Cloudinary originals are retained.
- Homepage banner setting and retained announcement settings.
- Existing session-key login/logout. Keys are sent in headers, never preview URLs.

## Improvements and additions

### Overview and inboxes

- `/api/admin/overview` counts the complete MongoDB collections, not the first fetched page. It reports all four complaint statuses, works publication totals, gallery, news and contact totals, plus recent complaints.
- Clearly labelled acceptance records and the two exact known legacy demo titles are excluded from genuine activity totals. Their excluded counts are disclosed, and managers offer explicit real/test/all filters. Records remain stored.
- Database failures produce errors with retry; no successful-looking zero dashboard is substituted.
- Complaints: server-side search, status/category/date filters, pagination, complete detail including address and attachment, history, status update and public office comment entry.
- Contact inbox: authorized search, pagination and message details from the existing `contact_messages` collection. No contact submissions are altered. No handled/read schema was introduced.
- Mobile navigation collapses into a sidebar with close/Escape behavior and keyboard focus handling. Tables scroll within their own container.

### Publishing and drafts

Every Works/Gallery/News editor offers Save Draft, Preview, Publish and View Live for published items. New content defaults to private drafts. A title-only incomplete draft may be saved; required details/images must be supplied before publishing. Dates are entered explicitly in the editor, not fabricated for a new draft.

For published items, Save Draft stores pending revisions in an optional `draft` field within the existing document. It retains the current published title/text/images. Publish explicitly promotes the current editor values and clears pending revisions. Public API responses and server detail queries exclude the draft field. Existing API calls without the new `action` field preserve their existing contracts. No record migration or new collection is required.

Website Content drafts use an internal `_id: "draft"` document in the existing `siteContent` collection. Public reads still return only the existing `_id: "global"` document. Publishing promotes the edited values/image; private draft settings never appear through the public GET.

Works now receive a stable slug at creation. Older works without a slug can use their existing ID through the same `/works/[slug]` route, with publication checks retained. View Live links resolve to the published internal news article, project detail or Gallery page as appropriate.

### Protected previews

- Preview rechecks server-side authorization at `/api/admin/preview`. This endpoint returns only an authorization result, never records, and does not consume the login-attempt budget.
- Unsaved values stay in editor memory. Preview does not save, publish, upload images or write to MongoDB. It has no public draft URL or token in a query string.
- A same-origin in-memory iframe receives the existing public CSS and React renderers through a portal. Actual iframe width controls public media queries: desktop 1280px / mobile 390px.
- English/Marathi are scoped to the preview; the public language preference is unchanged.
- The persistent “Draft Preview — Not Published” label and Return to editing control make publication state explicit. Returning preserves form values and selected images.
- Works preview uses the real homepage section, archive listing/comparison dialog and extracted existing detail renderer.
- Gallery preview uses the real homepage photo preview and Gallery/lightbox. Lightbox keyboard handling uses the owning document/window so it works inside the frame.
- News preview uses the real homepage update section and extracted existing listing/article renderers.
- Site Content preview uses the existing hero with the selected/saved banner image.
- Links inside preview are disabled to avoid navigating away or losing edits; work dialogs and photo lightboxes remain interactive. The iframe has noindex metadata; admin routes retain existing noindex/no-store headers.

## Accurate-preview boundaries and optional omissions

- Preview isolates the current item and omits other records. It is an actual section/page renderer, not a simulation of the entire ranked feed, surrounding navbar/footer or interactions with other articles. No claim of a combined multi-record page preview is made.
- The existing standalone Work detail page displays the after image. Before/after comparisons are faithfully previewed on the homepage and Works archive/dialog; the public standalone page was not redesigned to add a new comparison.
- The homepage gallery shows photographs only. Reels can be inspected through Gallery’s Videos tab; external playback/navigation is disabled inside preview.
- Announcement settings are editable/persisted, but the public announcement bar is disabled in the existing layout. Preview explicitly states this; it does not falsely display an active public announcement.
- Hero identity text, biography, party affiliation, office contact details and ward boundaries remain source-managed. There is no invented editable setting/API for them.
- Gallery upload remains one item at a time. Bulk upload was not added; consequently there is no batch whose partial failure can be misreported as complete.
- No message read/handled indicator or automatic deletion was added.
- Cloudinary keeps its existing asset-delivery behavior. Draft records are protected, but this phase does not introduce signed/private Cloudinary delivery or prevent an authorized administrator from copying an asset URL.

## Executed checks

| Check | Result and scope |
| --- | --- |
| `npm run lint` | PASS. |
| `npm run build` | PASS; admin overview/preview endpoints and complaints/messages pages compile with existing public routes. |
| `npm run test:admin` | PASS: eight isolated groups execute actual route modules against in-memory MongoDB and stubbed Cloudinary. No `.env`, network writes or email integration tests. |
| CRUD / bilingual data / uploads | Fixture tests cover all three content types, replacement/retention, incomplete drafts, private revisions to published items, promotion, hide, confirmed deletion and bilingual persistence. |
| Counts / query behavior | Fixture tests cover full totals beyond a page, test exclusion, database failure, literal search, category/status/date filters, invalid dates and pagination. |
| Complaints / privacy | Fixture tests cover all four admin status updates and public tracking exclusion of private fields. Browser covers detail, update/comment form and privacy warning. |
| Website settings | Fixture tests cover authorization, separate draft, bilingual settings and promotion of a previously uploaded draft banner. |
| Browser previews | PASS on real Edge UI with **every API request intercepted**: current unsaved values, English/Marathi, mobile width, images decoding, actual listing/detail placement, Gallery lightbox, keyboard closing, zero preview writes, return preserving values and rejected authorization. |
| Browser CMS | PASS against the final local production build with fixture CRUD, Save Draft/Publish/Hide, correct View Live targets, confirmation before deletion, Site Content, complaint update, contact detail, login/logout. |
| Responsive admin | PASS overflow checks at 375, 430, 768, 1024, 1440; mobile sidebar opens, navigates and closes. This is not an exhaustive device certification. |
| Real configured database reads | PASS on local production build: seven overview/inbox/content reads return 200; unauthenticated reads return 401; all private responses are `no-store, private`. Real overview shows zero genuine activity and four excluded prior acceptance records. No live writes were executed. |
| Preview authorization / secret scan | PASS real preview gate rejects missing key and accepts authorized request without database writes. Zero configured admin key, MongoDB URI or Cloudinary secret values were found in built client files. |

Evidence: `phase5-api-check-results.json`, `phase5-browser-check-results.json`, `phase5-readonly-http-results.json`. Browser runner: `node scripts/admin-browser-checks.cjs` (requires the external Playwright/Edge setup already used in prior acceptance); set `ADMIN_CHECK_BASE` to select a local server. It intercepts every API request. The earlier live acceptance runner was deliberately not rerun.

EmailJS remains on hold: no EmailJS code was changed, investigated or tested in this phase. `npm run test:production` was not invoked because that older suite includes email-related checks. Use the new admin-only suite instead.

## Files modified or added in Phase 5

| Files | Purpose |
| --- | --- |
| `app/ward-control/layout.jsx`, `app/ward-control/admin.css` | Isolated administrative workspace styles. |
| `app/ward-control/AdminPageClient.jsx` | Server-derived overview, genuine/test separation, recent complaint table, quick actions. |
| `app/ward-control/complaints/page.jsx`, `app/ward-control/messages/page.jsx` | Dedicated complaint and contact inbox routes. |
| `app/ward-control/page.jsx`, `app/ward-control/works/page.jsx`, `app/ward-control/gallery/page.jsx`, `app/ward-control/news/page.jsx`, `app/ward-control/content/page.jsx` | Formatting of retained page wrappers; existing routes and metadata preserved. |
| `components/admin/AdminShell.jsx`, `components/admin/AdminHeader.jsx`, `components/admin/AdminSidebar.jsx` | Retained auth with sidebar state, compact header and accessible mobile navigation. |
| `components/admin/AdminUI.jsx`, `components/admin/InboxManager.jsx` | Reusable modal/notices/pagination and server-filtered private inboxes. |
| `components/admin/ContentManager.jsx`, `components/admin/GalleryManager.jsx` | Unified compact CMS, previews, explicit draft/publish, images, filters and deletion confirmation. |
| `components/admin/SiteContentManager.jsx`, `components/admin/WebsitePreview.jsx` | Private settings drafts and actual-layout preview workflow. |
| `app/api/admin/overview/route.js`, `app/api/admin/preview/route.js`, `app/api/admin/submissions/route.js` | Authorized complete counts, preview gate, inbox search/pagination and complete admin detail. |
| `app/api/works/route.js`, `app/api/news/route.js`, `app/api/gallery/route.js`, `lib/adminContent.js` | Incomplete drafts, publication validation, private revisions and public draft exclusion. |
| `app/api/site-content/route.js` | Private draft document and explicit settings/banner promotion. |
| `lib/adminQueries.js` | Shared genuine/test classification and validated inbox queries. |
| `lib/news.js`, `app/news/page.jsx`, `app/news/[slug]/page.jsx`, `app/works/[slug]/page.jsx` | Retain public data/metadata behavior while sharing renderers and protecting drafts; support published legacy work IDs. |
| `components/public/NewsListingView.jsx`, `components/public/NewsDetailView.jsx`, `components/public/WorkDetailView.jsx` | Extracted actual public markup/styles for live pages and previews; missing-image guards and bilingual detail text. No redesign. |
| `components/home/HomepageSections.jsx`, `components/BeforeAfterShowcase.jsx`, `app/works/WorksPageClient.jsx`, `app/gallery/GalleryPageClient.jsx` | Optional in-memory preview inputs; unchanged normal public sources/layout; owning-document modal behavior. |
| `contexts/LanguageContext.jsx` | Additional isolated preview provider; normal public provider/switch behavior preserved. |
| `package.json`, `scripts/admin-cms-checks.cjs`, `scripts/admin-browser-checks.cjs` | Admin-only repeatable isolated tests; no project dependencies added. |
| `docs/PHASE5_ADMIN_CMS.md`, `docs/phase5-api-check-results.json`, `docs/phase5-browser-check-results.json`, `docs/phase5-readonly-http-results.json` | Current report and test evidence. |

The workspace also contains earlier production-audit changes and reports. In particular, the previously modified contact API, deployment/cache configuration and backup/live-acceptance scripts were not changed by Phase 5. No new MongoDB connection or deployment configuration was introduced.
