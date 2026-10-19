# Complaint office notifications

The registration route validates the request, uploads an optional attachment using the existing Cloudinary path, and saves the complaint before attempting Resend. The response remains `{ success: true, complaintId, status: "Under Review" }` with HTTP 201 when the complaint is saved, even if notification fails.

The server reuses `resendConfiguration` and HTML escaping from the existing contact notification module. Configuration remains `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL`. No configuration or credentials were changed.

The email contains the complaint ID, category, location, IST submission time, initial status, up to 600 characters of description, and the authenticated complaints dashboard URL on the canonical domain already used in public metadata. No name, phone, address, attachment, admin key, or citizen auto-reply is added. The description/location remain user-entered content and may themselves contain personal information; emails are sent only to the configured office recipient.

## Reliability

- The public form supplies a UUID `Idempotency-Key`, retained for retries of identical form data. A synchronous guard prevents duplicate submits. Successful registration resets the key. No markup or public design was changed.
- The API derives a deterministic MongoDB `_id` from that key; MongoDB's existing unique `_id` index prevents concurrent duplicate records. A private hash detects changed payloads using an existing key and returns 409.
- Replays return the original complaint ID without uploading again or starting another notification. Without the optional key, legacy clients remain supported but separate requests are separate registrations.
- Existing six-digit complaint ID generation, unique complaint-ID index and collision retry are preserved.
- Only a newly persisted complaint is notified. An atomic `pending` to `sending` claim protects one office attempt, with a Resend idempotency key derived from the complaint ID.
- Metadata is stored in the complaint's additive private `notification` field: provider, status, attemptedAt, optional providerId or fixed diagnostic code. Status values: pending, sending, sent, failed, not_configured, unknown. Complaint business statuses/history are unchanged.
- `sent` means provider accepted, not confirmed inbox delivery. Ambiguous outcomes and failures are not automatically retried. A process interruption can leave pending/sending metadata requiring manual review; there is no background retry worker.
- If result persistence fails, the sending claim stays closed. MongoDB remains the source of truth.
- Admin detail displays only a safe notification label. Public tracking retains its existing explicit projection and excludes all notification metadata, submission hashes and private citizen fields.

## Executed verification

- `npm run test:complaint`: eight isolated check groups, real route/helper code, mocked MongoDB/Cloudinary/Resend; success, provider failures, missing configuration, record and send deduplication, persistence/upload failures, ID collision recovery, HTML escaping, attachment handling, privacy, and all four admin status/comment updates.
- `npm run test:contact`: existing twelve isolated contact regression groups passed.
- `npm run test:production`: existing nine production-route check groups passed using fixtures only.
- `npm run lint`: passed.
- `npm run build`: passed, all 35 static pages generated.
- No live emails, production writes, uploads, cleanup or deployment were performed for Phase 7.

## Remaining live acceptance

Requires explicit approval for a clearly labelled test complaint and its office notification. Verify HTTP 201, one MongoDB record, admin inbox notification label, provider ID, public tracking/privacy, and recipient inbox arrival. A live photo test requires separately approved image upload. Do not automatically retry ambiguous outcomes or delete test records.
