# Live production acceptance — 19 October 2026

This report supersedes the MongoDB-blocked status in `PRODUCTION_READINESS.md`. Public UI and application code were not changed during this acceptance run. No deployment or destructive cleanup was performed.

## Outcome

**MongoDB and the core citizen-help workflow pass live acceptance against the configured database using the local production build.** Works/gallery publishing also passes. Full delivery acceptance remains conditional on EmailJS delivery verification, approval/upload of real content, and deployment-environment verification. This is not a claim that a hosted production site has been deployed or tested.

The previously running development server retained stale MongoDB configuration and returned content API errors. Tests therefore used a fresh `next start` process on port 3001 with the corrected environment. Restart the normal development/hosting process after changing environment variables.

## Backup and initial inventory

- Read-only MongoDB connection and `ping` succeeded.
- `npm run backup:content` completed before any acceptance-test writes.
- Backup: `backups/2026-10-19T09-47-28-690Z/` (ignored by Git/deployment).
- All six Extended JSON files were parsed successfully; SHA-256 hashes and initial counts are recorded in `live-database-acceptance-results.json`.
- Before tests, works, news, gallery, siteContent, complaints and contact_messages each had **zero records**. No published, hidden or exact known demo records existed. Collection discovery found no other existing collections in the configured database at inspection time.
- Empty collections are not proof that this is the intended client database. Confirm the configured target if historic records were expected.

## Live checks executed

| Check | Result |
| --- | --- |
| Real admin HTTP login | PASS with configured server key; secret not logged. |
| Authorized submissions listing | PASS against real MongoDB. |
| Unauthorized admin works read | PASS: 401. |
| Real browser admin login/logout | PASS; session-storage key cleared. |
| Complaint submission | PASS: disposable labelled record persisted, fixed ward maintained, generated ID `CMP-275092`. |
| Complaint photo | PASS: existing site lotus used as an explicitly identified test attachment; real Cloudinary upload and successful URL fetch. No civic evidence fabricated. |
| Admin status and comments | PASS for Under Review, In Progress, Rejected and Resolved. Only the disposable record was changed. |
| Public tracking | PASS for all four statuses through actual API and real browser. Office comments visible, private complainant fields absent. Rejected displays no resolution progress; Resolved displays the normal four-step progress. |
| Invalid tracking ID | PASS: 400. |
| Work/gallery creation | PASS: real API, MongoDB and Cloudinary; created hidden first with explicit ACCEPTANCE TEST titles. |
| Work/gallery publishing | PASS with explicit owner approval: temporarily published, visible through public API and browser, then hidden again. |
| Contact persistence | PASS: actual contact endpoint against real MongoDB in a separate production process with EmailJS keys deliberately empty. HTTP 201, record present in MongoDB and admin inbox. |
| Email delivery | **NOT TESTED** at the owner's instruction because the notification template's recipient could not be confirmed. No email was sent; no inbox-delivery claim is made. |
| Lint | PASS: `npm run lint`, including the acceptance script. |
| Production build | PASS: `npm run build`, all 31 static pages generated, dynamic routes compiled. |

The contact test used the approved support address in its disposable record. EmailJS was disabled only for the isolated test process; `.env`, the normal production process and existing email logic were not modified. Both notification attempts returned unsent while the message remained safely stored. The temporary acceptance servers are stopped after testing.

## Final inventory and retained disposable records

| Collection | Total | Published | Hidden | Exact known legacy demo titles | Acceptance-test records |
| --- | ---: | ---: | ---: | ---: | ---: |
| works | 1 | 0 | 1 | 0 | 1 |
| gallery | 1 | 0 | 1 | 0 | 1 |
| news | 0 | 0 | 0 | 0 | 0 |
| siteContent | 0 | 0 | 0 | 0 | 0 |
| complaints | 1 | N/A | N/A | 0 | 1 |
| contact_messages | 1 | N/A | N/A | 0 | 1 |

Complaint/contact documents do not have publication controls. Their presence must not be counted as real citizen activity. The disposable complaint is left **Resolved**, with clearly labelled acceptance comments. All work/gallery tests are hidden. No records or Cloudinary assets were deleted.

- Work ID: `6ad5e7c8e13c78d3e2a18851` — hidden.
- Gallery ID: `6ad5e7c9e13c78d3e2a18852` — hidden.
- Complaint ID: `CMP-275092` — Resolved, explicitly disposable.
- Contact ID: `6ad5e7eb02f235c784430f4c` — explicitly disposable.

## Remaining delivery conditions

1. Confirm the database target if an empty starting database was unexpected.
2. Confirm the EmailJS office-notification template recipient, then explicitly authorize an actual send. Verify provider acceptance **and recipient inbox receipt**. This remains the unverified integration.
3. Upload/approve genuine works, gallery, news and homepage content. There is currently no published real managed content. Retained bundled static content remains quarantined pending owner confirmation.
4. Restart the normal app process with corrected settings. Verify environment variables and MongoDB network access on the intended hosting platform; run a hosted smoke test after separately approved deployment.
5. Retain the disposable records for review. Any later deletion requires explicit confirmation and a fresh verified backup; the initial backup predates the tests.

## Files added/updated during this continuation

- `scripts/live-acceptance.cjs`: explicitly authorized live acceptance runner; creates labelled test records, hides test works/gallery in cleanup, never deletes. **Do not rerun casually: every run creates additional records and uploads.** Requires local external Playwright installation used for this audit.
- `docs/live-database-acceptance-results.json`: successful connection/backup verification and pre-test inventory.
- `docs/live-workflow-acceptance-results.json`: live admin, complaint, publishing and browser evidence.
- `docs/live-contact-persistence-results.json`: real contact persistence with email disabled.
- `docs/live-final-counts.json`: read-only post-test inventory.
- `docs/PRODUCTION_ACCEPTANCE.md`: current readiness report.
- `docs/PRODUCTION_READINESS.md`: historical report linked to this current result.

No public-facing UI, backend implementation, schema, routes or deployed services were changed in this continuation. Only authorized disposable live data and test uploads were created.
