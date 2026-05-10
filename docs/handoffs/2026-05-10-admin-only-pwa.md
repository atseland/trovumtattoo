# Handoff 2026-05-10: Admin-only PWA

## Status

Public-facing flate er ferdig implementert og lokalt verifisert. Den skal ikke vaere en PWA.

Siste relevante lokale commits:
- `dd1bab9 feat(public): add seo geo readiness`
- `3dbc23d fix(public): add studio geo metadata`

Gjenstaar public sign-off:
- Eier/tatovør maa bekrefte public tekst, spesielt etterbehandling og annen helserelatert copy.
- Produksjonssmoke gjenstaar til push/deploy er eksplisitt godkjent.

## Beslutning

PWA/push skal kun gjelde admin-flaten under `/admin`.

Public routes skal ikke:
- registrere service worker
- eksponere install-manifest
- vise push-subscription UI
- caches/offline-behandles som PWA app-shell

Det er greit aa fjerne gammel/global PWA-funksjonalitet og starte paa nytt med admin-only PWA.

## Viktige filer for neste context

- `AGENTS.md`
- `docs/tasks/pre-live-finalization-2026-05-10.md`
- `docs/RULES.md`
- `public/sw.js`
- `public/manifest.json`
- `public/offline.html`
- `src/components/ServiceWorkerRegistration.tsx`
- `src/app/layout.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/admin/PushSubscriptionManager.tsx`
- `convex/pushSubscriptions.ts`
- `convex/mail/sendPush.ts`
- `convex/schema.ts`

## Neste prompt

```text
Vi fortsetter i /Users/33selale/Projects/active/trovumtattoo_v2.

Ikke push eller deploy før jeg sier fra.

Les først:
- AGENTS.md
- docs/tasks/pre-live-finalization-2026-05-10.md
- docs/handoffs/2026-05-10-admin-only-pwa.md
- relevante PWA/push/admin notification-filer:
  - public/sw.js
  - public/manifest.json
  - public/offline.html
  - src/components/ServiceWorkerRegistration.tsx
  - src/app/layout.tsx
  - src/app/admin/layout.tsx
  - src/app/admin/settings/page.tsx
  - src/components/admin/PushSubscriptionManager.tsx
  - Convex notification/push actions/mutations/schema

Viktig arkitekturbeslutning:
PWA skal være admin-only. Publikumsflaten skal ikke være en PWA.
Det er greit å fjerne gammel/global PWA-funksjonalitet og starte på nytt med kun `/admin`.

Status:
- Public-facing flate er ferdig implementert og lokalt verifisert.
- Gjenstår public sign-off: eierbekreftelse på tekst og senere produksjonsdeploy/smoke.
- Siste lokale commits inkluderer:
  - dd1bab9 feat(public): add seo geo readiness
  - 3dbc23d fix(public): add studio geo metadata

Oppgave nå:
Utfør PWA push notifications local-only for `/admin`:
- Fjern gammel/global PWA-registrering fra public/root.
- Ikke gjør public routes installable som PWA.
- Ikke rør SEO/GEO eller public copy.
- Lag admin-only manifest/scope/start_url for `/admin`.
- Registrer service worker kun fra admin-flaten.
- Service worker scope skal være `/admin/` hvis mulig.
- Service worker må håndtere `push` og `notificationclick`.
- Notification click skal åpne riktig admin-route, default `/admin/notifications`.
- VAPID frontend/server/Convex env-bruk skal valideres tydelig.
- Admin UI skal vise om push er konfigurert/ikke konfigurert.
- Test push skal gi synlig feil ved manglende config.
- Hvis gammel root-scoped service worker kan henge igjen hos brukere, implementer eller dokumenter trygg cleanup/migrering.
- Legg til smal testdekning der det gir mening.
- Verifiser lokalt og commit.
- Ikke push/deploy.

Forventet sluttrapport:
- Hva som ble fjernet fra gammel PWA.
- Hva som nå er admin-only.
- Hvilke kommandoer/tester som ble kjørt.
- Commit hash.
```
