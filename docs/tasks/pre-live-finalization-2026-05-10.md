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
- PWA is admin-only. Public routes must not register a service worker, expose install metadata, or include push subscription UI.
- It is acceptable to remove the old/global PWA implementation and rebuild PWA around `/admin` only.
- SEO/GEO readiness should be handled in a dedicated implementation round.
- Portfolio carousel images should be optimized for carousel display while keeping full-size images available for a tap/click fullscreen modal.

## Remaining Work Before Finalization

### 1. Booking Archive For Actual Bookings

Status: implemented and authenticated-admin-smoked 2026-05-10.

Implement archive support for actual `bookings` rows.

Expected behavior:
- Admin can archive an actual booking only after it has status `completed` or `cancelled`.
- Completing or cancelling a booking does not auto-archive it.
- Archived bookings should be hidden from normal active booking lists.
- Archived bookings should be discoverable in an archive view or archive filter.
- Admin should be able to delete from archive if that is still intended after reviewing data retention needs.

Verification:
- Unit/backend policy tests added for allowed and disallowed archive states.
- Admin UI smoke added to Playwright for complete -> archive action becomes available, archive hides the booking from active project list, and archive filter shows it.
- Upcoming/calendar/dashboard/notification booking queries now filter archived bookings out.
- Authenticated `tests/e2e/admin.spec.ts` passed after resolving `E2E_CLERK_USER_EMAIL` from the Clerk dev instance and syncing Convex dev functions with `npx convex dev --once --tail-logs disable`.

### 2. Customer-Scoped New Mail

Status: implemented and production SMTP-smoked 2026-05-10.

Implement a way to compose a new outbound email from the app only for established customers.

Expected behavior:
- Entry point should be from a customer/client context, not a global free-form mail composer.
- Recipient must be an existing client/customer email.
- Outbound message should be stored as a mail thread/message in the existing mail model.
- Reuse existing SMTP config and send path patterns.

Verification:
- Admin entry point is on the customer detail page; no global free-form composer was added.
- Convex action accepts `clientId` only, resolves the existing client, and uses the stored client email as the only recipient.
- Sent mail is stored as a linked `mailThreads` + `mailMessages` outbound record after SMTP succeeds.
- SMTP errors are rethrown and surfaced in the sheet without writing a success thread/message.
- Policy tests added for required customer context, valid customer email, and required subject/body.
- Authenticated admin e2e passed the UI smoke for fixed recipient/disabled empty send.
- Initial SMTP smoke reached the real one.com SMTP send path but failed with `535 Authentication failed`; no false success thread was created.
- After production Convex mail credentials were updated and production functions deployed, production smoke returned `sent=true` and recorded an outbound thread.

### 3. Instagram Contact Target

Status: completed 2026-05-10.

Change public Instagram contact buttons from the profile URL to:

```txt
https://www.instagram.com/m/trovumtattoo/
```

Verification:
- `/kontakt` Instagram action uses the direct message URL.
- Homepage "Se mer på Instagram" and footer `@trovumtattoo` remain profile links intentionally because they are browse/profile links, not direct-message contact actions.
- `tests/e2e/home.spec.ts` updated for the direct-message contact URL.

### 4. PWA Push Notifications

Status: implemented and production-smoked 2026-05-14.

Push notifications are a must before final project closeout. PWA scope is admin-only.

Architecture decision:
- Public-facing routes (`/`, `/book`, `/kontakt`, `/booking-info`, `/faq`, `/aftercare`, `/privacy`) are not part of the PWA.
- Remove the current global/root PWA registration and root-scoped manifest behavior before rebuilding push.
- Admin PWA should use `/admin` as `start_url` and an admin-limited scope where the platform allows it.
- Service worker registration should happen only from the admin surface.
- Existing users may have a root-scoped service worker from earlier builds; implementation must either unregister it safely or document the migration/cleanup path.

Implementation notes:
- Removed the global/root service worker registration from the root layout.
- Removed the old root-scoped `public/manifest.json`, `public/sw.js`, and `public/offline.html` assets.
- Added admin-only install metadata at `/admin/manifest.webmanifest` with `/admin` start URL and scope.
- Added admin-only service worker route at `/admin/service-worker.js` with `push` and `notificationclick` handling.
- Notification clicks are clamped to admin routes and fall back to `/admin/notifications`.
- Admin layout is the only app surface that advertises the manifest and mounts service worker registration.
- Admin service worker registration unregisters legacy root-scope workers and clears old browser caches before registering the admin worker in production.
- Push subscription now uses the admin service worker registration explicitly.
- Admin settings now includes a test-push action.
- Push send action now requires authentication and throws on missing server VAPID config instead of silently returning a false success.
- Production VAPID keys are configured in both Vercel and Convex production.
- `/admin/manifest.webmanifest` and `/admin/service-worker.js` are intentionally readable without an admin session so the browser can install/read PWA assets; the admin UI itself remains auth-protected.

Verification:
- Public routes do not register a service worker and do not advertise a PWA manifest.
- Local `/manifest.json` and `/sw.js` return 404 after removing the root PWA assets.
- Admin route registers the admin-only service worker and exposes install/push capability only there.
- Service worker script handles push and notification click routing, defaulting to `/admin/notifications`.
- Missing frontend VAPID config disables subscribe/test controls visibly in admin.
- Missing Convex/server VAPID config throws from the test-push action and is surfaced in admin as an error toast.
- Local verification: `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `pnpm build`, `tests/e2e/home.spec.ts`, and Playwright CLI public-home smoke passed.
- Admin e2e was invoked locally but skipped by the existing Clerk/Convex skip condition in this environment.
- Production HTTPS smoke passed with the audit admin user in a persistent Chromium profile: admin login worked, notification permission was granted, `/admin` service worker registered with scope `/admin`, browser push subscription was created, and the admin test-push send path returned the success UI.
- Physical OS notification-click was not machine-clicked in automation; the click target path remains covered by the service-worker implementation and unit test, defaulting to `/admin/notifications`.

### 5. SEO/GEO Readiness

Status: implemented locally 2026-05-10; pending owner review and next deploy batch.

Current metadata baseline is not enough for final SEO/GEO readiness.

Expected additions to review:
- `robots` and `sitemap`.
- Structured data such as `TattooParlor`/local business JSON-LD.
- Page titles/descriptions for public routes.
- Local search signals for Tigr Tattoo/Sandvika context.
- Image alt/caption quality for portfolio and public pages.
- GEO/LLM-readable business/service content without adding spammy copy.

Verification:
- Robots and sitemap metadata routes added for public pages, with admin/auth surfaces excluded.
- Shared SEO constants now ground public route titles/descriptions, canonical URLs, OG/Twitter metadata, and JSON-LD.
- LocalBusiness/TattooParlor JSON-LD renders on the public layout with Sandvika/Tigr Tattoo service context.
- JSON-LD includes Tigr Tattoo Google Maps URL and studio coordinates from the confirmed Maps listing.
- Homepage, contact, booking info and portfolio copy now include clearer local/service signals and stronger portfolio alt/captions.
- Local Playwright coverage checks homepage metadata, JSON-LD, robots.txt and sitemap.xml.
- Build passes locally.
- Production smoke confirms indexable public pages after the next approved deploy.

### 6. Portfolio Carousel Optimization And Fullscreen Preview

Status: implemented locally 2026-05-10; pending owner visual review and next deploy batch.

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
- Fullscreen preview shows title/caption and supports previous/next controls.
- Carousel uses `sizes` for display assets and full-screen `object-contain` image in the modal.
- Missing Instagram post URL does not render a broken link.
- Local Playwright coverage added for opening the fullscreen preview and closing it with Escape.
- Instagram feed is deferred until exact feed approach/post source is chosen. Current public-copy slice only adds profile links under portfolio images.

### 7. Public Copy Approval

Status: open; public info-copy is now exposed in the mobile hamburger menu for owner/artist review.

Aftercare and other public informational text exists, but final approval is not documented.

Expected behavior:
- Public informational copy, especially aftercare text, is reviewed and approved by the business owner/tattoo artist.
- Any health-sensitive wording is made conservative and non-diagnostic.

Verification:
- Approval is recorded in a task or handoff before final project closeout.
- Mobile hamburger menu shows a review note plus booking info, FAQ, aftercare, and contact copy snippets for walkthrough.
