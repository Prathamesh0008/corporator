# Phase 6 — EmailJS to Resend contact notifications

## Implementation status

The contact notification service now uses the official `resend` Node SDK. MongoDB remains the source of truth. Public/admin appearance, admin authentication, inbox behavior, complaints, Cloudinary and the CMS/preview system were not redesigned or modified in this phase. No real email was sent, production record written, existing data migrated or deployment performed.

### Audit and migration

Before migration, `ContactPageClient.jsx` posted JSON to `/api/contact`. The server validated it, saved to `contact_messages`, and called EmailJS for an office notification and optional citizen auto-reply. The browser did not call EmailJS directly. The admin inbox already reads `contact_messages` independently of notification delivery.

The EmailJS endpoint, fallback service/template IDs, public/private key references and contact auto-reply code were removed from the active route. No other runtime email implementation was found in `app/`, `components/` or `lib/`. No EmailJS package was installed, so no package removal was needed. Old private environment entries were not overwritten/deleted; they are unused. Historical audit documentation can still mention EmailJS.

There is **one office notification only**, addressed exclusively to `RESEND_TO_EMAIL`. A validated citizen email can be Reply-To. No citizen confirmation email is sent. There is no EmailJS fallback or second-provider delivery.

## Environment configuration

Server-side variables:

```dotenv
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

- `RESEND_API_KEY`: private Resend API key with permission to send for the intended sender domain.
- `RESEND_FROM_EMAIL`: one sender mailbox; a display-name form such as `Office <sender@your-verified-domain>` is also supported.
- `RESEND_TO_EMAIL`: one bare office recipient address. Lists/CC/BCC are not accepted through this setting.
- Never prefix these variables with `NEXT_PUBLIC_`. Restart the running Next.js process after changing environment configuration, and configure the same names on the hosting platform before a separately authorized deployment.

The existing local `.env` already contains all three variables, and their syntax passed a no-network check. **This does not verify API-key authorization, domain ownership, recipient approval or deliverability.** The private values were neither printed nor changed. A built-client scan found zero files containing the configured Resend key.

### Sender-domain verification

Add the intended sender domain in the correct Resend account and enable/verify its sending capability. Add the exact DNS records shown by Resend for that domain (SPF/DKIM and any required return-path records) and wait for verification. Confirm the configured From address belongs to that verified domain and the API key is permitted to send for it. Domain status was not checked through the live account during this task. See Resend’s [domain verification guidance](https://resend.com/changelog/domain-verification-events) and [sending-domain requirements](https://resend.com/migrate/mailgun).

No DNS or mailbox configuration was changed automatically.

## Submission and notification behavior

1. Rate-limit and validate JSON, required fields, mobile number, optional email and honeypot.
2. Save the original contact fields to the existing `contact_messages` collection **before any provider request**.
3. Atomically claim the stored notification and send one office email using Resend with a ten-second request timeout and a stable provider idempotency key.
4. Record safe notification metadata in the same document. Raw provider messages, credentials and citizen content are not logged as diagnostics.
5. Return HTTP **201** and `{ success: true, email: { contact: { sent: ... } } }` once the message is saved, even if configuration, sending or notification-result persistence fails.

The existing frontend success/error UI and fields remain unchanged. An invisible request key and duplicate-submit guard were added. The optional `email.autoReply` response entry was removed along with the unapproved citizen email. The unchanged admin inbox continues to see the saved citizen fields even when Resend fails; its screens were not extended to display notification metadata.

Malformed JSON returns 400. A persistence failure returns a sanitized 500 without a provider send. Existing production rate-limit settings (five contact attempts per ten minutes per process/IP bucket) now apply to the contact endpoint in development as well. Existing process-local rate-limit architecture was retained.

### Safe results

New documents may include:

- `submissionHash`: hash of normalized contact fields, only when a submission key is supplied.
- `notification.provider`: `resend`.
- `notification.status`: `pending`, `sending`, `sent`, `failed`, `not_configured` or `unknown`.
- `notification.providerId`: returned provider identifier on acceptance.
- `notification.code`: fixed internal failure/configuration code; no raw provider response.
- `notification.attemptedAt`: actual server attempt time.

These are additive metadata, not a schema reset or required migration for old records. **`sent` means provider acceptance, not confirmed inbox delivery.** No delivery webhook or background worker was added.

The citizen receives only a generic saved-message notice when email is unavailable, without provider IDs/errors or configuration details. Development-mode raw Resend SDK error logging is suppressed in favor of fixed-code diagnostics.

## Duplicate and retry protection

- The public form generates a random UUID per submission and retains it across failed requests with the same values. It rotates after success or when the form values change.
- The optional `Idempotency-Key` header maps to a deterministic ObjectId using a hash; the existing MongoDB `_id` unique index prevents concurrent duplicate inserts. No extra index or collection is required. The raw request key is not stored.
- Reusing the key with different normalized content returns 409 instead of overwriting a citizen’s message.
- An atomic notification claim prevents simultaneous provider sends. Accepted notifications are not sent again. Known rejected/unconfigured notifications can be attempted against the same saved record without inserting another message.
- The provider idempotency key is tied to the saved record ID; retries reuse the immutable submission time/content. Resend documents a [24-hour deduplication window](https://resend.com/docs/dashboard/emails/idempotency-keys). Persisted acceptance prevents an automatic resend after that window as well.
- Ambiguous network/provider outcomes remain `unknown`; process interruptions may leave `sending`. Neither is blindly retried. Result-write failure also leaves the claim closed. These need operator review before any separately authorized resend to avoid duplicate delivery.
- There is no new public resend endpoint, cron or automatic retry of historical contact messages. `notifyStoredContact` operates only on an existing document. Legacy clients without the optional header still work, but two separate header-free POSTs are treated as two submissions. A browser reload/new form session also starts a new key; this is not content-based deduplication of independently submitted messages.

## Email template

Subject: **New Website Enquiry — Sachin Lavate Office**.

Both HTML and plain-text bodies contain citizen name, mobile, optional email, message, actual submission date/time in IST and the fixed website source `/contact`. They explicitly identify a **website contact enquiry, not a civic complaint**. All user-supplied HTML text is escaped. The subject and recipient are never derived from citizen text.

## Executed isolated checks

| Check | Result |
| --- | --- |
| `npm run test:contact` | PASS, 12 groups using actual contact route/helper with fake Resend and in-memory MongoDB; no `.env`, live API call or real database write. |
| Input handling | PASS required/mobile/email validation, CRLF/multiple-@ rejection, malformed JSON, invalid key, rate limit and honeypot. |
| Persistence and office notification | PASS saved first, one office send, Reply-To validation, safe accepted result, no citizen auto-reply. |
| Provider/configuration failures | PASS missing API key/from/to, malformed settings, rejection, exception and uncertain outcome; saved message retains HTTP 201. |
| Retries | PASS repeated, concurrent and notification-only retries; no duplicate record or accepted send; changed content with reused key rejected. |
| Escaping and diagnostics | PASS HTML injection escaping, readable plain text, no credentials/provider messages/citizen content leaked in responses or logs. |
| Admin inbox | PASS through the unchanged authorized inbox route after notification failure. |
| Durability faults | PASS insertion failure prevents send; claim/result-write failure after persistence does not turn the saved submission into a failure. |
| Browser contact checks | PASS actual browser with **all APIs intercepted**: retry key retained, changed/new message key rotated, duplicate submit guarded, existing success UI after saved notification failure, form reset and 430px overflow check. |
| `npm run test:production` | PASS, nine broader isolated groups; contact checks now delegate to the Resend suite instead of obsolete EmailJS expectations. |
| `npm run lint` | PASS. |
| `npm run build` | PASS, all 35 static pages generated and dynamic API routes compiled. |
| Local configuration / client build | Three variables present, syntax valid, configured Resend key absent from client files. Live authentication/domain status not tested. |

Evidence: `phase6-resend-check-results.json`, `phase6-browser-check-results.json`, `phase6-configuration-check-results.json` and refreshed `route-check-results.json`.

## Remaining live verification

1. Confirm the verified sending domain and key permissions in Resend.
2. Confirm `RESEND_TO_EMAIL` is the approved office test recipient and refresh/restart the app process after configuration changes.
3. Obtain explicit approval for one real test contact submission, which creates a MongoDB record and sends an office email.
4. Verify the saved message in admin, the provider result ID/status, and actual recipient inbox/spam-folder receipt. API acceptance alone is not an inbox-delivery guarantee.
5. Do not send a citizen confirmation email, resend uncertain messages, delete test records or deploy without separate authorization.

## Files changed in Phase 6

- `app/api/contact/route.js`: EmailJS removal, persistence-first Resend dispatch, safe errors and idempotent requests.
- `lib/contactNotification.server.js`: server-side config validation, escaped templates, official SDK notification and safe result recording.
- `app/contact/ContactPageClient.jsx`: invisible retry key and duplicate-submit guard; existing rendered design preserved.
- `package.json`, `package-lock.json`: official Resend SDK and contact-only test command.
- `scripts/contact-resend-checks.cjs`: isolated API/helper and admin-visibility tests.
- `scripts/contact-browser-checks.cjs`: intercepted browser retry and success behavior tests.
- `scripts/production-route-checks.cjs`: remove obsolete EmailJS expectations, delegate contact regression tests and correctly model exclusion projections.
- `docs/PHASE6_RESEND_MIGRATION.md`: this handover report.
- `docs/phase6-resend-check-results.json`, `docs/phase6-browser-check-results.json`, `docs/phase6-configuration-check-results.json`, `docs/route-check-results.json`: executed verification evidence.

Earlier admin, public-design and production-audit changes already present in the workspace were preserved. No other CMS/complaint/Cloudinary logic, MongoDB configuration, `.env` values or deployment settings were changed for this migration.
