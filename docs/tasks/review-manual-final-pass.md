# Review: manual-final-pass

**Dato:** 2026-04-09
**Formaal:** siste manuelle sluttpass mot lokal release-kandidat foer ekte brukertesting
**Kildegrunnlag:** lokal browser-pass, committed `tests/e2e/admin.spec.ts`, live Clerk/Convex-runtime, ekte mailkonto

## Endrede filer

- `src/components/ui/FormField.tsx`
- `docs/tasks/review-manual-final-pass.md`

## Testet

- [x] Typesjekk
- [x] Tester
- [x] Manuell sjekk

## Kort konklusjon

Kjerneflyten er naa sterk nok til ekte brukertesting.

Det manuelle sluttpasset bekreftet at:

- public desktop-ruter laster
- mobilmeny fungerer
- public booking kan sendes inn
- admin pipeline inquiry -> client -> project -> booking fungerer
- booking vises i calendar
- search finner den nye kunden/foresporselen
- templates create/edit/delete fungerer
- mail inbox/thread/reply fungerer
- settings `Tving synkronisering` fungerer

Det eneste klare tekniske funnet i denne runden var en tilgjengelighets- og testbarhetsglipp i `FormField`: labels var ikke koblet til controls. Det er rettet i denne runden.

## Hva som faktisk ble gjort

### Public

- Bekreftet `/, /booking-info, /faq, /aftercare, /privacy`
- Bekreftet mobilmeny paa forsiden
- Sendte inn en ekte public booking via skjema

### Admin runtime

- Logget inn som admin med Clerk-testbruker
- Fant ny foresporsel i admin
- Opprettet klient og prosjekt
- Opprettet booking fra prosjekt
- Bekreftet booking i calendar
- Bekreftet treff i search
- Opprettet, redigerte og slettet template
- Aapnet mail-thread og bekreftet reply composer
- Kjoerte `Tving synkronisering` fra settings og fikk suksess-state

## Funn

### Fikset i denne runden

- `src/components/ui/FormField.tsx` manglet `id/htmlFor`-kobling mellom label og input/textarea/select/file.
- Konsekvens: svakere tilgjengelighet og mindre robuste browser-tester, blant annet paa public booking.
- Status: rettet.

### Ikke bekreftet som bug

- En tidlig notifications-sjekk ble staaende paa `/admin/notifications`, men den traff sannsynligvis `Merk alle som lest` i stedet for selve varselraden.
- Dette er derfor ikke loggfort som bekreftet runtime-bug fra denne runden.

## Verifikasjon

- `pnpm typecheck`
- `just verify`
- manuell browser-pass mot lokal dev-runtime

## Vurdering foer ekte brukertesting

Appen er god nok til kontrollert ekte brukertesting.

Det som fortsatt ikke er like hardt bevist som booking/mail-kjernen er sekundaarflater som push/PWA og dypere notif-/kalender-variasjoner, men det er ikke det samme som at kjerneproduktet er blokkert.
