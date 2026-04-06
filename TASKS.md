# TASKS.md — Trovum Tattoo OS v1

## Metaseksjon

### Bruksregler
1. Ta én oppgave om gangen. Les kun den aktuelle oppgavens seksjon — ikke les hele filen.
2. Kjør `/clear` mellom sesjoner for å nullstille konteksten.
3. Verifiser alltid med `pnpm typecheck && pnpm test:run && pnpm build` før commit.
4. Én oppgave = én git commit. Bruk commit-formatet nedenfor.
5. Convex-backend MÅ kjøre i separat terminal med `npx convex dev` under utvikling.
6. shadcn-komponenter installeres med `pnpm dlx shadcn@latest add <komponent>`.
7. Opprett ikke nye tabeller eller endre schema.ts — skjemaet er ferdig definert.

### Stack
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4
- shadcn/ui (style: new-york, baseColor: zinc, cssVariables: true)
- Convex (reaktiv backend) + Clerk (auth, én admin-bruker)
- Vitest + Playwright + Sentry (deaktivert i dev)
- React Hook Form + Zod + Zustand + Sonner (toasts)

### Convex-notater
- Queries bruker `query({ handler: async (ctx) => ... })` — tilgang til `ctx.db`
- Mutations bruker `mutation({ handler: async (ctx, args) => ... })`
- Actions (for IMAP/SMTP) bruker `action({ handler: async (ctx, args) => ... })`
- Auth-sjekk i admin-mutations: `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error('Unauthorized');`
- Importer fra `convex/_generated/api` i klientkode: `import { api } from '@/convex/_generated/api'` — filen genereres av `npx convex dev`
- Crons defineres i `convex/crons.ts` med `import { cronJobs } from 'convex/server'`
- Convex-miljøvariabler settes via `npx convex env set KEY value`

### Statusmodell (inquiries og projects)
1. `Ny`
2. `Trenger mer info`
3. `Klar for konsultasjon`
4. `Tilbud sendt`
5. `Venter på depositum`
6. `Booket`
7. `Fullført`
8. `Avslått`

### Commit-format
```
feat|fix|refactor|test|chore|docs(scope): kort beskrivelse på norsk
```
Eksempel: `feat(inquiries): legg til status-modal og aktivitetslogg`

---

## TASK-001: Design system — fonter, CSS-tokens og typografiskala

**Status:** done
**Fase:** Foundation
**Avhenger av:** —

### Hva skal bygges
Etabler det visuelle fundamentet for hele appen. Legg til Playfair Display (serif italic for hero/overskrifter) via next/font/google ved siden av eksisterende Geist Sans og Geist Mono. Definer Tailwind v4 CSS custom properties i `globals.css` for en mørk, varm, editorial palett: near-black bakgrunn (`#0d0c0b`), varm dempet tekst (`#c9b99a`), amber/gold aksent (`#c9933a`), tynne borders (`#2a2724`). Legg til typografiskala og font-variabler som CSS-properties tilgjengelig i hele appen.

### Filer
- **Les:** `src/app/globals.css` — eksisterende CSS-base med Tailwind v4 `@theme`-blokk
- **Les:** `src/app/layout.tsx` — ser hvordan Geist-fonter injiseres via `variable`
- **Modifiser:** `src/app/globals.css` — legg til `@theme`-tokens, dark-palette variabler, typografiskala
- **Modifiser:** `src/app/layout.tsx` — importer og injiser Playfair Display som `--font-serif`

### Akseptansekriterier
- [ ] `--font-serif` CSS-variabel er tilgjengelig globalt og peker på Playfair Display
- [ ] `--color-accent` (amber/gold), `--color-border-subtle`, `--color-muted` er definert i `@theme`
- [ ] Bakgrunn er near-black (ikke hvit) i dark mode, uten `prefers-color-scheme` — alltid dark
- [ ] `font-serif italic` klasse rendrer Playfair Display korrekt i browser
- [ ] `pnpm typecheck && pnpm build` passerer uten feil

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-002: Admin layout shell — navigasjon og header

**Status:** done
**Fase:** Foundation
**Avhenger av:** TASK-001

### Hva skal bygges
Bygg admin-layouten som wrapper alle `/admin/*`-ruter. Clerk-auth beskyttes i middleware (`src/proxy.ts` må oppdateres fra `/dashboard(.*)` til `/admin(.*)`). Layouten har: (1) sticky header øverst med sidetittel og bruker-avatar, (2) bunnnavigasjon med 5 elementer (Dashboard, Forespørsler, Kunder, Kalender, Innstillinger) med store tap targets (min 48px høyde). Desktop: sidebar til venstre istedenfor bunnavigasjon. Bruk mørk, varm palett fra TASK-001.

### Filer
- **Les:** `src/proxy.ts` — se gjeldende Clerk middleware-oppsett (matcher nå `/dashboard(.*)`)
- **Les:** `src/app/layout.tsx` — ser ClerkProvider og ConvexClientProvider
- **Modifiser:** `src/proxy.ts` — endre `isProtectedRoute` til å matche `/admin(.*)`
- **Opprett:** `src/app/admin/layout.tsx` — admin layout med Clerk-sjekk, header og bunnavigasjon
- **Opprett:** `src/components/admin/AdminNav.tsx` — bunnnavigasjon-komponent med 5 ikoner og labels
- **Opprett:** `src/app/admin/page.tsx` — midlertidig placeholder (erstattes i TASK-025)

### Akseptansekriterier
- [ ] `/admin` ruter er beskyttet og redirecter til Clerk login ved manglende auth
- [ ] Bunnnavigasjonen har 5 elementer: Dashboard (`/admin`), Forespørsler (`/admin/inquiries`), Kunder (`/admin/clients`), Kalender (`/admin/calendar`), Innstillinger (`/admin/settings`)
- [ ] Aktiv rute er visuelt markert i navigasjonen
- [ ] Header viser aktuell seksjonstittel og er sticky
- [ ] Tap targets er minimum 48px høye
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-003: Public layout shell — header og footer

**Status:** done
**Fase:** Foundation
**Avhenger av:** TASK-001

### Hva skal bygges
Bygg public layout-wrapper for alle `src/app/(public)/*`-ruter (route group med parentes). Layouten har: slim header med logo (tekstbasert "Trovum" i serif italic) og en "Book time" CTA-knapp som lenker til `/book`. Footer: Instagram-lenke og enkel kontaktinfo (e-postadresse). Alt mobile-first med mørk, varm palett. Layouten skal ikke kreve Clerk-auth.

### Filer
- **Les:** `src/app/layout.tsx` — root layout med providers
- **Opprett:** `src/app/(public)/layout.tsx` — public layout med header og footer
- **Opprett:** `src/components/public/PublicHeader.tsx` — logo + CTA
- **Opprett:** `src/components/public/PublicFooter.tsx` — Instagram + kontakt
- **Opprett:** `src/app/(public)/page.tsx` — midlertidig placeholder (erstattes i TASK-011)

### Akseptansekriterier
- [ ] `src/app/(public)/layout.tsx` brukes for public ruter uten å påvirke admin-ruter
- [ ] Header viser "Trovum" i Playfair Display italic og CTA-knapp til `/book`
- [ ] Footer inneholder Instagram-lenke og kontaktinfo
- [ ] Siden laster uten Clerk-auth
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-009: Convex file storage helper — bildeopplasting

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-001

### Hva skal bygges
Opprett `convex/storage.ts` med to funksjoner: (1) `generateUploadUrl` mutation som returnerer en Convex storage upload-URL (brukes fra client for direkte opplasting), (2) `getImageUrls` query som tar en liste med `storageId`-er og returnerer tilsvarende public URL-er via `ctx.storage.getUrl()`. Disse brukes av bookingskjemaet (TASK-013) for referansebilde-upload.

### Filer
- **Les:** `convex/schema.ts` — se `referenceImages`-tabellen med `storageId: v.id('_storage')`
- **Opprett:** `convex/storage.ts` — `generateUploadUrl` mutation og `getImageUrls` query

### Akseptansekriterier
- [ ] `generateUploadUrl` er en Convex mutation som returnerer en upload-URL string (ingen auth kreves — public booking)
- [ ] `getImageUrls` er en Convex query som tar `{ storageIds: v.array(v.id('_storage')) }` og returnerer `string[]`
- [ ] Kode er TypeScript-korrekt og bruker `v` fra `convex/values`
- [ ] `pnpm typecheck` passerer (Convex-generert kode synkronisert via `npx convex dev`)

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-010: Convex inquiry functions — CRUD og statusoppdatering

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-009

### Hva skal bygges
Opprett `convex/inquiries.ts` med fire funksjoner: (1) `create` mutation (public, ingen auth) som oppretter inquiry med `status: 'Ny'` og skriver til `activityLog`, (2) `updateStatus` mutation (krever auth) som endrer status og skriver til `activityLog` med optional note, (3) `list` query (krever auth) som returnerer alle inquiries med optional `status`-filter, sortert nyeste først, (4) `get` query (krever auth) som returnerer én inquiry med id.

### Filer
- **Les:** `convex/schema.ts` — se `inquiries`- og `activityLog`-tabellene med alle felter og indekser
- **Opprett:** `convex/inquiries.ts` — alle fire Convex-funksjoner

### Akseptansekriterier
- [ ] `create` aksepterer alle inquiry-felter fra schema (name, email, phone, instagramHandle, description, bodyPlacement, size, style, budget, desiredTiming, firstTattoo, coverUp, touchUp, extraNotes) og setter `createdAt: Date.now()`
- [ ] `create` skriver activityLog-entry med `entityType: 'inquiry'`, `action: 'created'`
- [ ] `updateStatus` validerer at caller er autentisert og skriver activityLog med `action: 'status_changed'` og `payload: { from, to, note }`
- [ ] `list` bruker `.index('by_createdAt')` og støtter optional `status`-filter
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-011: Public hjemmeside — hero, intro, portfolio og CTA

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-003

### Hva skal bygges
Bygg den offentlige hjemmesiden i `src/app/(public)/page.tsx`. Siden har fem seksjoner: (1) Hero med stor serif italic overskrift ("Trovum Tattoo" eller artistens tagline) og CTA-knapp til `/book`, (2) Artistintro med kort tekst om tatovøren og stil, (3) Portfolio-grid med 6–9 statiske placeholder-bilder fra `public/`-mappen (enkle SVG-er eller placeholder-rectangler initialt), (4) Tre-stegs bookingprosess forklaring (steg: Send forespørsel → Konsultasjon og estimat → Book og betal depositum), (5) CTA-seksjon med link til `/book`. Mobile-first, dark editorial stil fra TASK-001.

### Filer
- **Les:** `src/app/(public)/layout.tsx` — public layout (fra TASK-003)
- **Les:** `src/app/globals.css` — design-tokens fra TASK-001
- **Modifiser:** `src/app/(public)/page.tsx` — erstatt placeholder med ferdig hjemmeside

### Akseptansekriterier
- [ ] Hero-seksjon med serif italic overskrift er synlig above the fold på 390px wide viewport
- [ ] Portfolio-grid viser minst 6 placeholder-bilder i responsivt grid (1 kol mobil, 2-3 desktop)
- [ ] Tre-stegs prosess er tydelig leselig på mobil
- [ ] CTA-knapp til `/book` er synlig uten scrolling på mobil
- [ ] Siden har mørk bakgrunn og bruker design-tokens fra TASK-001
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-012: Bookingskjema del 1 — skjemastruktur og validering

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-003, TASK-001

### Hva skal bygges
Bygg bookingskjemaet i `src/app/(public)/book/page.tsx` med alle felter og Zod-validering. Felter: fullt navn (required), e-post (required, email), telefonnummer (required), instagram-handle (optional), beskrivelse av ønsket tattoo (required, textarea), plassering på kroppen (required), størrelse (required, select: Liten/Middels/Stor/Veldig stor), ønsket stil (required, text), budsjett (optional, text), ønsket tidsrom (optional, text), første tattoo (checkbox bool), cover-up (checkbox bool), touch-up (checkbox bool), ekstra kommentarer (optional, textarea), referansebilder (file input, multiple, max 10 filer, jpg/png/webp). Bruk React Hook Form + Zod. Fil-upload-feltet lagrer kun `File[]` i form state i del 1 — Convex-kobling kommer i TASK-013.

### Filer
- **Les:** `src/app/(public)/layout.tsx` — public layout
- **Les:** `convex/schema.ts` — se inquiry-felter for å matche Zod-schema
- **Opprett:** `src/app/(public)/book/page.tsx` — bookingskjema-side
- **Opprett:** `src/lib/validators/inquiry.ts` — Zod-schema for bookingforespørsel

### Akseptansekriterier
- [ ] Alle 15 felter er implementert i skjemaet med korrekte input-typer
- [ ] Zod-schema validerer required felter og viser feilmeldinger inline under hvert felt
- [ ] Fil-input aksepterer multiple filer og viser filnavn-liste etter valg
- [ ] Skjema er brukbart med én hånd på 390px mobil (store inputs, nok spacing)
- [ ] Submit-knapp er deaktivert under innsending (loading state)
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-013: Bookingskjema del 2 — Convex-integrasjon og bildeopplasting

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-012, TASK-010, TASK-009

### Hva skal bygges
Koble bookingskjemaet til Convex. Submit-flyt: (1) Kall `generateUploadUrl` for hver fil, last opp filer direkte til Convex storage via `fetch PUT`, samle `storageId`-er, (2) Kall `inquiries.create` mutation med alle skjemafelter, (3) For hver `storageId`: insert i `referenceImages`-tabellen via en ny `addReferenceImages` mutation i `convex/inquiries.ts`, (4) Vis suksessmelding med bekreftelsestekst og "Send ny forespørsel"-knapp. Håndter upload-feil eksplisitt med Sonner toast. Vis progress under opplasting (antall filer lastet opp).

### Filer
- **Les:** `convex/storage.ts` — `generateUploadUrl` og `getImageUrls` (fra TASK-009)
- **Les:** `convex/inquiries.ts` — `create` mutation (fra TASK-010)
- **Les:** `convex/schema.ts` — `referenceImages`-tabellen
- **Modifiser:** `convex/inquiries.ts` — legg til `addReferenceImages` mutation
- **Modifiser:** `src/app/(public)/book/page.tsx` — koble submit til Convex

### Akseptansekriterier
- [ ] Bilder lastes opp til Convex storage og `referenceImages`-rader opprettes med korrekt `inquiryId`
- [ ] Inquiry opprettes med status `Ny` og vises i admin-listen etter innsending
- [ ] Suksessmelding vises etter fullført innsending og skjema nullstilles
- [ ] Feil under bildeopplasting viser Sonner toast med forklarende melding — inquiry opprettes likevel
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-014: Admin inquiry-liste — oversikt og filtrering

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-002, TASK-010

### Hva skal bygges
Bygg admin-siden for inquiry-listen i `src/app/admin/inquiries/page.tsx`. Siden bruker `useQuery(api.inquiries.list)` for reaktiv datahenting. Vis hver inquiry som en rad/kort med: kundenavn, e-post, status-badge (fargekodet), dato opprettet. Filter-tabs øverst: Alle / Ny / Venter på depositum / Booket. Sortering: nyeste først. Hver rad er klikkbar og lenker til `/admin/inquiries/[id]`. Tom tilstand: forklarende melding hvis ingen forespørsler finnes. Bruk Clerk-auth via `useConvexAuth()`.

### Filer
- **Les:** `convex/inquiries.ts` — `list` query (fra TASK-010)
- **Les:** `src/app/admin/layout.tsx` — admin layout
- **Opprett:** `src/app/admin/inquiries/page.tsx` — inquiry-liste
- **Opprett:** `src/components/admin/StatusBadge.tsx` — gjenbrukbar status-badge med fargekoding for alle 8 statuser

### Akseptansekriterier
- [ ] Listen viser alle inquiries hentet fra Convex, sortert nyeste først
- [ ] Filter-tabs filtrerer korrekt (Alle = ingen filter, øvrige sender status-param til query)
- [ ] StatusBadge viser ulik farge per status (f.eks. `Ny` = blå, `Venter på depositum` = amber, `Booket` = grønn, `Avslått` = rød)
- [ ] Klikkbar rad navigerer til `/admin/inquiries/[id]`
- [ ] Tom tilstand viser forklarende tekst og ikke blank side
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-015: Admin inquiry detail — full visning og bildegalleri

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-014, TASK-009

### Hva skal bygges
Bygg detaljsiden for én inquiry i `src/app/admin/inquiries/[id]/page.tsx`. Siden viser: alle inquiry-felter i lesemodus (navn, e-post, telefon, instagram, beskrivelse, plassering, størrelse, stil, budsjett, ønsket tidsrom, flagg for firstTattoo/coverUp/touchUp, ekstra notater), bildegalleri (kall `getImageUrls` med `storageId`-er fra `referenceImages`), status-badge, dato opprettet. Knapper for hurtighandlinger: "Endre status" (åpner modal — implementert i TASK-016), "Opprett klient" (placeholder-knapp til TASK-020). Aktivitetslogg-seksjon nederst (kall query for activityLog).

### Filer
- **Les:** `convex/inquiries.ts` — `get` query
- **Les:** `convex/schema.ts` — `referenceImages`- og `activityLog`-tabellene
- **Les:** `convex/storage.ts` — `getImageUrls` query
- **Opprett:** `src/app/admin/inquiries/[id]/page.tsx` — inquiry detail-side
- **Opprett:** `convex/activityLog.ts` — `listByEntity` query: henter alle activityLog-rader for `entityType + entityId`, sortert nyeste først
- **Opprett:** `src/components/admin/ActivityLogTimeline.tsx` — timeline-komponent for aktivitetshistorikk

### Akseptansekriterier
- [ ] Alle inquiry-felter vises i lesemodus
- [ ] Referansebilder vises i bildegalleri (minst 3 per rad på desktop, scrollbar på mobil)
- [ ] Aktivitetslogg-timeline vises nederst med timestamp og handling-beskrivelse
- [ ] "Endre status"-knapp er synlig (modal-funksjonalitet kobles i TASK-016)
- [ ] Back-navigasjon til `/admin/inquiries` er tilgjengelig
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-016: Statusendring og aktivitetslogg — modal og skriving

**Status:** done
**Fase:** 1
**Avhenger av:** TASK-015

### Hva skal bygges
Implementer "Endre status"-funksjonaliteten på inquiry detail-siden. Åpne en Sheet (shadcn `Sheet`-komponent) med: dropdown med alle 8 statuser (Ny / Trenger mer info / Klar for konsultasjon / Tilbud sendt / Venter på depositum / Booket / Fullført / Avslått), valgfritt notatfelt (textarea), "Lagre"-knapp som kaller `inquiries.updateStatus` mutation. Etter lagring: lukk sheet, vis Sonner toast "Status oppdatert", aktivitetsloggen refreshes automatisk (Convex reaktivitet). `ActivityLogTimeline`-komponenten (fra TASK-015) rendres nå med ekte data.

### Filer
- **Les:** `convex/inquiries.ts` — `updateStatus` mutation
- **Les:** `convex/activityLog.ts` — `listByEntity` query (fra TASK-015)
- **Modifiser:** `src/app/admin/inquiries/[id]/page.tsx` — legg til Sheet og koble "Endre status"-knapp
- **Opprett:** `src/components/admin/StatusChangeSheet.tsx` — gjenbrukbar status-sheet

### Akseptansekriterier
- [ ] Sheet åpnes ved klikk på "Endre status"-knapp
- [ ] Dropdown viser alle 8 statuser, nåværende status er pre-valgt
- [ ] Lagring kaller `updateStatus` og lukker sheeten
- [ ] ActivityLogTimeline oppdateres automatisk etter statusendring (Convex reaktivitet)
- [ ] Notat-feltet lagres i activityLog payload
- [ ] Sonner toast vises ved vellykket lagring
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-020: Convex client + project functions — CRUD

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-010

### Hva skal bygges
Opprett `convex/clients.ts` med: `create` mutation (auth required), `get` query (auth required, by id), `list` query (auth required, med Convex search index `search_clients` for søk på navn/e-post), `update` mutation (auth required). Opprett `convex/projects.ts` med: `create` mutation (auth required, tar `clientId` + optional `inquiryId`, setter `status: 'Ny'`), `get` query (auth required), `update` mutation (auth required, for status, estimate, deposit-felter), `listByClient` query (returnerer alle prosjekter for én klient). Begge skriver til `activityLog` ved statusendring.

### Filer
- **Les:** `convex/schema.ts` — `clients`-, `projects`- og `activityLog`-tabellene med alle felter og indekser
- **Opprett:** `convex/clients.ts` — alle 4 funksjoner
- **Opprett:** `convex/projects.ts` — alle 4 funksjoner

### Akseptansekriterier
- [ ] `clients.list` bruker `.searchIndex('search_clients')` når `searchQuery`-argument er gitt
- [ ] `projects.create` validerer at `clientId` peker på eksisterende klient
- [ ] `projects.update` skriver activityLog-entry med `action: 'status_changed'` kun ved statusendring
- [ ] Alle mutations krever autentisert bruker via `ctx.auth.getUserIdentity()`
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-021: Admin klientliste — søk og oversikt

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-002, TASK-020

### Hva skal bygges
Bygg admin-klientlisten i `src/app/admin/clients/page.tsx`. Siden bruker `useQuery(api.clients.list)` med optional søketerm. Søkefelt øverst (debounce 300ms). Hver klient-rad viser: navn, e-post, instagram-handle (hvis satt), dato sist oppdatert. Klikk på rad navigerer til `/admin/clients/[id]`. Tom tilstand: "Ingen kunder ennå" med forklarende tekst. "Ny kunde"-knapp (placeholder — fullstendig oppretting skjer fra inquiry detail).

### Filer
- **Les:** `convex/clients.ts` — `list` query med search-støtte (fra TASK-020)
- **Opprett:** `src/app/admin/clients/page.tsx` — klientliste med søk

### Akseptansekriterier
- [ ] Søkefelt filtrerer listen via Convex search index i sanntid (debounce 300ms)
- [ ] Klient-rader viser navn, e-post og sist oppdatert-dato
- [ ] Klikk navigerer til `/admin/clients/[id]`
- [ ] Tom tilstand håndteres med forklarende melding
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-022: Admin klient- og prosjektdetalj — visning og kobling

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-021, TASK-015

### Hva skal bygges
Bygg `src/app/admin/clients/[id]/page.tsx`: viser klientinfo (navn, e-post, telefon, instagram, notater), redigerbart notater-felt (inline save via `clients.update`), liste over klientens prosjekter (fra `projects.listByClient`) der hvert prosjekt viser status og dato. Klikk på prosjekt navigerer til `/admin/projects/[id]`. Bygg `src/app/admin/projects/[id]/page.tsx`: viser prosjektstatus, estimate, deposit-status, koblet inquiry (lenke), koblet klient (lenke), liste over bookinger (placeholder til TASK-040), aktivitetslogg, hurtighandlings-knapper: "Endre status", "Legg til notat", "Opprett booking" (placeholder). Implementer "Opprett klient"-flyt fra inquiry detail: åpner sheet med pre-utfylte felter fra inquiry og kaller `clients.create` + `projects.create`.

### Filer
- **Les:** `convex/clients.ts` og `convex/projects.ts` — fra TASK-020
- **Les:** `convex/activityLog.ts` — `listByEntity` query
- **Les:** `src/app/admin/inquiries/[id]/page.tsx` — "Opprett klient"-knapp
- **Opprett:** `src/app/admin/clients/[id]/page.tsx` — klientdetalj
- **Opprett:** `src/app/admin/projects/[id]/page.tsx` — prosjektdetalj
- **Opprett:** `src/components/admin/CreateClientSheet.tsx` — oppretting fra inquiry
- **Modifiser:** `src/app/admin/inquiries/[id]/page.tsx` — koble "Opprett klient"-knapp til CreateClientSheet

### Akseptansekriterier
- [ ] Klientdetalj viser alle felter og notater er inline-redigerbart
- [ ] Prosjektliste på klientdetalj viser korrekte prosjekter fra Convex
- [ ] Prosjektdetalj viser status, estimat, deposit-status og aktivitetslogg
- [ ] "Opprett klient" fra inquiry oppretter klient + prosjekt og navigerer til klientsiden
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-023: Estimat og depositum — redigeringsgrensesnitt

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-022

### Hva skal bygges
Bygg estimat- og depositumseksjonen på prosjektdetalj-siden. Estimat-seksjon: redigerbart tallfelt (NOK), lagre med `projects.update`. Depositum-seksjon: beløpsfelt (NOK), status-dropdown (`pending` / `received` / `waived`), betalingslenke-felt (URL), betalingsnotat-felt, lagre-knapp. Visuell tilstand: "Venter på depositum" status vises tydelig med amber/gold farge og en call-to-action. "Mottatt"-state viser grønn hake. Alle felt lagres via `projects.update` mutation.

### Filer
- **Les:** `convex/projects.ts` — `update` mutation med alle prosjektfelter
- **Les:** `convex/schema.ts` — projects-tabellen (estimatedPrice, depositAmount, depositStatus, paymentLink, paymentNote)
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — legg til estimat- og depositumseksjon

### Akseptansekriterier
- [ ] Estimatfelt lagres korrekt som `number` (NOK) i Convex
- [ ] Depositumstatus viser tydelig visuell state for `pending` (amber), `received` (grønn), `waived` (grå)
- [ ] Alle depositumfelter lagres via én `projects.update`-kall
- [ ] Betalingslenke er klikkbar etter lagring
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-024: Meldingsmaler — admin CRUD

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-002

### Hva skal bygges
Bygg mal-administrasjonen i `src/app/admin/templates/page.tsx`. Siden lister alle maler gruppert etter type. 10 mal-typer: `received` (mottatt forespørsel), `needs-info` (trenger mer info), `estimate` (prisestimat), `timeslot` (forslag til tidspunkt), `deposit` (betal depositum), `confirmation` (bookingbekreftelse), `reminder` (påminnelse), `aftercare` (etterbehandling), `thank-you` (takk etter ferdig prosjekt), `review-request` (be om anmeldelse). Opprett `convex/templates.ts` med `list`, `create`, `update`, `delete` mutations/queries. Redigering skjer inline eller i Sheet med tittel-felt og tekstarea for innhold.

### Filer
- **Les:** `convex/schema.ts` — `messageTemplates`-tabellen
- **Opprett:** `convex/templates.ts` — list, create, update, delete
- **Opprett:** `src/app/admin/templates/page.tsx` — mal-liste og rediger/opprett-UI

### Akseptansekriterier
- [ ] Alle 10 mal-typer er representert med label på norsk i UI
- [ ] Ny mal kan opprettes via form med type-dropdown, tittel og innhold
- [ ] Eksisterende mal kan redigeres og slettes
- [ ] `templates.list` returnerer maler sortert etter `type`
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-025: Admin dashboard — oversikt og snarveier

**Status:** done
**Fase:** 2
**Avhenger av:** TASK-022, TASK-014

### Hva skal bygges
Bygg admin-dashboardet i `src/app/admin/page.tsx`. Fire summary-kort: antall nye forespørsler (status = 'Ny'), antall venter på svar (status = 'Trenger mer info'), antall venter på depositum (status = 'Venter på depositum'), kommende bookinger denne uken. Opprett `convex/dashboard.ts` med en `getSummary` query som returnerer disse tallene i én spørring. Under kortene: liste over de 5 siste inquiries med navn, status og dato. Snarveier: "Ny forespørsel"-lenke til `/book` (for testing), "Alle forespørsler", "Alle kunder". Designet skal være scannbart på mobil på 3 sekunder — store tall, klare labels.

### Filer
- **Les:** `convex/inquiries.ts` og `convex/bookings.ts` (hvis eksisterer) — for datasummering
- **Les:** `convex/schema.ts` — tabellindekser som kan brukes for effektiv summering
- **Opprett:** `convex/dashboard.ts` — `getSummary` query
- **Modifiser:** `src/app/admin/page.tsx` — erstatt placeholder med dashboard

### Akseptansekriterier
- [ ] Fire summary-kort viser korrekte tall hentet fra Convex
- [ ] De 5 siste inquiries vises med navn, status-badge og relativ dato
- [ ] Dashboardet er mobile-first og scannbart uten scrolling på 390px
- [ ] `getSummary`-query er effektiv og bruker indekser (ikke full table scan)
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-030: Mail-infrastruktur — konfigurasjon og environment

**Status:** done
**Fase:** 3
**Avhenger av:** TASK-002

### Hva skal bygges
Sett opp mail-infrastrukturen. Installer `imapflow` og `nodemailer` som Convex action-dependencies (legg til i `convex/package.json` hvis den finnes, ellers bruk `node:` imports i Convex actions). Opprett `convex/mail/config.ts` som leser miljøvariabler: `MAIL_HOST_IMAP` (imap.one.com), `MAIL_PORT_IMAP` (993), `MAIL_HOST_SMTP` (send.one.com), `MAIL_PORT_SMTP` (465), `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`. Eksporter en `getMailConfig()` hjelpefunksjon. Dokumenter alle nødvendige `npx convex env set KEY value`-kommandoer i en kommentar øverst i filen.

### Filer
- **Les:** `convex/schema.ts` — `mailAccounts`-tabellen
- **Opprett:** `convex/mail/config.ts` — mail config helper med env-var lesing
- **Opprett:** `convex/mail/` — opprett directory-struktur

### Akseptansekriterier
- [ ] `getMailConfig()` returnerer et objekt med alle 7 konfigurasjonsverdier
- [ ] Manglende miljøvariabel kaster en `Error` med tydelig feilmelding
- [ ] IMAP-konfig: host `imap.one.com`, port 993, SSL=true
- [ ] SMTP-konfig: host `send.one.com`, port 465, SSL=true
- [ ] Alle nødvendige `convex env set`-kommandoer er dokumentert i kommentar
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-031: Mail sync action — IMAP-henting og upsert til Convex

**Status:** done
**Fase:** 3
**Avhenger av:** TASK-030

### Hva skal bygges
Bygg `convex/mail/sync.ts` som en Convex action. Handlingen åpner IMAP-tilkobling via `imapflow`, henter de siste 50 meldingene fra INBOX (nyeste først), og upserterer til `mailThreads` + `mailMessages`-tabellene basert på `externalThreadId` (Message-ID header eller In-Reply-To for tråd-gruppering). Unread-status synkroniseres. Opprett `convex/crons.ts` (eller modifiser eksisterende) med et cron-job som kjører sync hvert 5. minutt. Opprett hjelpemutation `convex/mail/mutations.ts` med `upsertThread` og `upsertMessage` for å skrive til databasen (actions kan ikke direkte kalle ctx.db).

### Filer
- **Les:** `convex/mail/config.ts` — mail config (fra TASK-030)
- **Les:** `convex/schema.ts` — `mailThreads` og `mailMessages`-tabellene med alle felter
- **Opprett:** `convex/mail/sync.ts` — Convex action for IMAP sync
- **Opprett:** `convex/mail/mutations.ts` — `upsertThread` og `upsertMessage` mutations
- **Opprett:** `convex/crons.ts` — cron-jobs med 5-minutters mail sync

### Akseptansekriterier
- [ ] `syncMail` action kobler til IMAP og henter meldinger uten å krasje
- [ ] Ny melding oppretter `mailMessage`-rad og oppdaterer/oppretter `mailThread`
- [ ] Eksisterende melding (samme externalId) oppdaterer `isRead`-status men duplikerer ikke
- [ ] Cron-job kjører hvert 5. minutt og kaller `syncMail` action
- [ ] `mailThreads.lastMessageAt` og `unreadCount` oppdateres korrekt
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-032: Admin mail-innboks — trådliste

**Status:** done
**Fase:** 3
**Avhenger av:** TASK-002, TASK-031

### Hva skal bygges
Bygg mail-innboksen i `src/app/admin/mail/page.tsx`. Siden bruker `useQuery(api.mail.queries.listThreads)` for reaktiv trådliste. Opprett `convex/mail/queries.ts` med `listThreads` query (sortert på `lastMessageAt` desc, med optional `unreadOnly`-filter). Vis hver tråd som en rad: emne, deltakere (fra `participants`-array), ulest-count badge, tidspunkt for siste melding, snippet (første 100 tegn av siste melding). Filter-tab: Alle / Uleste. Klikk navigerer til `/admin/mail/[threadId]`. "Legg til i navigasjon"-link i TASK-002 AdminNav (mail-ikon).

### Filer
- **Les:** `convex/schema.ts` — `mailThreads`-tabellen med indekser
- **Opprett:** `convex/mail/queries.ts` — `listThreads` query
- **Opprett:** `src/app/admin/mail/page.tsx` — mail innboks
- **Modifiser:** `src/components/admin/AdminNav.tsx` — legg til Mail-lenke (erstatt ett eksisterende element eller legg til som 6. element med scrollbar)

### Akseptansekriterier
- [ ] Trådliste sorteres på `lastMessageAt` nyeste først
- [ ] Ulest-count badge vises korrekt
- [ ] Filter "Uleste" filtrerer til tråder med `unreadCount > 0`
- [ ] Tom tilstand viser "Ingen e-poster ennå" og link til dokumentasjon for å sette opp mail
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-033: Admin trådvisning og svar — meldings-UI og SMTP

**Status:** done
**Fase:** 3
**Avhenger av:** TASK-032, TASK-024

### Hva skal bygges
Bygg trådvisningen i `src/app/admin/mail/[threadId]/page.tsx`. Vis alle meldinger i tråden kronologisk (inbound vs outbound visuelt skilt). Nederst: svar-composer med valgfri mal-velger (dropdown med `messageTemplates` av alle typer, pre-fyller textarea). Manuell tekst kan også skrives. "Send"-knapp kaller en Convex action `convex/mail/sendReply.ts` som bruker nodemailer/SMTP til å sende. Etter sending: ny melding lagres i `mailMessages` (direction: 'outbound'), tråden oppdateres. Merk tråd som lest ved åpning via `convex/mail/mutations.ts`.

### Filer
- **Les:** `convex/mail/config.ts` — SMTP-konfig
- **Les:** `convex/mail/queries.ts` — legg til `getThread` og `listMessages` queries
- **Les:** `convex/templates.ts` — for mal-velger
- **Modifiser:** `convex/mail/queries.ts` — legg til `getThread` og `listMessages`
- **Opprett:** `convex/mail/sendReply.ts` — Convex action for SMTP-sending
- **Opprett:** `src/app/admin/mail/[threadId]/page.tsx` — trådvisning og svar-UI

### Akseptansekriterier
- [ ] Alle meldinger i tråden vises kronologisk med inbound/outbound-skille
- [ ] Tråd markeres som lest (unreadCount: 0) ved åpning
- [ ] Svar sendes via SMTP og lagres som `mailMessage` med `direction: 'outbound'`
- [ ] Mal-velger pre-fyller textarea med valgt mals innhold
- [ ] Feil ved sending viser Sonner toast med feilmelding
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-034: Koble e-posttråd til klient/prosjekt

**Status:** done
**Fase:** 3
**Avhenger av:** TASK-033, TASK-022

### Hva skal bygges
Legg til "Koble til kunde/prosjekt"-funksjonalitet på trådvisningen. Knapp øverst på siden åpner en Sheet. I sheeten: søkefelt for klient (bruker `clients.list` med search), klikk på klient viser klientens prosjekter, velg klient og optionelt prosjekt. Lagring kaller `convex/mail/mutations.ts` `linkThread`-mutation som setter `linkedClientId` og `linkedProjectId` på `mailThreads`-raden. På klient- og prosjektdetaljsidene: vis koblede tråder via query med `by_client`- og `by_project`-indeksene.

### Filer
- **Les:** `convex/schema.ts` — `mailThreads` med `linkedClientId`, `linkedProjectId`-felter og indekser
- **Les:** `convex/clients.ts` — `list` query med search
- **Les:** `convex/projects.ts` — `listByClient` query
- **Modifiser:** `convex/mail/mutations.ts` — legg til `linkThread` mutation
- **Modifiser:** `convex/mail/queries.ts` — legg til `listByClient` og `listByProject` queries
- **Modifiser:** `src/app/admin/mail/[threadId]/page.tsx` — legg til koblingsknapp og Sheet
- **Modifiser:** `src/app/admin/clients/[id]/page.tsx` — vis koblede tråder
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — vis koblede tråder

### Akseptansekriterier
- [ ] Kobling lagres på `mailThreads`-raden via `linkThread` mutation
- [ ] Koblede tråder vises på klientdetaljsiden
- [ ] Koblede tråder vises på prosjektdetaljsiden
- [ ] Søk i Sheet fungerer og filtrerer klienter korrekt
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-040: Convex booking-funksjoner — CRUD og aktivitetslogg

**Status:** done
**Fase:** 4
**Avhenger av:** TASK-020

### Hva skal bygges
Opprett `convex/bookings.ts` med: `create` mutation (auth required, tar `projectId`, `startAt`, `endAt`, valgfri `notes`, setter `status: 'scheduled'`), `update` mutation (auth required, for tid, status, notes), `cancel` mutation (setter status til 'cancelled'), `listUpcoming` query (bookinger med `startAt > now()`, sortert ascending), `listByProject` query (alle bookinger for et prosjekt), `get` query. Alle write-operasjoner skriver til `activityLog`. Sjekk i `create`: hvis booking er innen 24 timer, opprett `notifications`-rad med type `booking-today`.

### Filer
- **Les:** `convex/schema.ts` — `bookings`- og `notifications`-tabellene
- **Opprett:** `convex/bookings.ts` — alle 6 funksjoner

### Akseptansekriterier
- [ ] `create` validerer at `startAt < endAt`
- [ ] `listUpcoming` bruker `.index('by_startAt')` og filtrerer på `startAt > Date.now()`
- [ ] `cancel` setter status til `'cancelled'` og skriver activityLog
- [ ] Booking innen 24 timer oppretter notification med type `'booking-today'` og priority `'high'`
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-041: Admin kalender — ukelistevisning

**Status:** done
**Fase:** 4
**Avhenger av:** TASK-002, TASK-040

### Hva skal bygges
Bygg kalender-siden i `src/app/admin/calendar/page.tsx`. Standard visning: enkel kronologisk liste over kommende bookinger (fra `bookings.listUpcoming`). Grupper etter dato. Hvert booking-element viser: kundenavn (via join med project og client), tidsrom (start–slutt), prosjektstatus-badge, lenke til `/admin/projects/[id]`. Tom tilstand: "Ingen kommende bookinger" med CTA til prosjektlisten. "Ny booking"-knapp åpner create-sheet (implementert i TASK-042).

### Filer
- **Les:** `convex/bookings.ts` — `listUpcoming` query (fra TASK-040)
- **Les:** `convex/projects.ts` og `convex/clients.ts` — for joining av kundenavn
- **Opprett:** `src/app/admin/calendar/page.tsx` — kalenderside med listevisning
- **Opprett:** `convex/bookings.ts` — legg til `listUpcomingWithDetails` query som returnerer bookinger med client + project-info

### Akseptansekriterier
- [ ] Kommende bookinger vises kronologisk gruppert etter dato
- [ ] Kundenavn vises (ikke bare prosjekt-ID)
- [ ] Hvert element linker til prosjektdetaljsiden
- [ ] Tom tilstand vises med forklarende melding
- [ ] Kalender er lesbar og navigerbar på mobil
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-042: Opprett, rediger og avlys booking — sheet-UI

**Status:** done
**Fase:** 4
**Avhenger av:** TASK-041, TASK-022

### Hva skal bygges
Bygg booking-sheet som kan åpnes fra prosjektdetalj og kalender. Opprett `src/components/admin/BookingSheet.tsx`: create-modus har felter for prosjekt-søk (hvis åpnet fra kalender), startdato + tid, sluttdato + tid, notater. Redigerings-modus pre-fyller feltene. Avlys-knapp med bekreftelsesdialog setter status til `'cancelled'` via `bookings.cancel`. Ombok: setter status til `'rescheduled'` på gammel booking og kaller `bookings.create` med nye tidspunkter. Legg til "Opprett booking"-knapp på prosjektdetaljsiden.

### Filer
- **Les:** `convex/bookings.ts` — `create`, `update`, `cancel` mutations
- **Opprett:** `src/components/admin/BookingSheet.tsx` — booking create/edit/cancel sheet
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — legg til "Opprett booking"-knapp og booking-liste
- **Modifiser:** `src/app/admin/calendar/page.tsx` — koble "Ny booking"-knapp til BookingSheet

### Akseptansekriterier
- [ ] Booking kan opprettes fra prosjektdetalj og kalender
- [ ] Dato/tid-felter er brukbare på mobil (bruker native `<input type="datetime-local">`)
- [ ] Avlysning krever bekreftelse og setter status korrekt
- [ ] Ombooking oppretter ny booking og markerer gammel som 'rescheduled'
- [ ] Sonner toast ved vellykket opprettelse, redigering og avlysning
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-043: Aftercare-sending — flyt og logging

**Status:** pending
**Fase:** 4
**Avhenger av:** TASK-042, TASK-033, TASK-024

### Hva skal bygges
Implementer "Send aftercare"-hurtighandling på prosjektdetaljsiden. Knapp åpner en Sheet med: mal-velger (type = `'aftercare'`, bruker `templates.list`), redigerbart textarea med mal-innhold, mottaker e-post (pre-fylt fra klientens e-post). Send-knapp kaller `convex/mail/sendAftercare.ts` action som sender via SMTP og lagrer utgående melding i `mailMessages`. Etter sending: skriv til `activityLog` med `action: 'aftercare_sent'` og sett `aftercareSentAt` på project (legg til felt i `convex/projects.ts` `update` mutation — feltet `aftercareSentAt: v.optional(v.number())` mangler i schema og MÅ legges til i `convex/schema.ts`).

### Filer
- **Les:** `convex/schema.ts` — `projects`-tabellen (mangler `aftercareSentAt`-felt)
- **Les:** `convex/templates.ts` — `list` query
- **Les:** `convex/mail/sendReply.ts` — se SMTP-sending-mønster
- **Modifiser:** `convex/schema.ts` — legg til `aftercareSentAt: v.optional(v.number())` i `projects`-tabellen
- **Modifiser:** `convex/projects.ts` — inkluder `aftercareSentAt` i `update` mutation
- **Opprett:** `convex/mail/sendAftercare.ts` — Convex action for aftercare-sending
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — legg til "Send aftercare"-knapp og Sheet

### Akseptansekriterier
- [ ] "Send aftercare"-knapp er synlig på prosjektdetalj
- [ ] Mal-velger filtrerer på type `'aftercare'` og pre-fyller textarea
- [ ] Mail sendes via SMTP og lagres som `mailMessage` med direction `'outbound'`
- [ ] `aftercareSentAt` oppdateres på project etter sending
- [ ] Knapp-tekst endres til "Aftercare sendt" og er deaktivert etter sending
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-044: Review request-flyt — sending og logging

**Status:** pending
**Fase:** 4
**Avhenger av:** TASK-043

### Hva skal bygges
Implementer "Be om anmeldelse"-hurtighandling på prosjektdetaljsiden — kun tilgjengelig etter at aftercare er sendt (`aftercareSentAt` er satt). Sheet med: mal-velger (type = `'review-request'`), redigerbart textarea, mottaker e-post pre-fylt. Send-knapp kaller `convex/mail/sendReviewRequest.ts` action (SMTP-sending). Etter sending: sett `reviewRequestedAt: Date.now()` på project via `projects.update`, logg til activityLog. Knappen viser "Anmeldelse forespurt" og deaktiveres permanent etter sending (basert på `reviewRequestedAt !== undefined`).

### Filer
- **Les:** `convex/projects.ts` — `update` mutation (`reviewRequestedAt`-feltet er allerede i schema)
- **Les:** `convex/mail/sendAftercare.ts` — se mønster fra TASK-043
- **Opprett:** `convex/mail/sendReviewRequest.ts` — Convex action
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — legg til "Be om anmeldelse"-knapp

### Akseptansekriterier
- [ ] Knappen er kun klikkbar hvis `aftercareSentAt` er satt og `reviewRequestedAt` er undefined
- [ ] Review request sendes via SMTP og lagres i `mailMessages`
- [ ] `reviewRequestedAt` settes på project og knappen deaktiveres permanent
- [ ] ActivityLog-entry opprettes med action `'review_requested'`
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-050: PWA manifest og ikoner

**Status:** pending
**Fase:** 5
**Avhenger av:** TASK-001

### Hva skal bygges
Sett opp PWA-grunnlaget. Opprett `public/manifest.json` med: `name: "Trovum Tattoo"`, `short_name: "Trovum"`, `theme_color: "#0d0c0b"`, `background_color: "#0d0c0b"`, `display: "standalone"`, `start_url: "/"`, `icons` array med minst 192x192 og 512x512 (bruk SVG placeholder initialt). Legg til `<link rel="manifest">` og iOS-metadata tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`) i root `src/app/layout.tsx`. Legg til `apple-touch-icon` i `<head>`. Verifiser "Legg til på hjemskjerm" fungerer på iOS Safari (display: standalone).

### Filer
- **Les:** `src/app/layout.tsx` — root layout for head-metadata
- **Opprett:** `public/manifest.json` — PWA manifest
- **Opprett:** `public/icons/icon-192.svg` og `public/icons/icon-512.svg` — placeholder-ikoner
- **Modifiser:** `src/app/layout.tsx` — legg til manifest-link og iOS meta-tags

### Akseptansekriterier
- [ ] `public/manifest.json` er gyldig og tilgjengelig på `/manifest.json`
- [ ] `<link rel="manifest">` er i HTML head
- [ ] iOS meta-tags er satt: `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`
- [ ] Chrome Lighthouse PWA-audit viser manifest detected
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-051: Service worker — app shell caching og offline

**Status:** pending
**Fase:** 5
**Avhenger av:** TASK-050

### Hva skal bygges
Implementer en minimal service worker. Opprett `public/sw.js` som cacher app shell (layout, fonter, CSS) ved install. Cache-strategi: network-first for API/Convex-kall, cache-first for statiske assets (CSS, fonter, bilder). Ved offline: vis en enkel "Du er offline"-melding ved å returnere en offline-fallback HTML-side for navigasjonsforespørsler. Registrer service workeren fra en Client Component `src/components/ServiceWorkerRegistration.tsx` som legges til i `src/app/layout.tsx`. Ikke bruk Workbox — håndskrevet SW for å minimere dependencies.

### Filer
- **Les:** `src/app/layout.tsx` — for å legge til ServiceWorkerRegistration
- **Opprett:** `public/sw.js` — service worker med cache-logikk og offline-fallback
- **Opprett:** `public/offline.html` — enkel offline-side på norsk
- **Opprett:** `src/components/ServiceWorkerRegistration.tsx` — client component for SW-registrering
- **Modifiser:** `src/app/layout.tsx` — legg til ServiceWorkerRegistration

### Akseptansekriterier
- [ ] Service worker registreres uten feil i browser console
- [ ] Statiske assets caches ved første besøk
- [ ] Ved offline vises `offline.html` med melding "Du er offline" for navigasjonsforespørsler
- [ ] Convex-kall feiler gracefully ved offline (ikke blank side)
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-052: Admin notification center — varslingssentral

**Status:** pending
**Fase:** 5
**Avhenger av:** TASK-002

### Hva skal bygges
Bygg varslingssentral i `src/app/admin/notifications/page.tsx`. Opprett `convex/notifications.ts` med: `list` query (sortert på `createdAt` desc), `markRead` mutation (setter `isRead: true` på én notifikasjon), `markAllRead` mutation (setter `isRead: true` på alle). UI: liste med alle notifications, visuelt skille mellom lest/ulest, ikon basert på type (ny forespørsel, depositum-påminnelse, booking osv.), tittel, body-tekst, relativ timestamp, klikkbar rad som navigerer til koblet entity og markerer som lest. "Merk alle som lest"-knapp øverst. Ulest-count badge i AdminNav — hentes fra `convex/notifications.ts` `countUnread` query.

### Filer
- **Les:** `convex/schema.ts` — `notifications`-tabellen med alle felter og indekser
- **Opprett:** `convex/notifications.ts` — `list`, `markRead`, `markAllRead`, `countUnread`
- **Opprett:** `src/app/admin/notifications/page.tsx` — varslingssentral
- **Modifiser:** `src/components/admin/AdminNav.tsx` — legg til ulest-badge på notifikasjons-ikon

### Akseptansekriterier
- [ ] Alle notifikasjoner vises sortert nyeste først
- [ ] Uleste vises med visuell markering (bold, dot eller bakgrunnsfarge)
- [ ] Klikk markerer som lest og navigerer til koblet entity
- [ ] "Merk alle som lest" oppdaterer alle rader
- [ ] AdminNav viser korrekt ulest-count badge (forsvinner når alle er lest)
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-053: Push notification-abonnement — VAPID og subscription lagring

**Status:** pending
**Fase:** 5
**Avhenger av:** TASK-052

### Hva skal bygges
Implementer push notification-abonnement. Legg til `pushSubscriptions`-tabell i `convex/schema.ts` med felter: `endpoint: v.string()`, `keys: v.object({ p256dh: v.string(), auth: v.string() })`, `createdAt: v.number()`. Convex env vars: `VAPID_PUBLIC_KEY` og `VAPID_PRIVATE_KEY` (generer med `npx web-push generate-vapid-keys`). Client-side: `src/components/admin/PushSubscriptionManager.tsx` — knapp "Aktiver varsler", requesterer permission, kaller `serviceWorkerRegistration.pushManager.subscribe()` med VAPID public key, lagrer subscription i Convex via `convex/pushSubscriptions.ts` `save` mutation. Vis abonnementsstatus på settings-siden.

### Filer
- **Modifiser:** `convex/schema.ts` — legg til `pushSubscriptions`-tabell
- **Opprett:** `convex/pushSubscriptions.ts` — `save` mutation og `getCurrent` query
- **Opprett:** `src/components/admin/PushSubscriptionManager.tsx` — push subscription UI
- **Modifiser:** `src/app/admin/settings/page.tsx` (opprett hvis ikke finnes) — vis push status

### Akseptansekriterier
- [ ] `pushSubscriptions`-tabell er lagt til i schema og synkronisert med Convex
- [ ] Bruker kan aktivere push-varsler fra settings-siden
- [ ] Subscription lagres i `pushSubscriptions`-tabellen
- [ ] VAPID public key leses fra `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-054: Notification triggers — crons og push-sending

**Status:** pending
**Fase:** 5
**Avhenger av:** TASK-053, TASK-040

### Hva skal bygges
Implementer automatiske notifikasjonsktriggers. Legg til i `convex/crons.ts`: (1) `checkDepositOverdue` — daglig kl. 09:00: finn prosjekter med `depositStatus: 'pending'` og `createdAt` > 48 timer siden, opprett notification + send push, (2) `checkBookingTomorrow` — daglig kl. 08:00: finn bookinger med startAt innen 24 timer, opprett notification + send push, (3) `checkBookingToday` — daglig kl. 07:00: finn bookinger med startAt innen 4 timer. Push-sending via HTTP action `convex/mail/sendPush.ts` som leser subscription fra `pushSubscriptions` og sender via Web Push API med `web-push` library. Inquiry `create` mutation (TASK-010) skal allerede skrive til `notifications` — verifiser og opprett push fra der.

### Filer
- **Les:** `convex/crons.ts` — eksisterende crons fra TASK-031
- **Les:** `convex/schema.ts` — `notifications` og `pushSubscriptions`-tabellene
- **Les:** `convex/bookings.ts` — for å finne upcoming bookings
- **Modifiser:** `convex/crons.ts` — legg til tre nye cron-jobs
- **Opprett:** `convex/mail/sendPush.ts` — HTTP action for Web Push sending
- **Modifiser:** `convex/inquiries.ts` — sørg for at `create` mutation oppretter notification og sender push

### Akseptansekriterier
- [ ] Tre cron-jobs er registrert og kjører på riktig tidspunkt
- [ ] Notification-rad opprettes i `notifications`-tabellen for hvert trigger
- [ ] Push sendes til alle aktive subscriptions i `pushSubscriptions`-tabellen
- [ ] Ny inquiry trigger oppretter notification med type `'new-inquiry'` og priority `'high'`
- [ ] `pnpm typecheck` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-060: Public innholdssider — FAQ, booking-info, aftercare, personvern

**Status:** pending
**Fase:** 6
**Avhenger av:** TASK-003

### Hva skal bygges
Bygg fire statiske innholdssider under `src/app/(public)/`. (1) `/faq`: Accordion (shadcn `Accordion`) med 7 spørsmål: Hvordan booker jeg? / Hva bør jeg sende inn? / Tar du cover-up? / Hva koster en tatovering? / Hvordan fungerer depositum? / Hvor lang tid tar det å få svar? / Hvordan fungerer etterbehandling? (2) `/booking-info`: Fullstendig prosesstekst: hva slags prosjekter som passer, hva kunden bør sende, hvordan pris estimeres, depositum-forklaring, hva som skjer etter innsending. (3) `/aftercare`: Etterbehandlingsinstruksjoner i trinn-for-trinn format. (4) `/privacy`: Minimal personvernerklæring. Alle sider bruker public layout, mørk editorial stil, nok tekst for SEO.

### Filer
- **Les:** `src/app/(public)/layout.tsx` — public layout
- **Opprett:** `src/app/(public)/faq/page.tsx`
- **Opprett:** `src/app/(public)/booking-info/page.tsx`
- **Opprett:** `src/app/(public)/aftercare/page.tsx`
- **Opprett:** `src/app/(public)/privacy/page.tsx`

### Akseptansekriterier
- [ ] FAQ-siden bruker shadcn Accordion og inneholder minst 6 spørsmål med fullstendig svar
- [ ] Booking-info-siden forklarer prosessen i minst 4 seksjoner
- [ ] Aftercare-siden har konkrete instruksjoner (ikke placeholder-tekst)
- [ ] Alle sider er mobile-first og bruker designtokens fra TASK-001
- [ ] Alle sider har intern navigasjon (breadcrumb eller back-lenke)
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-061: SEO metadata-lag — titler, beskrivelser og strukturert data

**Status:** pending
**Fase:** 6
**Avhenger av:** TASK-060, TASK-011

### Hva skal bygges
Legg til SEO metadata for alle public ruter via Next.js `generateMetadata` API. For hver rute: `title` (format: "Side | Trovum Tattoo"), `description` (50-160 tegn), `openGraph.title`, `openGraph.description`, `openGraph.url`. Root layout: `metadataBase: new URL('https://trovumtattoo.no')`. Hjemmesiden: legg til `JSON-LD` structured data (schema.org `Person` eller `LocalBusiness`) som `<script type="application/ld+json">`. Alle sider: `alternates.canonical` satt til absolutt URL.

### Filer
- **Les:** `src/app/layout.tsx` — root layout for `metadataBase`
- **Modifiser:** `src/app/layout.tsx` — sett `metadataBase`
- **Modifiser:** `src/app/(public)/page.tsx` — legg til `generateMetadata` og JSON-LD
- **Modifiser:** `src/app/(public)/book/page.tsx` — `generateMetadata`
- **Modifiser:** `src/app/(public)/faq/page.tsx` — `generateMetadata`
- **Modifiser:** `src/app/(public)/booking-info/page.tsx` — `generateMetadata`
- **Modifiser:** `src/app/(public)/aftercare/page.tsx` — `generateMetadata`

### Akseptansekriterier
- [ ] Alle 5 public ruter har unike `<title>`-tags i formatet "Side | Trovum Tattoo"
- [ ] Alle 5 ruter har `<meta name="description">` med 50-160 tegn
- [ ] Hjemmesiden har JSON-LD med schema.org Person eller LocalBusiness
- [ ] `metadataBase` er satt slik at relative URL-er resolves korrekt
- [ ] `pnpm typecheck && pnpm build` passerer (ingen metadata-type-feil)

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-062: Settings-side og Conta-felter

**Status:** pending
**Fase:** 6
**Avhenger av:** TASK-053, TASK-031

### Hva skal bygges
Bygg settings-siden i `src/app/admin/settings/page.tsx` med tre seksjoner: (1) Push notifications — vis `PushSubscriptionManager`-komponenten (fra TASK-053), aktiveringsstatus, re-abonner-knapp. (2) Mail-konto — vis sist synkroniseringstidspunkt (fra `mailAccounts`-tabellen), statusindikator (aktiv/inaktiv), "Tving synkronisering"-knapp som kaller `syncMail` action manuelt. (3) Conta — informasjonstekst om at Conta er regnskapssystemet, kort instruksjon om bruk. På prosjektdetaljsiden: legg til "Conta-referanse"-tekstfelt og "Fakturert i Conta"-checkbox — lagres via `projects.update` (`invoiceReference` og `accountingStatus` er allerede i schema).

### Filer
- **Les:** `convex/schema.ts` — `mailAccounts`- og `projects`-tabellene
- **Les:** `convex/mail/sync.ts` — `syncMail` action (fra TASK-031)
- **Opprett:** `src/app/admin/settings/page.tsx` — settings-side med tre seksjoner
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx` — legg til Conta-seksjon

### Akseptansekriterier
- [ ] Settings-siden er nåbar fra admin-navigasjon
- [ ] Push-seksjon viser korrekt abonnementsstatus
- [ ] Mail-seksjon viser `lastSyncAt` fra Convex og har "Tving synkronisering"-knapp
- [ ] Conta-referansefelt og checkbox på prosjektdetalj lagres via `projects.update`
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-063: Søk og filtrering — global søk og avanserte filtre

**Status:** pending
**Fase:** 6
**Avhenger av:** TASK-025, TASK-021

### Hva skal bygges
Bygg global admin-søk i `src/app/admin/search/page.tsx`. Søkefelt øverst. Søk på tvers av klienter (navn, e-post, instagram via `clients.list` search index) og inquiries (navn, e-post). Resultater vises i to seksjoner (Kunder / Forespørsler). Legg til filterknapper på inquiry-listen (TASK-014) for `coverUp` og `touchUp` flagg — filter-state i URL query params. Klientliste (TASK-021): behold eksisterende navnesøk. Søkegrensesnitt på mobil: bottom sheet for filtre (shadcn Sheet) eller inline chips. Koble en søke-lenke til AdminNav eller dashboard.

### Filer
- **Les:** `convex/clients.ts` — `list` med search index
- **Les:** `convex/inquiries.ts` — `list` query (legg til `coverUp` og `touchUp` filter-params)
- **Modifiser:** `convex/inquiries.ts` — legg til `coverUp` og `touchUp` som optional filter i `list` query
- **Opprett:** `src/app/admin/search/page.tsx` — global søkeside
- **Modifiser:** `src/app/admin/inquiries/page.tsx` — legg til coverUp/touchUp filter-chips

### Akseptansekriterier
- [ ] Global søk returnerer resultater fra både klienter og inquiries
- [ ] Inquiry-liste har filter-chips for coverUp og touchUp
- [ ] Filter-state bevares i URL query params (fungerer med browser back)
- [ ] Søkesiden er brukbar på mobil med stort søkefelt
- [ ] `pnpm typecheck && pnpm build` passerer

### Verifisering
```bash
pnpm typecheck && pnpm test:run && pnpm build
```

---

## TASK-064: Sluttpolish — tomme tilstander, skjeletter og feilhåndtering

**Status:** pending
**Fase:** 6
**Avhenger av:** TASK-063

### Hva skal bygges
Gjennomfør en kvalitetsaudit av hele appen. (1) Tom tilstand: sjekk at alle listevisninger (inquiries, clients, projects, bookings, mail, notifications) har forklarende tom tilstand med illustrasjon eller ikon og en CTA. (2) Loading skeletons: legg til `loading.tsx` (Next.js route segment loading) eller Suspense-baserte skjeletter for alle admin-listevisninger. (3) Feilhåndtering: sjekk at alle skjema-feil vises tydelig under hvert felt på mobil. (4) 404-sider: opprett `src/app/admin/not-found.tsx` og `src/app/(public)/not-found.tsx`. (5) AdminNav badges: verifiser at uleste notifikasjoner-badge og nye forespørsler-badge fungerer. (6) Kjør full verifikasjonsrunde.

### Filer
- **Les:** Alle admin-sider — for å identifisere manglende tom-tilstander
- **Opprett:** `src/app/admin/loading.tsx` — admin root loading skeleton
- **Opprett:** `src/app/admin/inquiries/loading.tsx` — inquiry liste skeleton
- **Opprett:** `src/app/admin/clients/loading.tsx` — klientliste skeleton
- **Opprett:** `src/app/admin/not-found.tsx` — admin 404-side
- **Opprett:** `src/app/(public)/not-found.tsx` — public 404-side
- **Modifiser:** Diverse admin-sider — legg til tomme tilstander der de mangler

### Akseptansekriterier
- [ ] Alle listevisninger har forklarende tom tilstand (ikke blank side)
- [ ] Loading-skjeletter vises ved datahenting (Convex-queries med Suspense)
- [ ] Alle skjema-feil er synlige under respektive felter på 390px mobil
- [ ] `not-found.tsx` returnerer 404-statuskode og forklarende melding
- [ ] AdminNav badges (notifikasjoner, nye forespørsler) viser korrekte tall
- [ ] `pnpm typecheck && pnpm test:run && pnpm build` passerer uten feil eller advarsler