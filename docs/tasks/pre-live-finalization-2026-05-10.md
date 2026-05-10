# Pre-Live Finalization 2026-05-10

## Scope

Active checklist for work that must be resolved or explicitly deferred before final project closeout and production push.

This file tracks launch-readiness gaps discovered after the repo cleanup and post-cleanup audit. It is not a record of completed cleanup work.

## Confirmed Decisions

- Actual bookings are separate from booking inquiries. Inquiries already have archive/restore/permanent-delete flows.
- Actual bookings should also be archivable, but only when they have been marked `completed` or `cancelled`.
- Booking archive should be a manual admin action. Completion or cancellation must only unlock the archive action, not auto-archive.
- New outbound mail from the app should be possible only for established customers. This is not a general-purpose mail service.
- Public Instagram contact links should use `https://www.instagram.com/m/trovumtattoo/`.
- PWA push notifications are required before final project closeout, but should be handled in a dedicated implementation round.
- SEO/GEO readiness should be handled in a dedicated implementation round.
- Portfolio carousel images should be optimized for carousel display while keeping full-size images available for a tap/click fullscreen modal.

## Remaining Work Before Finalization

### 1. Booking Archive For Actual Bookings

Status: open.

Implement archive support for actual `bookings` rows.

Expected behavior:
- Admin can archive an actual booking only after it has status `completed` or `cancelled`.
- Completing or cancelling a booking does not auto-archive it.
- Archived bookings should be hidden from normal active booking lists.
- Archived bookings should be discoverable in an archive view or archive filter.
- Admin should be able to delete from archive if that is still intended after reviewing data retention needs.

Verification:
- Unit/backend tests for allowed and disallowed archive states.
- Admin UI smoke for complete/cancel -> archive action becomes available.
- Regression check that upcoming/calendar views do not show archived bookings.

### 2. Customer-Scoped New Mail

Status: open.

Implement a way to compose a new outbound email from the app only for established customers.

Expected behavior:
- Entry point should be from a customer/client context, not a global free-form mail composer.
- Recipient must be an existing client/customer email.
- Outbound message should be stored as a mail thread/message in the existing mail model.
- Reuse existing SMTP config and send path patterns.

Verification:
- Admin cannot send arbitrary new mail without selecting an established customer.
- Sent mail appears in the customer's mail history.
- SMTP failure is surfaced clearly and does not create misleading success state.

### 3. Instagram Contact Target

Status: open.

Change public Instagram contact buttons from the profile URL to:

```txt
https://www.instagram.com/m/trovumtattoo/
```

Verification:
- `/kontakt` Instagram action uses the direct message URL.
- Homepage/footer Instagram contact actions are reviewed and intentionally either use direct message or profile URL.

### 4. PWA Push Notifications

Status: open, dedicated round.

Push notifications are a must before final project closeout.

Known gap:
- Subscription UI and backend send action exist.
- Service worker must handle `push` and `notificationclick` events.
- VAPID environment variables must be verified for both frontend and Convex runtime.

Verification:
- Admin can subscribe in production over HTTPS.
- Test push displays a native notification.
- Clicking notification opens the intended admin route.
- Missing/invalid VAPID config fails visibly in admin.

### 5. SEO/GEO Readiness

Status: open, dedicated round.

Current metadata baseline is not enough for final SEO/GEO readiness.

Expected additions to review:
- `robots` and `sitemap`.
- Structured data such as `TattooParlor`/local business JSON-LD.
- Page titles/descriptions for public routes.
- Local search signals for Tigr Tattoo/Sandvika context.
- Image alt/caption quality for portfolio and public pages.
- GEO/LLM-readable business/service content without adding spammy copy.

Verification:
- Build passes.
- Metadata renders for key public pages.
- Structured data validates.
- Production smoke confirms indexable public pages.

### 6. Portfolio Carousel Optimization And Fullscreen Preview

Status: open.

Optimize portfolio carousel display while preserving access to full-size images in a fullscreen modal.

Expected behavior:
- Carousel uses appropriately sized display assets or Next image sizing for fast page load.
- Tapping/clicking an image opens a fullscreen preview.
- Fullscreen preview can show title/caption.
- Fullscreen preview can include a link to the relevant Instagram post when a post URL exists.
- Missing Instagram post URL should not break the modal.

Verification:
- Desktop and mobile carousel images load without horizontal layout bugs.
- Modal opens/closes via pointer, keyboard, and escape.
- Full-size image is loaded only when preview is opened or otherwise justified.
- Instagram link opens the correct post when present.

### 7. Public Copy Approval

Status: open.

Aftercare and other public informational text exists, but final approval is not documented.

Expected behavior:
- Public informational copy, especially aftercare text, is reviewed and approved by the business owner/tattoo artist.
- Any health-sensitive wording is made conservative and non-diagnostic.

Verification:
- Approval is recorded in a task or handoff before final project closeout.
