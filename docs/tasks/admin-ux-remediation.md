# Admin UX Remediation

**Dato:** 2026-04-10
**Kilde:** admin-ux-audit mot `src/app/admin` og `src/components/admin`
**Maal:** bryte UX-funn ned i sma, implementerbare tasks for admin-kjernen

## Taskliste

- [x] `ux-admin-01` Gjør kalender-CTA-er ekte
  Bytt ut misvisende `Ny booking`-knapp og tom `Gå til prosjekter`-action med en faktisk navigasjonssti til et sted brukeren kan finne prosjektet.

- [x] `ux-admin-02` Eksponer booking-vedlikehold fra prosjektsiden
  Gjør eksisterende bookinger klikkbare eller gi dem tydelige handlinger for `rediger`, `ombook` og `avlys`, slik at `BookingSheet`-støtten faktisk er tilgjengelig i UI.

- [x] `ux-admin-03` Gi prosjektflaten sterkere identitet
  Vis klientnavn, evt. inquiry-navn og kort sammendrag i header slik at brukeren vet hvilket prosjekt som er aapent uten aa maatte lese relasjonsseksjonene.

- [x] `ux-admin-04` Gjør dashboardkort operative
  La oppsummeringskortene navigere til relevant filtrert arbeidsflate, slik at dashboard fungerer som cockpit i stedet for ren statusvisning.

- [x] `ux-admin-05` Utvid admin-soek til faktisk arbeidssoek
  Inkluder minst prosjekter og bookinger, eller ton funksjonen tydelig ned til `kunder + foresporsler` hvis det er bevisst scope.

- [x] `ux-admin-06` Tydeliggjør lagringsstatus pa prosjektsiden
  Vis `ulagrede endringer`, `lagret` eller tilsvarende per seksjon slik at seksjonsvise save-knapper ikke skaper tvil.

- [ ] `ux-admin-07` Stram inn klientoversiktens gjenfinningssignal
  Suppler klientlisten med tydeligere siste aktivitet eller prosjektstatus, slik at brukeren lettere velger riktig klient uten aa maatte klikke seg inn.

- [x] `ux-admin-08` Vurder notifications som prioriteringsflate
  Bekreft at varselradene navigerer robust, og vurder tydeligere skille mellom prioriterte og historiske varsler.

## Rekkefolge

1. `ux-admin-01`
2. `ux-admin-02`
3. `ux-admin-03`
4. `ux-admin-04`
5. `ux-admin-05`
6. `ux-admin-06`
7. `ux-admin-07`
8. `ux-admin-08`

## Status

- `ux-admin-01` er ferdig.
- `ux-admin-02` er ferdig.
- `ux-admin-03`, `ux-admin-04` og `ux-admin-05` er ferdig.
- `ux-admin-06` er ferdig.
- `ux-admin-08` er ferdig for robust varselnavigasjon.
- `ux-admin-07` er neste anbefalte task.
