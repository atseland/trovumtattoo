# Review: release-readiness-audit

**Dato:** 2026-04-08
**Audit-scope:** full parity mot working tree
**Kildehierarki:** `PRD.md` > `PRD_UI.md` > `TASKS*.md` > `README.md` / `docs/RULES.md` / `AGENTS.md` > `PROSJEKTBESKRIVELSE.md`

## Oppdatering 2026-04-09

- `convex/auth.config.ts` bruker naa prosjektets Clerk issuer `https://united-piranha-14.clerk.accounts.dev` som fallback.
- `.env.local.example` og `README.md` dokumenterer naavaerende issuer og JWKS.
- `E2E_CLERK_USER_EMAIL='aleksander.seland@gmail.com' pnpm playwright test tests/e2e/admin.spec.ts` passerer.
- `tests/e2e/admin.spec.ts` dekker naa ogsaa prosjekt -> opprett booking, med verifisert bookingliste i admin.
- Samme admin-spec verifiserer naa ogsaa at `mail`, `notifications` og `settings` renderer i autentisert runtime med forventede seksjoner eller empty states.
- Samme admin-spec verifiserer naa ogsaa `templates` i autentisert runtime: opprett, rediger og slett av meldingsmal.
- Admin-auth er dermed ikke lenger blokkert av issuer-mismatch i repooppsettet.

## Baseline

- Branch: `main`
- HEAD: `c8041e7` (`fix(public): mobile nav, hero positioning, artist intro centering, section widths`)
- Working tree: omfattende lokale endringer i public/admin/UI + nye modulmapper i `convex/lib/*` og `src/components/*`
- Diff-omfang: `41 files changed, 1403 insertions(+), 1889 deletions(-)` pluss untracked mapper
- Funn tagges som:
  - `HEAD`: finnes i siste commit og i dagens kode
  - `working-tree`: bare observert i lokale endringer
  - `begge`: gjelder uavhengig av baseline

## Verifikasjon

| Kommando | Resultat | Notat |
|---|---|---|
| `pnpm typecheck` | pass | Ingen TypeScript-feil |
| `pnpm lint` | pass m/warnings | 4 warnings i `convex/_generated/*` om ubrukt `eslint-disable` |
| `pnpm test:run` | pass | 1 fil, 2 tester, begge grønne |
| `pnpm build` | pass | Next build fullfoeres og genererer forventede ruter |
| `pnpm test:e2e` | fail | Timeout paa `config.webServer` etter 60000ms |

Tilleggsnotat:

- `pnpm lint` feilet én gang med `ENOENT` mot `test-results/` mens `lint` og `test:e2e` ble kjort parallelt. Isolert `pnpm lint` passerer. Dette er en verifikasjonsrace, ikke et stabilt lint-brudd i repoet.

## Runtime-bevis

- Public-ruter svarte paa `localhost`: `/`, `/book`, `/booking-info`, `/faq`, `/aftercare`, `/privacy`, `/api/health`
- `http://127.0.0.1:3000` svarte ikke paa denne maskinen, mens `http://localhost:3000` svarte normalt
- `curl -I http://localhost:3000/admin` ga Clerk-protect rewrite og `signed-out`
- Playwright snapshot av `/book` bekrefter lastet booking-side med komplett skjema og suksess-/submit-flate
- Playwright aapning av `/admin` endte paa Clerk sign-in med `redirect_url=http://localhost:3000/admin`
- Clerk-testinnlogging via `@clerk/testing` fungerer
- Målrettet admin-e2e passerer etter at issuer er satt korrekt i repooppsettet

## Hvor langt har vi kommet?

### Public site

Status: langt kommet

- Forsiden er modulert i egne home-seksjoner og bruker reelle artwork-assets i `public/artworks/`
- Booking-info, FAQ, aftercare og privacy eksisterer som egne public-ruter
- Metadata, canonical, OG og Twitter Card er lagt inn per public-side
- Health endpoint, manifest og service worker er paa plass

Vurdering:

- `implemented` for public shell, SEO-basics og informasjonsarkitektur
- `partial` for release-bevis, siden bare en minimal e2e-test finnes

### Booking

Status: funksjonelt naer, men ikke parity-verifisert ende-til-ende

- Booking-skjemaet er komplett i UI og valideres med RHF + Zod
- `createInquiryWithSideEffects` oppretter inquiry, aktivitetslogg og notifikasjon
- Booking-suksess-state finnes i klientflyten
- Referansebilder er koblet inn i UI og dataflyt

Vurdering:

- `partial`
- Hovedgrunn: bildeopplasting for anonym bruker er sannsynligvis feil implementert i backend-grensesnittet

### Admin

Status: bredt implementert og naa delvis runtime-verifisert

- Clerk-beskyttelse paa `/admin/*` er bekreftet
- Dashboard, inquiries, clients, projects, mail, templates, notifications, search, settings og calendar har egne ruter
- Detaljvisninger er brutt ut i egne seksjoner og hooks

Vurdering:

- `implemented` for struktur og dataoverflater
- `partial` for runtime, fordi bare kjerneflyten er verifisert forelopig

### Clients / Projects / Bookings

Status: modell og UI eksisterer

- `clients`, `projects` og `bookings` er definert i schema og koblet til admin-ruter
- Inquiry detail kan opprette klient
- Project detail viser relasjoner, estimat, depositum, accounting, bookinger og aktivitetslogg

Vurdering:

- `partial`
- Mangler runtime-bevis for komplett inquiry -> client/project -> booking-kjede uten datatap

### Mail / Templates

Status: implementert i kode, ikke fullt verifisert i runtime

- IMAP sync, SMTP send, mailkonto i UI, thread/detail og templates finnes i kodebasen
- Cron for mail sync finnes

Vurdering:

- `partial`
- Avhenger av reell mail-konfig og autentisert admin-sesjon for ende-til-ende-verifisering

### Notifications / Push / PWA

Status: delvis ferdig

- PWA-manifest og service worker er til stede
- Push-subscription UI finnes
- Server-side push-action finnes og cron-baserte notification triggers finnes

Vurdering:

- `partial`
- Clienten forventer `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, men dette er ikke dokumentert i `.env.local.example`

### Auth / Security

Status: god grunnmur

- Admin-ruter er beskyttet via Clerk middleware
- Mail, templates, projects, clients, bookings og notifications sjekker auth i Convex
- Response headers viser CSP/HSTS/XFO/XCTO/Permissions-Policy i runtime

Vurdering:

- `implemented`
- Residualrisk: mail, notifications og oevrige admin-omraader mangler fortsatt full runtime-dekning

### Ops / Verifikasjon

Status: ikke release-klar

- `typecheck`, `vitest` og `build` er gronne
- `test:e2e` er roed
- `lint` er sbar for artifacts/race hvis den kjoeres samtidig med Playwright

Vurdering:

- `partial`

## Parity-matrise

| Omraade | Dok-claim | Kodebevis | Runtime-bevis | Status | Severity | Tiltak |
|---|---|---|---|---|---|---|
| public site | Public site, SEO-lag og artist-front skal vaere paa plass | `src/app/(public)/*`, `src/components/public/home/*`, `public/artworks/*` | Public-ruter lastet, metadata/OG observert i HTML og Playwright | implemented | medium | Utvid e2e utover home/load |
| booking | Booking med referansebilder skal fungere offentlig | `src/app/(public)/book/BookPageClient.tsx`, `useInquirySubmission.ts`, `convex/inquiries.ts` | UI lastet; ingen trygg runtime-test mot backend kjoert | partial | high | Verifiser i isolert env og rett upload-grensesnitt |
| booking uploads | Public upload skal fungere | `useInquirySubmission` kaller `api.storage.generateUploadUrl()`; `convex/storage.ts` krever auth | Statisk bekreftet mismatch; ikke kjoert mot backend | partial | high | Gjor upload-URL offentlig for bookingflyt eller lag dedikert public mutation |
| admin auth | `/admin/*` skal vaere beskyttet | `src/proxy.ts` | Clerk redirect bekreftet med curl og Playwright | implemented | medium | Legg til auth-e2e for innlogget bruker |
| admin flate | Inquiries, clients, projects, mail, templates, settings, notifications skal finnes | Egne ruter og komponentseksjoner i `src/app/admin/*`, `src/components/admin/*`, `tests/e2e/admin.spec.ts` | Clerk-login, kjerneflyt, template CRUD og basis runtime-pass for mail/settings/notifications er bekreftet med committed Playwright-test | implemented | medium | Ta reelle mail-handlinger i senere pass |
| clients/projects/bookings | Pipeline fra inquiry til prosjekt/bookinger skal vaere operativ | `src/app/admin/inquiries/[id]/page.tsx`, `src/app/admin/projects/[id]/page.tsx`, `convex/bookings.ts`, `convex/projects.ts`, `tests/e2e/admin.spec.ts` | Committed Playwright dekker naa inquiry -> client -> project -> booking | implemented | medium | Verifiser redigering/ombooking i senere pass |
| mail/templates | one.com mail light og templates er i v1-scope | `convex/mail/*`, `src/app/admin/mail/*`, `src/app/admin/templates/page.tsx` | Ikke verifisert uten mailkonto/admin-login | partial | medium | Verifiser med reell konto eller preview-miljo |
| notifications/push/PWA | PWA og push-varsler skal fungere | `public/manifest.json`, `src/components/ServiceWorkerRegistration.tsx`, `src/components/admin/PushSubscriptionManager.tsx`, `convex/mail/sendPush.ts` | Manifest/health/public shell bekreftet; push ikke verifisert | partial | medium | Dokumenter og sett `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, test subscribe/send |
| ops/verifikasjon | Repo skal vaere verifiserbart mot launch | `package.json`, `playwright.config.ts`, `eslint.config.mjs` | `test:e2e` timeout; `localhost` virker, `127.0.0.1` virker ikke | partial | high | Standardiser Playwright til `localhost` eller env-styrt host |
| docs/prosess | Docs/specs/tasks/handoffs skal brukes aktivt | `README.md`, `docs/`, `justfile`, `AGENTS.md` | `docs/specs`, `docs/tasks`, `docs/handoffs` var tomme foer auditten | doc-stale | medium | Normaliser dokumenthierarki og fyll operative docs |

## Dokumentasjonsaudit

### Dokumentrangering

- `PRD.md`: autoritativt og stort sett korrekt
- `PRD_UI.md`: autoritativt og i hovedsak i sync med live UI-struktur
- `TASKS.md`: autoritativ historikk, men stale som ferdigbevis
- `TASKS_UI.md`: autoritativ historikk, men stale som ferdigbevis
- `README.md`: autoritativt men stale
- `docs/RULES.md`: autoritativt men veldig tynt
- `PROSJEKTBESKRIVELSE.md`: derivert dokument, maa synkes eller arkiveres
- `docs/specs/`, `docs/tasks/`, `docs/handoffs/`: prosessgjeld foer denne auditten

### Konkrete dokumentavvik

1. `README.md` bruker fortsatt tittelen `tmpscaffold` i stedet for faktisk prosjektnavn.
2. `README.md` beskriver `docs/specs`, `docs/tasks` og `docs/handoffs` som etablerte arbeidsflater, men de var i praksis tomme foer auditten.
3. `TASKS.md` og `TASKS_UI.md` markerer alt som ferdig, mens runtime-verifisering fortsatt har roede eller uverifiserte spor.
4. `.env.local.example` mangler `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, som klientkoden forventer for push-subscribe.
5. `PROSJEKTBESKRIVELSE.md` overlapper `PRD.md` og boer ikke fungere som parallell fasit uten synkstrategi.

## Launch blockers

1. `test:e2e` er roed. `playwright.config.ts` peker paa `127.0.0.1`, mens appen paa denne maskinen svarer paa `localhost`.
2. Booking med referansebilder er ikke parity-sikker. Offentlig klientflyt bruker `api.storage.generateUploadUrl`, men backend krever auth i `convex/storage.ts`.
3. Reelle mail-handlinger mangler fortsatt runtime-verifisering som innlogget bruker.

## Core parity gaps

1. Testdekningen er fortsatt tynn relativt til produktflaten, men admin-kjernen dekker naa ogsaa bookingopprettelse i committed e2e.
2. Push-varsler er bare delvis ferdige som operativ feature fordi klient-env ikke er dokumentert.
3. Reelle mail-handlinger er implementert i kode, men mangler fortsatt auditbevis i runtime.
4. Dokumenthierarkiet er uklart: for mange dokumenter beskriver samme produktlag med ulik autoritet.

## Polish / docs cleanup

1. Oppdater `README.md` til faktisk prosjektidentitet, reelle oppstarts- og verifikasjonssteg og riktig dokumenthierarki.
2. Formaliser `docs/specs`, `docs/tasks` og `docs/handoffs` som aktive arbeidsflater, ikke bare beskrevet struktur.
3. Avklar rollen til `PROSJEKTBESKRIVELSE.md`: synk mot `PRD.md` eller arkiver.
4. Vurder om generated warnings i `convex/_generated/*` skal ignoreres eksplisitt i ESLint for mindre stoy.

## Remediation-backlog

| Prioritet | Scope | Problem | Forventet filomraade | Verifikasjon | Commit |
|---|---|---|---|---|---|
| P0 | ops/test | E2E peker mot feil host og timeout-er | `playwright.config.ts` | `pnpm test:e2e` | `fix(test): standardiser playwright host` |
| P0 | booking/backend | Offentlig bildeopplasting er auth-blokkert | `convex/storage.ts`, `src/components/public/booking/useInquirySubmission.ts` | manuell booking med bilder + admin inquiry detail | `fix(booking): gjor offentlig bildeflyt gyldig` |
| P0 | qa | Verifiser inquiry -> client -> project -> booking med innlogget admin | `tests/e2e/*` evt. MCP-pass + note | ny e2e eller dokumentert manuell pass | `test(admin): dekk kjernepipeline` |
| P1 | docs/onboarding | README er stale og misvisende | `README.md` | lesbar onboarding fra blank maskin | `docs(readme): synk onboarding med repoet` |
| P1 | env/docs | Push-varsler mangler klient-env i dokumentasjon | `.env.local.example`, evt. `README.md` | manuell subscribe-test | `docs(env): dokumenter public vapid key` |
| P1 | qa | Verifiser reelle mail-handlinger i autentisert runtime | `tests/e2e/*` eller auditnotat | manuell eller automatisert pass | `test(admin): verifiser mail-handlinger` |
| P2 | docs/process | Normaliser dokumentautoritet og reduser dobbel dokumentasjon | `PROSJEKTBESKRIVELSE.md`, `README.md`, `docs/*` | review av dokumenthierarki | `docs(process): normaliser produktdokumenter` |
| P2 | tooling | Reduser lint-stoy fra generated Convex-filer | `eslint.config.mjs` | `pnpm lint` | `chore(lint): ignorer generated convex warnings` |

## Endrede filer

- `docs/specs/release-readiness-audit.md`
- `docs/tasks/review-release-readiness-audit.md`

## Testet

- [x] Typesjekk
- [x] Tester
- [x] Manuell sjekk
