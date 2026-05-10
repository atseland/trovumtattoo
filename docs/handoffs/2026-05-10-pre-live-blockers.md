# Handoff 2026-05-10 Pre-Live Blockers

## Status

Repo cleanup and post-cleanup audit are complete. The repo is clean and ready for a final focused implementation session before the next live push.

Do not treat the cleanup handoff as the current launch checklist. The current source of truth for remaining blockers is:

- `docs/tasks/pre-live-finalization-2026-05-10.md`

## Read First In Next Session

1. `AGENTS.md`
2. `docs/RULES.md`
3. `docs/tasks/pre-live-finalization-2026-05-10.md`
4. This handoff

## Current Blockers

Implement or explicitly defer these before final project closeout:

1. Actual booking archive:
   - actual `bookings` rows should be manually archivable only after `completed` or `cancelled`
   - archive should not happen automatically
   - normal calendar/upcoming views should not show archived bookings

2. Customer-scoped new outbound mail:
   - admin should be able to compose a new mail only from an established customer/client context
   - no global arbitrary mail composer
   - sent mail should be stored in the existing mail thread/message model

3. Instagram contact target:
   - public contact action should use `https://www.instagram.com/m/trovumtattoo/`
   - review whether homepage/footer Instagram links should be DM or profile links

4. PWA push notifications:
   - must be completed before final closeout
   - existing subscription/backend pieces are not enough without service-worker `push` and `notificationclick` behavior plus env/runtime proof

5. SEO/GEO readiness:
   - add/review robots, sitemap, structured data, metadata, local business signals, and LLM-readable public content

6. Portfolio carousel:
   - optimize carousel image loading
   - add fullscreen modal for tapped/clicked images
   - support Instagram post links when available

7. Public copy approval:
   - aftercare and other public informational copy needs explicit approval before closeout

## Suggested Next Session Prompt

```text
Fortsett i /Users/33selale/Projects/active/trovumtattoo_v2.

Les først:
- AGENTS.md
- docs/RULES.md
- docs/tasks/pre-live-finalization-2026-05-10.md
- docs/handoffs/2026-05-10-pre-live-blockers.md

Ikke push/deploy ennå. Start med live-blockerne i pre-live-finalization. Implementer smalt, verifiser etter hvert punkt, oppdater task/handoff, og commit per sammenhengende oppgave.
```

## Verification Expectation

For code changes, use the narrowest useful verification first, then run broader verification before final handoff. Before any production push, run `just verify` and then verify actual Vercel/runtime health after deploy.
