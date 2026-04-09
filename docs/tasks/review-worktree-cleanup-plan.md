# Review: worktree-cleanup-plan

**Dato:** 2026-04-09
**Formaal:** konkret oppryddingsplan for dagens skitne worktree foer ekte brukertest og produksjonskandidat
**Basert paa:** `git status`, `git diff --stat`, representative diff-pass og verifisert commit-linje til og med `03d444e`

## Kort vurdering

Worktree-en er ikke uryddig fordi én enkelt endring er feil. Den er uryddig fordi flere fornuftige endringer er blandet sammen i samme lokale flate:

- artifacts og midlertidige filer
- docs som ikke er del av release-kjerne
- public UI-refaktor
- booking-form refaktor
- admin detail-refaktor
- Convex-/alias-opprydding

Det riktige er ikke aa behandle dette som én stor commit. Det riktige er aa splitte i smaale, verifiserbare bunker og holde release-kandidaten liten.

## Bunker i worktree

### 1. Ren stoy eller ikke-release-materiale

Disse boer ikke vaere del av en release-kandidat slik de står nå:

- `.playwright-cli/`
- eventuelle gamle screenshots/logs/artifacts under samme mappe

Anbefalt handling:

- slett lokalt eller legg i `.gitignore` hvis mappen brukes videre som arbeidsverktøy
- ikke commit dette sammen med produktkode

## 2. Docs som maa vurderes separat

Disse er ikke nødvendigvis feil, men de bør ikke ri sammen med produktendringer:

- [PROSJEKTBESKRIVELSE.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/PROSJEKTBESKRIVELSE.md)
- [docs/specs/release-readiness-audit.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/docs/specs/release-readiness-audit.md)
- [docs/handoffs/2026-04-08-2311.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/docs/handoffs/2026-04-08-2311.md)
- [docs/handoffs/2026-04-09-0127.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/docs/handoffs/2026-04-09-0127.md)

Vurdering:

- audit-spec og handoffs er legitime prosessfiler og kan commits som en ren docs-bunke
- `PROSJEKTBESKRIVELSE.md` er stor og bør bare commit-es hvis dere faktisk vil vedlikeholde den som produktdokument; ellers bør den holdes utenfor release-kandidaten

Anbefalt commit:

- `docs(process): legg inn audit-spec og handoffs`

## 3. Public booking-refaktor

Dette ser ut som en naturlig, avgrensbar bunke:

- [src/app/(public)/book/BookPageClient.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/(public)/book/BookPageClient.tsx)
- [src/app/(public)/book/loading.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/(public)/book/loading.tsx)
- [src/components/public/booking/BookingContactSection.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingContactSection.tsx)
- [src/components/public/booking/BookingFlagsSection.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingFlagsSection.tsx)
- [src/components/public/booking/BookingNotesSection.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingNotesSection.tsx)
- [src/components/public/booking/BookingReferenceImagesSection.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingReferenceImagesSection.tsx)
- [src/components/public/booking/BookingSuccessState.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingSuccessState.tsx)
- [src/components/public/booking/BookingTattooDetailsSection.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/BookingTattooDetailsSection.tsx)
- [src/components/public/booking/bookingFormTypes.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/booking/bookingFormTypes.ts)

Vurdering:

- dette ser ut som en ren komponentisering av allerede fungerende booking-UI
- lav til middels risiko, men brukerflyten er for viktig til å merges uten re-test

Minste verifikasjon:

- `pnpm typecheck`
- målrettet Playwright/manual pass for public booking med og uten bilder

Anbefalt commit:

- `refactor(booking): del opp public bookingskjema`

## 4. Public shell / home / styling

Dette er en egen bunke og bør ikke blandes med bookinglogikk:

- [src/app/(public)/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/%28public%29/page.tsx)
- [src/app/(public)/aftercare/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/%28public%29/aftercare/page.tsx)
- [src/app/(public)/booking-info/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/%28public%29/booking-info/page.tsx)
- [src/app/(public)/faq/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/%28public%29/faq/page.tsx)
- [src/app/(public)/privacy/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/%28public%29/privacy/page.tsx)
- [src/components/public/home/HomeHero.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/home/HomeHero.tsx)
- øvrige filer i [src/components/public/home/](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/home/)
- [src/components/public/PublicHeader.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/PublicHeader.tsx)
- [src/components/public/PublicFooter.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/public/PublicFooter.tsx)
- [src/components/Logo.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/Logo.tsx)
- [src/components/ui/Btn.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/ui/Btn.tsx)
- [src/components/ui/Eyebrow.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/ui/Eyebrow.tsx)
- [src/components/ui/FormField.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/ui/FormField.tsx)
- [src/components/ui/Rule.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/ui/Rule.tsx)
- [src/app/globals.css](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/globals.css)

Vurdering:

- dette er en visuell/layout-messig refaktor med middels risiko
- den berører shared UI primitives og global styling, så den kan påvirke hele appen

Minste verifikasjon:

- `pnpm typecheck`
- manuell browser-pass på `/`, `/book`, `/faq`, `/aftercare`, `/privacy`
- mobil og desktop

Anbefalt commit:

- `refactor(public): del opp home og stram inn shell`

## 5. Admin detail-refaktor

Dette er den største og mest risikable bunken. Den bør deles videre.

### 5A. Inquiry + client detail

Filer:

- [src/app/admin/inquiries/[id]/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/admin/inquiries/%5Bid%5D/page.tsx)
- [src/app/admin/clients/[id]/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/admin/clients/%5Bid%5D/page.tsx)
- [src/components/admin/inquiry-detail/InquiryDetailSections.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/inquiry-detail/InquiryDetailSections.tsx)
- [src/components/admin/client-detail/ClientDetailSections.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/client-detail/ClientDetailSections.tsx)
- [src/components/admin/client-detail/useClientNotes.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/client-detail/useClientNotes.ts)
- [src/components/admin/CreateClientSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/CreateClientSheet.tsx)
- [src/components/admin/StatusChangeSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/StatusChangeSheet.tsx)

Anbefalt commit:

- `refactor(admin): del opp inquiry- og klientdetaljer`

### 5B. Project detail

Filer:

- [src/app/admin/projects/[id]/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/admin/projects/%5Bid%5D/page.tsx)
- alle filer i [src/components/admin/project-detail/](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/project-detail/)
- [src/components/admin/BookingSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/BookingSheet.tsx)
- [src/components/admin/AftercareSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/AftercareSheet.tsx)
- [src/components/admin/ReviewRequestSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/ReviewRequestSheet.tsx)

Anbefalt commit:

- `refactor(admin): del opp prosjektdetaljer`

### 5C. Templates + mail thread

Filer:

- [src/app/admin/templates/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/admin/templates/page.tsx)
- [src/components/admin/templates/TemplateSections.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/templates/TemplateSections.tsx)
- [src/components/admin/templates/useTemplateEditor.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/templates/useTemplateEditor.ts)
- [src/app/admin/mail/[threadId]/page.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/app/admin/mail/%5BthreadId%5D/page.tsx)
- [src/components/admin/mail-thread/useThreadReplyComposer.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/mail-thread/useThreadReplyComposer.ts)
- [src/components/admin/LinkThreadSheet.tsx](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/src/components/admin/LinkThreadSheet.tsx)

Vurdering:

- funksjonelt logisk som refaktor
- høyere risiko fordi dette berører allerede verifisert mail/thread-flyt

Anbefalt commit:

- `refactor(admin): del opp template- og mail-thread-visninger`

Minste verifikasjon for hele admin-refaktor-sporet:

- `pnpm typecheck`
- `E2E_CLERK_USER_EMAIL='aleksander.seland@gmail.com' pnpm playwright test tests/e2e/admin.spec.ts`

## 6. Convex-/alias-opprydding

Dette er en egen teknisk bunke:

- [convex/bookings.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/convex/bookings.ts)
- [convex/lib/bookings/mutations.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/convex/lib/bookings/mutations.ts)
- [convex/lib/bookings/queries.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/convex/lib/bookings/queries.ts)
- [convex/lib/inquiries/admin.ts](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/convex/lib/inquiries/admin.ts)
- [tsconfig.json](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/tsconfig.json)
- filer som er flyttet til `@convex/_generated/*`-alias

Vurdering:

- dette ser ut som lav-risiko strukturering, men alias-endringen sprer seg bredt
- bør derfor komme før admin-refaktorene som avhenger av aliaset, eller stages sammen med første av dem

Anbefalt commit:

- `refactor(convex): trekk ut bookinglogikk og aliaser`

Minste verifikasjon:

- `pnpm typecheck`

## Anbefalt rekkefolge

1. Fjern støy:
   - `.playwright-cli/`

2. Commit docs-only hvis ønsket:
   - audit-spec
   - handoffs
   - eventuelt `PROSJEKTBESKRIVELSE.md` som egen beslutning

3. Commit teknisk grunnmur:
   - Convex-/alias-opprydding

4. Commit public booking-refaktor

5. Commit public shell/home-refaktor

6. Commit admin detail-refaktor i tre egne steg:
   - inquiry/client
   - project
   - templates/mail

7. Kjor samlet verifikasjon paa kandidat:
   - `pnpm typecheck`
   - `pnpm lint`
   - `E2E_CLERK_USER_EMAIL='aleksander.seland@gmail.com' pnpm playwright test tests/e2e/admin.spec.ts`
   - relevant public smoke-pass
   - `just verify`

## Det jeg ville holdt utenfor release-kandidaten akkurat naa

- `.playwright-cli/`
- `PROSJEKTBESKRIVELSE.md` hvis dere ikke eksplisitt vil vedlikeholde den
- docs som ikke endrer operativ atferd, hvis målet er raskest mulig release-kandidat

## Praktisk konklusjon

Det finnes flere gode endringer i worktree-en. Problemet er ikke kvaliteten i seg selv, men at de ligger usplittet og uverifisert sammen.

Hvis målet er rask vei til release-kandidat, ville jeg gjort dette:

1. kast artifacts
2. la docs være sekundært
3. splitt kode i 4-6 små commits
4. verifiser etter hver bunke
5. bruk først da resultatet som kandidat for ekte brukertesting eller preview
