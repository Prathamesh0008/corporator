# Overview recovery and new Cloudinary verification — 19 October 2026

## 1. Overview failure and fix

The actual running server on port 3000 returned:

- Without an admin header: **401**, `{"error":"Unauthorized."}`.
- With the configured admin header: **503**, `{"error":"Dashboard could not be loaded. Retry to fetch current database counts."}`.

The development server process started at **14:54:19 IST**, before the environment file update at **16:06:59 IST**. Its server log contained repeated MongoDB SRV DNS failure tokens `querySrv` and `ENOTFOUND`. A separate process loading the current `.env` connected to MongoDB and read the existing collections successfully. Thus authorization worked, while the stale development process failed database access.

Restarting that existing Next.js process on the **same port 3000** restored the same overview queries to **200**. This confirms the stale process/environment as the cause; no reset, collection repair or fabricated zero counts was needed. The replacement development server remains running so the actual browser can refresh `/ward-control`.

The overview error handler now logs a sanitized operation/name/code/syscall diagnostic. Provider messages, connection URIs and credential values are omitted. Database failures still return 503; they do not become false successful zeros.

## 2. MongoDB and existing records

Authorized real reads after the restart all returned 200:

| Manager | Current records |
| --- | ---: |
| Works | 2 — previous acceptance item plus the newly authorized unpublished draft |
| Gallery | 1 — previous acceptance item |
| News | 0 |
| Complaints | 1 — previous acceptance item |
| Contact messages | 1 — previous acceptance item |

Site Content loads successfully as well. Genuine activity totals are currently zero because all five managed activity records are explicitly labelled tests. The overview reports the excluded records separately. `ADMIN TEST` labels now join the existing `ACCEPTANCE TEST`/exact legacy-demo classification, so this new draft is not presented as a genuine achievement or hidden genuine work.

No existing document was deleted or changed. Existing records remain available through the appropriate **All records** or **Test/demo records** filter. See `overview-recovery-http-results.json` for actual HTTP responses/counts without private citizen data.

## 3. Updated Cloudinary

- All three environment variables are present: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Authenticated read-only Cloudinary ping returned `status: ok`.
- The account differs from the previous work-image account, matching the owner's confirmation that a **new account** is intended.
- The upload helper reads these environment values when performing an upload. Restarting Next.js made the current values available to the actual Works API.
- Both images in the authorized upload returned URLs under the newly configured account and served valid image responses. The actual admin and protected-preview browser decoded the images successfully.
- No credential values were printed, replaced or committed. No previous Cloudinary assets were deleted or rewritten.

## 4. Exactly one authorized temporary draft

The owner explicitly authorized two existing non-sensitive project assets and one unpublished draft. These exact paths were reported **before** upload and visually inspected as existing lotus icons:

1. `public/favicon-32x32.png` — before-image slot.
2. `public/android-chrome-192x192.png` — after-image slot.

These are logo test images, not photos of civic works. No real project or achievement was invented.

The actual browser workflow was **Add Work → fill bilingual test details → select both files → Save Draft → reopen saved draft → Preview**. It made one creation request and two image uploads. Verification continuations reused the saved record without additional uploads/creation.

- English title: **ADMIN TEST — Development Work (Not Real)**
- Marathi title: **प्रशासकीय चाचणी — विकासकाम (वास्तविक नाही)**
- MongoDB record ID: `6ad5f56673ba598f8e773335`
- Slug: `admin-test-development-work-not-real-efdfd7`
- Publication state: **`published: false`**
- Work count changed from 1 to 2 on creation, with one matching labelled draft retained.
- Location/status/descriptions/highlights explicitly state that this is a test, not a completed or actual civic work.

### Actual browser checks

- Overview loads after restart.
- Saved draft appears under **Works → Records → Test/demo records**.
- Both selected and stored images render in the admin editor.
- Both before/after images render in the protected homepage-section and Works-listing previews.
- The existing standalone detail renderer shows its after image correctly; it was not redesigned to add another comparison.
- Marathi and mobile preview controls work, and returning preserves the editor values.
- Save Draft, Preview, Publish, review and deletion controls are available. View Live is correctly absent for an unpublished record.
- Public works API, homepage, Works listing and direct draft detail URL do **not** expose the draft.
- The stored publication state remains false after all checks.

See `overview-cloudinary-draft-check-results.json`. The verification script prevents a second creation request in a run and reuses an existing exact-title unpublished test on subsequent checks. It must still only be used with explicit approval; it is not a routine fixture test.

## 5. Workflow readiness and limits

Create, Save Draft, before/after upload, Edit and protected Preview were verified against the real API, MongoDB, new Cloudinary account and browser. Publish, View Live, Hide and confirmed Delete remain supported and are covered by isolated API/browser fixtures. **They were not executed against this real draft.**

Publishing requires the owner's separate explicit confirmation. Only then can the draft images be checked as visible on the real public homepage, listing and detail page, followed by the approved hide action. At present, their **absence** from those public pages is the correct verified result.

No delete operation, destructive cleanup, MongoDB reset, EmailJS change/test or deployment was performed.

## 6. Checks and files

- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm run test:admin`: PASS, including the new ADMIN TEST exclusion and database-error behavior. This suite is isolated and does not call EmailJS.
- `node scripts/admin-browser-checks.cjs`: fixture-only regression checks for the existing CMS/preview/publish/hide/delete workflows; no real mutations.

Files changed/added for this task:

- `app/api/admin/overview/route.js` — safe server-side failure diagnostics, preserving genuine failure responses.
- `lib/adminQueries.js` — explicitly labelled ADMIN TEST records excluded from genuine activity and accessible through test filters.
- `scripts/admin-cms-checks.cjs` — fixture assertion for the new classification.
- `scripts/verify-approved-work-draft.cjs` — guarded, owner-authorized one-draft workflow and non-destructive verification.
- `docs/overview-recovery-http-results.json` — actual before/after HTTP checks.
- `docs/overview-cloudinary-draft-check-results.json` — actual upload, record and browser evidence; no credential values or asset URLs.
- `docs/OVERVIEW_CLOUDINARY_VERIFICATION.md` — this report.
- Existing `docs/phase5-api-check-results.json` and `docs/phase5-browser-check-results.json` — refreshed isolated regression evidence.

The public design, EmailJS integration, `.env` contents, MongoDB connection configuration and deployment configuration were unchanged.
