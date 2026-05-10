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
- Public reference uploads er bundet til inquiry-token.
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
- Instagram og Facebook bruker faktiske brand-ikoner; telefonikonet beholdes.
- Instagram-ikonet i hero peker til `https://instagram.com/trovumtattoo`, ikke Instagram DM.
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
- Vercel error logs for siste sjekk viste ingen error logs.

## Gjenstående Arbeid

Videre arbeid skal behandles som siste UI/UX- og innholdsfasen.

### UI/UX Og Owner Review

- Public copy approval, spesielt aftercare og helserelatert tekst.
- Visuell gjennomgang av public homepage utenom låst hero og låst portfolio, booking, kontakt, FAQ, aftercare og privacy.
- Mobile/desktop polish etter faktisk gjennomgang.
- Admin UX polish der det ikke krever backend-kontraktendring.

### Live Smoke Og Akseptanse

- Admin push notification HTTPS-smoke med godkjent adminbruker.
- Test push skal vise native notification.
- Notification click skal åpne riktig admin-route eller `/admin/notifications`.
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
- Deploye til production hvis oppgaven bare var lokal UI-iterasjon, med mindre bruker ber om live.

## Tillatt Videre Arbeid Uten Ny Backend-Avklaring

- Copy, tekst, lenker og informasjonsarkitektur på public flater.
- Layout, spacing, responsive polish og tilgjengelighet på public/admin UI.
- Portfolio presentasjon og modal polish så lenge datakilder/kontrakter ikke endres.
- Playwright/Vitest coverage for UI-regresjoner.
- Handoff/task-dokumentasjon for owner review og UI-lås.
- Live smoke av eksisterende deploy uten kodeendring.
