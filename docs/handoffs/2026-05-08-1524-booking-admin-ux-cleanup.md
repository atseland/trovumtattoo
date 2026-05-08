# Handoff: booking/admin UX cleanup

## Gjort

- Public booking-CTA er endret til `Bookingforespørsel`, med ny `/kontakt`-side for e-post, kopier e-postadresse og Instagram.
- Bookingtype er gjort om fra checkboxer til radiovalg med `Dette er en ny tatovering` som vanlig request.
- Felles `SelectField` har mørk select/option-styling for public og admin.
- Bookingforespørsel forsøker nå å sende bekreftelsesmail via Convex action `mail/sendInquiryConfirmation`.
- Varsler er flyttet til toppbar ved Clerk-knappen, og fjernet fra `Mer`/sidebar-nav.
- Admintekst er endret fra `Opprett klient` til `Opprett kunde`.
- Forespørsler har arkiv/gjenopprett/permanent slett fra arkiv. Permanent slett blokkeres hvis inquiry er koblet til prosjekt.
- Mailtråder har arkiv/gjenopprett/permanent slett, og inbox-rader har swipe-left/knapp for arkivering.
- E2E-tester er oppdatert for public kontakt/booking, admin labels, inquiry-arkiv og mail-arkivflater.

## Verifikasjon

- `pnpm typecheck` pass
- `pnpm lint` pass med eksisterende Convex generated-file warnings
- `pnpm test:run` pass
- `pnpm playwright test tests/e2e/home.spec.ts` pass
- `pnpm playwright test tests/e2e/admin.spec.ts` skipped av testens Clerk/Convex preconditions
- `just verify` pass

## Merknader

- `npx convex codegen` ble kjørt og oppdaterte generated API-bindinger.
- Bekreftelsesmail er best-effort: inquiry opprettes selv om SMTP/miljøvariabler mangler, og feilen logges på inquiry activity log.
- Mail permanent-delete er kun eksponert i arkivvisning/thread for arkivert tråd, men mutasjonen validerer ikke status eksplisitt.
