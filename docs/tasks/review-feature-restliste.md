# Review: feature-restliste

**Dato:** 2026-04-09
**Formaal:** konkret restliste per feature for ekte brukertesting og produksjon
**Kildegrunnlag:** kodebase, `tests/e2e/admin.spec.ts`, `docs/tasks/review-release-readiness-audit.md`, `docs/tasks/review-preprod-readiness.md`

## Kort konklusjon

Appen er ikke "helt ferdig" hvis det betyr at alle flater er like godt bevist i runtime.

Det som er ferdig nok til aa regnes som kjerne:

- public site
- booking
- admin auth
- inquiry -> client -> project -> booking
- templates
- mail-kjerne

Det som fortsatt i hovedsak gjenstaar er:

- bredere manuell slutt-test
- push/PWA-avklaring
- launch-/preview-gate
- svakere verifiserte sekundaarflater som kalender, search og notifications

## Feature-matrise

| Feature | Kode-status | Runtime-status | Launch-kritisk | Vurdering | Gjenstaar |
|---|---|---|---|---|---|
| Public site | finnes og er ryddig modulert | public-ruter og browser-smoke er bekreftet | ja | `ferdig nok` | siste manuelle smoke-pass i preview/prod-lignende miljo |
| Booking | komplett skjema, referansebilder, success-state | offentlig flyt med bilder er tidligere verifisert, admin pipeline er verifisert | ja | `ferdig nok` | siste ende-til-ende manuell pass mot valgt release-kandidat |
| Admin auth | Clerk + Convex er pa plass | bekreftet i runtime og committed Playwright | ja | `ferdig nok` | behold som del av launch-smoke |
| Inquiries | liste + detail finnes | detail er verifisert i admin-spec via pipeline | ja | `ferdig nok` | manuell sjekk av statusendring som del av sluttpass |
| Clients | liste + detail finnes | create/detail er verifisert via admin-spec | ja | `ferdig nok` | manuell sjekk av notatflyt om ønskelig |
| Projects | detail og relasjoner finnes | prosjektflyt og booking-opprettelse er verifisert | ja | `ferdig nok` | manuell sjekk av estimate/deposit/accounting-felter |
| Bookings | backend, list og opprettelse finnes | booking-opprettelse fra prosjekt er verifisert | ja | `ferdig nok` | manuell sjekk av redigering/avlysning hvis launch-scope |
| Dashboard | summary-kort og siste forespørsler finnes | indirekte dekket via auth/runtime, ikke dyp testet | nei | `delvis` | kort manuell sjekk i sluttpass |
| Calendar | egen side finnes og leser kommende bookinger | ikke dyp runtime-verifisert som egen feature | middels | `finnes men ikke bevist` | manuell test: bookinger vises riktig, link til prosjekt virker |
| Search | egen side finnes | ikke eksplisitt runtime-verifisert | middels | `finnes men ikke bevist` | manuell test: søk på kunde og inquiry gir relevante treff |
| Notifications | egen side og mutationer finnes | side renderer, men ikke alle notif-typer er bevist | middels | `delvis` | manuell test av navigasjon fra minst én virkelig notification |
| Mail inbox/thread | inbox, thread, linking og reply finnes | ekte inbound/outbound er verifisert | ja | `ferdig nok` | evt. mer committed dekning senere, ikke blokkende nå |
| Templates | CRUD finnes | committed Playwright verifiserer create/edit/delete | ja | `ferdig nok` | ingen kritiske hull nå |
| Settings | seksjoner finnes | runtime-render er verifisert | middels | `delvis` | manuell test av `Tving synkronisering` i valgt kandidat |
| Push/PWA | manifest, SW, push subscribe UI og sendPush finnes | push subscribe/send er ikke fullverifisert | avhenger av scope | `delvis` | enten verifiser VAPID subscribe/send, eller ta ut av launch-scope |
| Aftercare | sheet og send-action finnes | ikke eksplisitt ende-til-ende bevist i denne runden | nei | `finnes men ikke bevist` | manuell test dersom det skal brukes i første brukerpass |
| Review request | sheet og send-action finnes | ikke eksplisitt ende-til-ende bevist i denne runden | nei | `finnes men ikke bevist` | manuell test dersom det skal brukes i første brukerpass |
| Conta-status | felt og hjelpetekst finnes | ikke dyp runtime-verifisert | nei | `kan utsettes` | holder med manuell sjekk av feltlagring hvis ønskelig |
| PWA install/offline | manifest og offline shell finnes | ikke full install/offline-pass verifisert | nei | `kan utsettes` | test bare hvis PWA-opplevelse er launch-budskap |

## Tolking av statusene

- `ferdig nok`: funksjonen er sterk nok til ekte brukertesting og naer launch, gitt vanlig manuell sluttpass
- `delvis`: finnes og virker trolig, men mangler tydelig runtime-bevis eller bredde i testdekning
- `finnes men ikke bevist`: kode og UI finnes, men vi burde ikke late som dette er ferdig verifisert
- `kan utsettes`: ikke blant de viktigste launch-driverne akkurat naa

## Hva som er launch-kritisk naa

Disse sporene boer vaere med i neste manuelle sluttpass:

1. public site
2. booking
3. admin auth
4. inquiry -> client -> project -> booking
5. mail inbox/thread/reply
6. templates
7. settings mail-sync

## Hva som boer avgjores eksplisitt foer launch

### Push/PWA

Her maa dere velge én av to:

1. `launch-scope`
   Da maa `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PUBLIC_KEY` og `VAPID_PRIVATE_KEY` verifiseres med ekte subscribe/send.

2. `ikke launch-scope`
   Da behandles push som videre arbeid og skal ikke brukes som argument for at v1 er ferdig.

## Anbefalt neste manuelle pass

Kort og konkret:

1. Gaa gjennom public site paa mobil og desktop
2. Send en ekte booking med bilder
3. Gaa inquiry -> client -> project -> booking
4. Aapne calendar og bekreft at bookingen vises riktig
5. Kjor search paa kunde/inquiry
6. Aapne notifications og bekreft at minst én notification navigerer riktig
7. Aapne mail-thread, sync og reply
8. Opprett/rediger en template
9. Aapne settings og kjor `Tving synkronisering`

## Min anbefaling

Hvis maalet er ekte brukertesting snart, er appen naer nok til at dere boer slutte aa lete etter flere generelle forbedringer og heller gjøre en fokusert sluttpass paa sekundaarflatene.

Det viktigste uavklarte produktsporet er ikke booking eller mail lenger. Det er om push/PWA skal vaere ekte launch-scope, og om kalender/search/notifications skal vaere "godt nok testet" eller "hard-verifisert" foer produksjon.
