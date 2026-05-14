# Current State

**Dato:** 2026-05-10  
**Status:** Backend/core låst. Videre arbeid skal primært være UI/UX, innhold, owner review og live smoke.

Denne filen er styrende for videre implementeringer i repoet. Den beskriver hva som anses ferdig, hva som er låst, og hvilke typer endringer som krever eksplisitt godkjenning før de gjøres.

## Styrende Regler

- Les denne filen før alle nye implementeringsøkter.
- Ikke endre låst backend/core automatisk bare fordi en UI/UX-oppgave berører samme flyt.
- Backend/core kan bare åpnes igjen hvis brukeren eksplisitt ber om backend-endring, sikkerhetsfiks, datamodellendring, deploy-fiks eller bugfix som ikke kan løses i UI-laget.
- Nye UI/UX-endringer skal være smale, verifiserbare og ikke endre sikkerhets-, auth-, mail-, upload- eller datamodellkontrakter uten eksplisitt godkjenning.
- Hvis en UI/UX-endring avdekker backend-behov, stopp og rapporter behovet som eget funn før implementering.

## Låst Backend/Core

Følgende områder vurderes ferdig for nåværende scope og skal behandles som låst:

### Auth Og Admin Policy

- Clerk-basert adminflate er beskyttet av eksplisitt admin-allowlist.
- Eneste godkjente admin-e-poster:
  - `aleksander.seland@gmail.com`
  - `elkritrovum@gmail.com`
- `TROVUM_ADMIN_EMAILS` er satt i både Vercel production og Convex production.
- Convex admin queries/mutations/actions bruker delt `requireAdmin(ctx)` der de er admin-only.
- `/sign-up` er ikke lenger eksponert som fungerende signup-flate.

### Public Inquiry Og Upload

- Public booking/inquiry-flow oppretter inquiry i Convex.
- Public booking phone input assumes Norwegian numbers and strips `+47`/`0047` before submission/storage.
- Public reference uploads er bundet til inquiry-token.
- Public reference images optimaliseres i browseren før upload med mål om ca. 1.5 MB per bilde, 3 MB fallback-grense, JPEG-output og maks langside 2560 px.
- Upload-token valideres server-side og konsumeres etter vellykket attach.
- Serveren validerer filtype, størrelse og maks antall referansebilder.
- Ugyldige nye uploads slettes der serveren kan validere og rydde opp.

### Mail

- Cron mail sync bruker intern Convex action.
- Manuell mail sync krever admin og har throttling/sanitert feilrespons.
- Inquiry confirmation er idempotent med sent/attempt timestamps og cooldown.
- Ny outbound mail er customer-scoped og kan bare sendes fra eksisterende kunde/client-kontekst.
- Mail credentials er server-side miljøvariabler og skal ikke lagres fra admin-UI.

### Booking Og Admin Dataflyt

- Booking archive for faktiske bookings er implementert.
- Bare `completed` og `cancelled` bookings kan arkiveres.
- Arkiverte bookings skjules fra aktive lister og kan håndteres via archive-filter.
- Inquiry archive/restore/permanent-delete flows er implementert.
- Client/project/inquiry/admin dataflyt er operativ.

### Admin PWA Og Push-Struktur

- PWA-laget er admin-only under `/admin`.
- Public routes registrerer ikke service worker og eksponerer ikke public install-manifest.
- Gammel root-scoped service worker/assets er fjernet.
- Admin service worker, manifest, push subscription og test-push struktur er implementert.
- Push notification clicks clamps til admin-ruter med `/admin/notifications` som fallback.

### SEO/GEO Runtime-Flater

- `robots.txt` og `sitemap.xml` finnes.
- Public route metadata og JSON-LD er implementert.
- Admin/auth-flater er ekskludert fra public SEO-surface.

### Effektivitet Og Hardening

- Relevante Convex-indekser for auditfunnene er lagt inn og deployet til production.
- Admin-søk er bounded og bruker felles policy.
- Nåværende søk er ikke ekte all-history global search. Det er en bevisst begrensning, ikke et åpent backend-krav i denne fasen.
- Booking `datetime-local` bruker lokal formattering.
- Project detail form reset skjer ikke lenger som render-time state mutation.

## Låst Public UI

Følgende public UI-områder vurderes ferdig gjennomgått og skal behandles som låst:

### Public Home Hero

- Public home hero i `src/components/public/home/Layout11Home.tsx` er ferdig justert og låst.
- Hero har ikke lenger subtitle-tekst under profilbildet.
- Instagram, Facebook og TikTok bruker faktiske brand-ikoner; telefonikonet beholdes.
- Instagram-ikonet i hero peker til `https://instagram.com/trovumtattoo`, ikke Instagram DM.
- TikTok-ikonet i hero peker til `https://www.tiktok.com/@ellenkristinetrovum`.
- Telefonlenker på public UI peker til `sms:97090414`, ikke telefonsamtale.
- Bookingforespørsel/Kontakt-knappene ligger i normal flow under SoMe-ikonene med kontrollert toppmargin.
- `se arbeider`-lenken ligger fortsatt nederst i hero-viewporten.
- Videre endringer i hero layout, copy, ikonvalg eller CTA-plassering krever eksplisitt brukerbeskjed om å åpne hero-scope igjen.

### Public Home Portfolio

- Public home portfolio i `src/components/public/home/PortfolioCarousel.tsx` er ferdig justert og låst.
- Titler, captions og bilderekkefølge er owner-godkjent og skal ikke endres uten eksplisitt beskjed.
- Hvert porteføljekort har en `Se på instagram`-lenke med Instagram-ikon og korrekt post/reel-URL.
- Klikk/tap på bilde åpner fullscreen preview via body-level portal, med mobil fullscreen-regresjonstest.
- Modalens `Se på instagram`-lenke bruker samme post/reel-URL som kortet.
- Videre endringer i portfolio layout, captions, rekkefølge, modal eller Instagram-lenker krever eksplisitt brukerbeskjed om å åpne portfolio-scope igjen.

### Resterende Public Home

- Resterende public home-innhold i `src/components/public/home/Layout11Home.tsx` er ferdig justert og låst.
- Om meg-, service- og kontaktseksjonene på forsiden skal ikke endres automatisk i videre UI/UX-arbeid.
- Videre endringer i public home utenom allerede låst hero/portfolio krever eksplisitt brukerbeskjed om å åpne home-scope igjen.

### Public Booking Form

- Public booking form i `src/app/(public)/book/BookPageClient.tsx` og `src/components/public/booking/*` er ferdig justert og låst.
- Booking-copy bruker 3 virkedager og personlig førsteperson.
- Størrelse, budsjett, ønsket tidsrom og referansebilder har owner-godkjente hjelpetekster/placeholders.
- Telefonfeltet antar norske numre og lagrer ikke `+47`/`0047`.
- Referansebilder optimaliseres i browseren før upload uten ekstra forklaring i UI.
- Videre endringer i booking form copy, feltstruktur, telefonpolicy eller reference-image upload UX krever eksplisitt brukerbeskjed om å åpne booking-scope igjen.

### Public Booking Info

- Public booking info-siden i `src/app/(public)/booking-info/page.tsx` er ferdig justert og låst.
- Introen før prisestimering er kortet ned til at booking skjer via bookingforespørsel, med CTA til `/book`.
- Prisestimering beholder faktorer for størrelse, tidsbruk, plassering og prosjekttype: ny tatovering, cover-up eller touch-up.
- Depositum-copy er owner-godkjent: innbetaling bekrefter booking/time, depositum trekkes fra totalprisen, er ikke et tillegg, refunderes ikke ved avlysning, og flytting krever minst 48 timers varsel for å beholde depositumet.
- Prosesslisten avsluttes med at etter timen får kunden med et etterbehandlingsskjema som hjelper gjennom helningsprosessen.
- Videre endringer i booking info layout, CTA-er, pris-, depositum- eller prosesscopy krever eksplisitt brukerbeskjed om å åpne booking info-scope igjen.

### Public Navigation Og Hamburgermeny

- Public navigation i `src/components/public/PublicHeader.tsx` er ferdig justert og låst.
- FAQ-label er `Spørsmål og svar`.
- Hamburgermenyen viser ikke beskrivelser under menypunktene og har ikke `Informasjon til gjennomgang`-boksen.
- Hamburgermenyens vanlige lenkeliste viser ikke `Kontakt`; kontakt ligger som egen CTA-knapp.
- Hamburgermenyens CTA-er er like brede og står i rekkefølgen `Kontakt` før `Bookingforespørsel`.
- Videre endringer i public navigation, hamburgermeny, nav-labels eller CTA-rekkefølge krever eksplisitt brukerbeskjed om å åpne navigation-scope igjen.

### Public FAQ

- Public FAQ-siden i `src/app/(public)/faq/page.tsx` og `src/app/(public)/faq/FaqAccordion.tsx` er ferdig justert og låst.
- Hovedtittel er `Spørsmål og svar`, uten intro-tekst under tittelen.
- Første svar gjør bookingforespørsel til standard vei, med Instagram/Facebook som meldingkanaler hvis kunden er usikker på noe før innsending.
- Svarene om hva kunden bør sende inn, cover-up, pris, depositum og svartid er owner-godkjent.
- FAQ-bunnen har CTA-en `Har du en ide du vil utforske?` med `Send bookingforespørsel`, etterfulgt av `Fant du ikke det du lurte på?` med `Kontakt`.
- Videre endringer i FAQ layout, spørsmål, svar eller CTA-er krever eksplisitt brukerbeskjed om å åpne FAQ-scope igjen.

## Live-State

Siste låste backend/core-versjon er deployet live.

- Git commit: `b39263f fix(audit): close review hardening gaps`
- Vercel production deployment: `dpl_DSJtWLnwnxHXeWuYsRZhKX6ncg1z`
- Live URL: `https://trovumtattoo.no`
- Convex production: `https://beloved-duck-952.eu-west-1.convex.cloud`

Siste live-verifikasjon:

- `just verify` passerte.
- Vercel deployment var `Ready`.
- `/` returnerte HTTP 200.
- `/api/health` returnerte HTTP 200 med `status: ok`.
- `/sign-up` returnerte HTTP 404.
- `/admin` redirectet signed-out bruker til `/sign-in`.
- Public `/manifest.json` og `/sw.js` returnerte HTTP 404.
- Admin `/admin/manifest.webmanifest` og `/admin/service-worker.js` returnerte HTTP 200 uten sign-in redirect.
- Admin push subscription og test-push send path ble production-smoket med godkjent audit-admin i persistent Chromium-profil.
- Vercel error logs for siste sjekk viste ingen error logs.

## Gjenstående Arbeid

Videre arbeid skal behandles som siste UI/UX- og innholdsfasen.

### UI/UX Og Owner Review

- Public copy approval, spesielt aftercare og helserelatert tekst.
- Visuell gjennomgang av kontakt, FAQ, aftercare og privacy.
- Mobile/desktop polish etter faktisk gjennomgang.
- Admin UX polish der det ikke krever backend-kontraktendring.

### Live Smoke Og Akseptanse

- Fysisk OS notification-click kan eventuelt bekreftes manuelt fra en faktisk admin-enhet.
- Owner/artist må godkjenne public copy før endelig prosjekt-closeout.

## Endringer Som Krever Eksplisitt Godkjenning

Ikke gjør disse automatisk i videre UI/UX-økter:

- Endre Convex schema, indexes eller datamodell.
- Endre admin allowlist, Clerk/JWT/auth policy eller route access.
- Endre upload-tokenkontrakt, filgrenser eller storage-policy.
- Endre mail send/sync-kontrakter eller SMTP/IMAP-konfig.
- Endre PWA scope fra admin-only.
- Gjøre admin-søk til all-history/global search.
- Legge til ny public backend API-overflate.
- Endre låst public home hero uten eksplisitt beskjed om å åpne hero-scope igjen.
- Endre låst public home portfolio uten eksplisitt beskjed om å åpne portfolio-scope igjen.
- Endre låst resterende public home uten eksplisitt beskjed om å åpne home-scope igjen.
- Endre låst public booking form uten eksplisitt beskjed om å åpne booking-scope igjen.
- Deploye til production hvis oppgaven bare var lokal UI-iterasjon, med mindre bruker ber om live.

## Tillatt Videre Arbeid Uten Ny Backend-Avklaring

- Copy, tekst, lenker og informasjonsarkitektur på public flater.
- Layout, spacing, responsive polish og tilgjengelighet på public/admin UI.
- Portfolio presentasjon og modal polish så lenge datakilder/kontrakter ikke endres.
- Playwright/Vitest coverage for UI-regresjoner.
- Handoff/task-dokumentasjon for owner review og UI-lås.
- Live smoke av eksisterende deploy uten kodeendring.
