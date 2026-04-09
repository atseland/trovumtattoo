# Trovum Tattoo OS v1

## Rolle

Dette dokumentet er en kort prosjektbeskrivelse av hva produktet faktisk er per naa.

- [PRD.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/PRD.md) er fortsatt autoritativt for scope og produktkrav.
- Denne filen beskriver produktet slik det naa fremstar i kodebasen og den verifiserte runtime-flyten.

## Kort beskrivelse

Trovum Tattoo OS v1 er en mobile-first webapp for `trovumtattoo.no` bygget for én konkret tatovør.

Maalet er aa samle bookingforespørsler, kundedata, prosjekter, bookinger, mail og oppfølging i ett system, slik at arbeidet ikke lenger lever fragmentert i Instagram-DM, e-post, notater og manuelle huskelister.

Produktet er ikke en generell SaaS-plattform i v1. Det er et smalt operativsystem for en spesifikk arbeidsflyt.

## Produktet bestaar av

### 1. Public site

Public-siden fungerer som artist-side, tillitsflate og inngang til booking.

Det finnes per naa:

- forside
- booking-side
- booking-info
- FAQ
- aftercare
- privacy

Public-flaten er bygget som en editorial, mørk og premium artist-side med tydelig CTA mot booking.

### 2. Bookingforespørsel

Booking skjer via et strukturert skjema paa `/book`.

Skjemaet samler blant annet:

- navn
- e-post
- telefon
- Instagram-handle
- motivbeskrivelse
- plassering
- størrelse
- stil
- budsjett
- ønsket tidsrom
- første tattoo / cover-up / touch-up
- ekstra notater
- referansebilder

Innsending oppretter inquiry i systemet og leder brukeren til en tydelig success-state.

### 3. Adminflate

Admin er Clerk-beskyttet og bygget for mobilbruk først.

Det finnes per naa egne adminflater for:

- dashboard
- inquiries
- clients
- projects
- bookings via prosjektflyt
- mail
- templates
- notifications
- search
- settings
- calendar

Kjerneflyten som er bevist i runtime er:

`inquiry -> client -> project -> booking`

### 4. Kunde- og prosjektoppfølging

Appen har en enkel operativ pipeline for å følge opp kunder og prosjekter.

Per naa finnes blant annet:

- inquiry detail med status og referansebilder
- opprettelse av klient og prosjekt fra inquiry
- klientdetaljer med notater og relasjoner
- prosjektdetaljer med estimat, depositum, accounting-status, relasjoner, bookinger og aktivitet
- sheets for booking, aftercare og review request

Conta er fortsatt tenkt som økonomisk source of truth. Denne appen holder operativ status, ikke regnskap.

### 5. Mail i kontekst

Mail er integrert som workflow-komponent, ikke som full e-postklient.

Per naa finnes:

- inbox
- thread-visning
- kobling av thread til klient/prosjekt
- reply fra admin
- meldingsmaler
- one.com-oppsett laast server-side i Convex

Mailkontoen som brukes er `ellen@trovumtattoo.no`, konfigurert via `MAIL_*` i Convex.

### 6. Templates, aftercare og review request

Systemet har en enkel meldingsmal-flyt for standard kommunikasjon.

Per naa finnes:

- CRUD for templates
- aftercare-sheet
- review request-sheet

Dette er ment som lette arbeidsverktøy i samme adminkontekst, ikke et stort CRM- eller marketing-subsystem.

### 7. PWA og varsler

Produktet har grunnlag for PWA og varsler.

Per naa finnes:

- manifest
- service worker-registrering
- notification center
- push subscription UI
- server-side push-sti

Dette sporet er delvis implementert, men ikke like godt runtime-verifisert som booking, admin-kjerne og mail.

## Produktprinsipper

### Ett domene

Viktig kundereise og SEO-verdi skal bo paa `trovumtattoo.no`.

### Instagram er inngang, ikke system

Instagram driver trafikk og tillit, men selve workflowen skal skje i produktet.

### Mobil først

Admin skal vaere rask og lesbar paa mobil.

### Lav friksjon

Fa valg, tydelige handlinger og lite støy er viktigere enn bred feature-mengde.

### Mail i kontekst

Mail skal støtte arbeidsflyten rundt kunder og prosjekter, ikke erstatte en generell innboks-app.

### Smalt v1-scope

Appen er bygget for én tatovør, ikke for studiohierarki, multi-tenant SaaS eller avansert rollemodell.

## Det produktet ikke er i v1

Følgende er fortsatt utenfor scope:

- multi-tenant SaaS
- flere tatovører eller studiohierarki
- avanserte roller og permissions
- POS eller kassasystem
- full regnskapsmotor
- tung Conta-integrasjon
- full e-postklient
- nettbutikk
- full blogg/CMS
- avansert analytics
- AI som kjernefunksjon

## Teknisk grunnmur

Stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Convex
- Clerk
- Vitest
- Playwright

Autentisering skjer via Clerk i frontend og Convex auth i backend.

## Verifisert status per naa

Følgende er bekreftet i kode og runtime:

- admin auth fungerer
- public booking med referansebilder fungerer
- inquiry -> client -> project -> booking er verifisert i committed Playwright
- templates CRUD er verifisert i committed Playwright
- mail/settings/notifications renderer som innlogget admin
- ekte inbound mail til one.com-kontoen er synket inn i admin
- ekte outbound reply fra admin er mottatt utenfor appen
- mail-thread viser lesbar meldingstekst

## Det som fortsatt gjenstaar før produksjon

Koden er langt tydeligere og ryddigere enn tidligere, men produktet er ikke automatisk prod-klart av den grunn.

Det viktigste som fortsatt gjenstaar er:

- siste produksjonsavklaring av miljøvariabler og deploy-gate
- endelig launch-pass via `just launch-check`
- preview-/preprod-pass paa valgt release-kandidat
- endelig avklaring av push/VAPID hvis push skal være launch-scope

## Oppsummert

Trovum Tattoo OS v1 er naa et konkret, fungerende operativt system for en tatovør, ikke bare en idé eller en løs prototype.

Public site, booking, admin-kjerne, templates og mail er i praksis etablert som produktets hovedakse. Det som gjenstaar handler først og fremst om siste release-gating og produksjonsklargjøring, ikke om å finne ut hva produktet skal være.
