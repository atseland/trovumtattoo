# TASKS_UI.md — Trovum Tattoo OS v1
## Frontend / UI-implementering mot PRD_UI.md

**Autoritativ kilde:** `PRD_UI.md` — alle farger, fonter, komponenter og mål er hentet derfra.
**Avhengig av:** Alle TASK-001–071 i TASKS.md er merket `done`. Backend og routes er på plass.
**Fokus:** Kun frontend/visuelt lag — ingen Convex-mutations, ingen nye backend-funksjoner.

---

## Metaseksjon

### Bruksregler
1. Ta én oppgave om gangen. Les kun den aktuelle oppgavens seksjon — ikke les hele filen.
2. Kjør `/clear` mellom sesjoner.
3. Verifiser alltid med `pnpm typecheck && pnpm build` før commit.
4. Én oppgave = én git commit. Format: `feat(ui-XXX): kort beskrivelse`.
5. Alle CSS-verdier skal bruke CSS custom properties (tokens) — aldri hardkodede hex-verdier.
6. `border-radius` brukes IKKE på kort, knapper eller inputs — kun på portrettbilder.
7. Sjekk alltid at tap targets er minimum 44px høye (52px for primærhandlinger på mobil).

### Tailwind CSS v4 — KRITISK
Kodebasen bruker **Tailwind CSS v4** med `@theme inline` i `globals.css`. All komponent-styling skjer via `className` med Tailwind utility-klasser.

**Gjør dette:**
```tsx
<button className="inline-flex items-center justify-center min-h-11 px-6 bg-transparent border border-rule text-paper font-sans text-[9.5px] tracking-[0.16em] uppercase hover:bg-[rgba(237,233,230,0.04)] hover:border-[rgba(237,233,230,0.38)] transition-[background,border-color] duration-[250ms]">
```

**IKKE gjør dette:**
```css
/* globals.css */
.btn { display: inline-flex; min-height: 44px; ... }
```

CSS-blokkene i PRD_UI.md er **referanseverdier** som forteller deg *hva* CSS-verdiene skal være. De skal konverteres til Tailwind-klasser, ikke limes inn som rå CSS. Se PRD_UI.md §2.1 for fullstendig token-til-Tailwind-mapping.

Når en oppgave sier "Opprett `src/components/ui/Btn.tsx`" menes en React-komponent som bruker Tailwind i className — ikke en CSS-klasse.

For verdier som ikke har en token (spesifikke px-størrelser, opaciteter, letter-spacing): bruk Tailwinds bracket-notasjon: `text-[44px]`, `leading-[0.92]`, `opacity-[0.07]`.

### Designfasit
- `PRD_UI.md §2` — fargepalett og tokens
- `PRD_UI.md §3` — typografi og fontstack
- `PRD_UI.md §4` — logo og brand mark
- `PRD_UI.md §5` — bilder og assets
- `PRD_UI.md §6` — bakgrunner og overflater
- `PRD_UI.md §7` — komponenter (knapper, inputs, lenker)
- `PRD_UI.md §8` — layout og breakpoints
- `PRD_UI.md §9` — animasjon og bevegelse
- `PRD_UI.md §10` — ikoner
- `PRD_UI.md §11` — admin-adaptasjon og statusfarger
- `PRD_UI.md §12` — tilgjengelighetskrav
- `PRD_UI.md §13` — SEO-tekniske krav
- `PRD_UI.md §14` — PWA manifest og shell
- `PRD_UI.md §15` — tomme tilstander og feilstater
- `PRD_UI.md §17` — hva som aldri skal gjøres
- `PRD_UI.md §18` — asset-oversikt

### Nåværende tilstand (avvik fra PRD_UI.md)
Implementasjonen fra TASKS.md 001–071 bruker et midlertidig designsystem som avviker fra PRD_UI.md:
- **Feil fonter:** Playfair Display + Geist i stedet for EB Garamond + IBM Plex Sans + Jost
- **Feil fargetokens:** `--color-accent: #c9933a` (amber/gold) i stedet for `--accent: #a09488` (varm taupe)
- **Feil statusfarger:** Mettede farger (blå, lilla, grønn, rød) i stedet for PRD_UI §11 sine dempede varianter
- **Feil bakgrunnsfarger:** `#0d0c0b`, `#141210`, `#1c1916` i stedet for `#0d0b09`, `#161412`
- **Border-radius overalt:** `rounded`, `rounded px-8` m.fl. — PRD_UI §17 forbyr dette på UI-elementer
- **Hardkodede hex-verdier:** Direkte `#c9b99a`, `#7a6e62` i komponentkode — skal bruke tokens
- **Logo som tekst:** "Trovum" i serif italic — skal bruke `logo.png`/`logo.webp` bildefil (PRD_UI §4)
- **Manglende body-bakgrunn med glow** på desktop (PRD_UI §6.1)
- **Manglende animasjoner** (PRD_UI §9 fade-in, hover-overganger, active press-state)
- **Manglende focus-state** (PRD_UI §7.6 — `outline: 1px solid var(--accent)`)
- **Knapper:** Mangler ghost-stil med subtil border (PRD_UI §7.1–7.4)
- **Inputs i bookingskjema:** Mangler `::placeholder`-styling, focus-state og `--mast-left` plassholderfarge
- **Tomme tilstander:** Mangler ikon + Garamond italic-overskrift (PRD_UI §15)
- **Portfolio-grid:** Placeholder-rektangler uten real assets fra `artworks/`-mappen
- **Hero:** Mangler logo-watermark, korrekt display-typografi (PRD_UI §3.3)
- **Eyebrow-etiketter:** Mangler (IBM Plex Sans, 8px, uppercase, `--index-num`)
- **Sidefade-animasjon** mangler på public og admin-sider
- **OG-metadata:** Mangler `og:image` og Twitter Card-tags på alle sider
- **Strukturert data:** JSON-LD bruker feil adresse og beskrivelse (PRD_UI §13)
- **PWA:** `manifest.json` bruker feil `theme_color` (`#0d0c0b` → `#0d0b09`)

---

## Avhengighetsgraf

```
TASK-UI-001 (design system tokens + fonter)
    │
    ├──► TASK-UI-002 (logo-komponent)
    │        │
    │        ├──► TASK-UI-010 (public header)
    │        │        └──► TASK-UI-011 (public footer)
    │        │
    │        └──► TASK-UI-020 (admin nav + layout)
    │
    ├──► TASK-UI-003 (knapper, lenker, seksjons-divider)
    │        │
    │        ├──► TASK-UI-004 (skjemaelementer + tomme tilstander)
    │        │        │
    │        │        ├──► TASK-UI-030 (bookingskjema redesign)
    │        │        │
    │        │        ├──► TASK-UI-040 (admin inquiry-liste redesign)
    │        │        ├──► TASK-UI-041 (admin inquiry detail redesign)
    │        │        ├──► TASK-UI-042 (admin dashboard redesign)
    │        │        ├──► TASK-UI-043 (admin klientliste redesign)
    │        │        ├──► TASK-UI-044 (admin klient- og prosjektdetalj redesign)
    │        │        ├──► TASK-UI-045 (admin kalender redesign)
    │        │        ├──► TASK-UI-046 (admin mail redesign)
    │        │        ├──► TASK-UI-047 (admin maler redesign)
    │        │        ├──► TASK-UI-048 (admin varsler redesign)
    │        │        └──► TASK-UI-049 (admin settings redesign)
    │        │
    │        ├──► TASK-UI-020
    │        │
    │        └──► TASK-UI-050 (public homepage redesign)
    │                 │
    │                 ├──► TASK-UI-051 (FAQ redesign)
    │                 ├──► TASK-UI-052 (booking-info redesign)
    │                 └──► TASK-UI-053 (aftercare redesign)
    │
    ├──► TASK-UI-060 (OG-metadata og Twitter Card)
    │        └──► TASK-UI-061 (strukturert data + favicon)
    │
    └──► TASK-UI-070 (PWA manifest, ikoner og offline-side)
             └──► TASK-UI-071 (page fade-animasjon og global polish)
```

---

## Fase 1 — Designsystem-fundament
**Mål:** Erstatte eksisterende midlertidig palette og fontstack med PRD_UI.md-fasiten. Alle sider vil automatisk arve riktige tokens etter denne fasen.

---

### TASK-UI-001: Design system — CSS-tokens, fontstack og globale stiler

**Status:** [x]
**Avhenger av:** —

#### Hva skal gjøres
Erstatt `src/app/globals.css` og `src/app/layout.tsx` med PRD_UI.md-fasiten:

**`layout.tsx`:** Bytt ut Playfair Display med EB Garamond + IBM Plex Sans + Jost via `next/font/google`. Geist Sans og Geist Mono fjernes. Font-variablene `--font-garamond`, `--font-plex`, `--font-jost` eksporteres.

**`globals.css`:** Erstatt hele `:root`-blokken med PRD_UI.md §2-tokenene, og erstatt hele `@theme inline`-blokken med PRD_UI.md §2.1 Tailwind-mappingen. Behold `@import "tailwindcss";` som første linje.

`:root`-tokens:
```
--bg: #0d0b09
--panel: #161412
--paper: #ede9e6
--body: #b8b0a8
--nav: #9a948e
--mast-left: #8a8078
--mast-right: #7a7068
--index-num: #6a6058
--footer-label: #685850
--accent: #a09488
--rule: rgba(237,233,230,0.065)
--rule-heavy: rgba(237,233,230,0.08)
--rule-light: rgba(237,233,230,0.04)
--rule-inner: rgba(237,233,230,0.07)
--pad: 20px
+ alle 7 statusfarger fra PRD_UI §11
```

`@theme inline`-blokken (Tailwind v4 mapping) — erstatt eksisterende fullstendig med PRD_UI.md §2.1:
```css
@theme inline {
  --color-bg: var(--bg);
  --color-panel: var(--panel);
  --color-paper: var(--paper);
  --color-body: var(--body);
  --color-nav: var(--nav);
  --color-accent: var(--accent);
  --color-mast-left: var(--mast-left);
  --color-mast-right: var(--mast-right);
  --color-index-num: var(--index-num);
  --color-footer-label: var(--footer-label);
  --color-rule: var(--rule);
  --color-rule-heavy: var(--rule-heavy);
  --color-rule-light: var(--rule-light);
  --color-rule-inner: var(--rule-inner);
  /* + alle statusfarger */
  /* + font-mapping: --font-sans → Jost, --font-serif → EB Garamond, --font-mono → IBM Plex Sans */
  /* + --spacing-pad: var(--pad) */
}
```

Etter dette skal klasser som `bg-bg`, `text-paper`, `border-rule`, `font-serif`, `font-mono` fungere i hele kodebasen.

Legg til globale body-stiler (PRD_UI §3.2):
- `font-family: var(--font-jost), sans-serif` på `body`
- `-webkit-font-smoothing: antialiased` på `body`
- `background: var(--bg)` på `body`
- `color: var(--paper)` på `body`
- `box-sizing: border-box; margin: 0; padding: 0` på `*, *::before, *::after`
- `color: inherit` på `a`
- `scroll-behavior: smooth` på `html`

Desktop bakgrunn (PRD_UI §6.1) via `@media (min-width: 1024px)`:
```css
body {
  background:
    radial-gradient(circle at top, rgba(160,148,136,0.06), transparent 38%),
    linear-gradient(180deg, #13110f 0%, var(--bg) 100%);
}
```

Global focus-state (PRD_UI §7.6):
```css
:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 2px;
}
```

Legg til desktop `--pad`-override via CSS custom property:
```css
@media (min-width: 1024px) { :root { --pad: 48px; } }
```

Legg til page fade-inn-animasjon (PRD_UI §9):
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

#### Filer som påvirkes
- **Modifiser:** `src/app/globals.css` — fullstendig erstatning av `:root` og `@theme`
- **Modifiser:** `src/app/layout.tsx` — bytt Playfair Display med EB Garamond + IBM Plex Sans + Jost, oppdater `--font-*`-variabler

#### Akseptansekriterier
- [ ] EB Garamond italic renderer korrekt i browser (verifiser i DevTools)
- [ ] Jost rendrer korrekt som UI-sans
- [ ] IBM Plex Sans rendrer korrekt som label-font
- [ ] `var(--bg)` er `#0d0b09` (ikke `#0d0c0b`)
- [ ] `var(--accent)` er `#a09488` (ikke `#c9933a`)
- [ ] `var(--rule)` er `rgba(237,233,230,0.065)` — ikke en hardkodet farge
- [ ] Alle 7 statusfarger er definert i `:root` og mappet i `@theme inline`
- [ ] `@theme inline`-blokken mapper alle tokens korrekt (test: `bg-bg`, `text-paper`, `border-rule`, `font-serif` fungerer)
- [ ] `@import "tailwindcss"` er bevart som første linje i globals.css
- [ ] Focus-state viser `outline: 1px solid var(--accent)` ved tastaturfokus
- [ ] Desktop-bakgrunnen har radial gradient (verifiser på ≥1024px viewport)
- [ ] `pnpm typecheck && pnpm build` passerer

#### Notater
Dette er grunnmuren alle andre TASK-UI-er bygger på. Gjør dette riktig — ikke gå videre til neste oppgave før alle tokens er verifisert i DevTools.

---

### TASK-UI-002: Logo-komponent — bildefil i stedet for tekst

**Status:** [x]
**Avhenger av:** TASK-UI-001

#### Hva skal gjøres
Opprett en gjenbrukbar `Logo`-komponent som alltid bruker `logo.webp` (primær) / `logo.png` (fallback) fra `/public/` — aldri tekst (PRD_UI §4.1–4.3).

Komponent: `src/components/Logo.tsx`

Props:
- `context: 'nav' | 'footer' | 'hero-watermark'`
- Størrelse og opacity per kontekst (PRD_UI §4.3):
  - `nav`: `height: 32px` mobil / `36px` desktop, `opacity: 0.92`, `transform: translateX(-10px)`
  - `footer`: `height: 36px`, `opacity: 0.35`
  - `hero-watermark`: `width: 300px` mobil / `clamp(360px, 44vw, 560px)` desktop, `opacity: 0.07`
- CSS-filter for mørk bakgrunn (PRD_UI §4.2):
  ```css
  filter: invert(93%) sepia(5%) saturate(200%) hue-rotate(340deg) brightness(95%);
  ```

Oppdater alle eksisterende steder der "Trovum" er skrevet som tekst i serif italic:
- `src/components/public/PublicHeader.tsx`
- `src/components/admin/AdminNav.tsx` (desktop sidebar)

#### Filer som påvirkes
- **Opprett:** `src/components/Logo.tsx`
- **Modifiser:** `src/components/public/PublicHeader.tsx` — erstatt tekst-logo med `<Logo context="nav" />`
- **Modifiser:** `src/components/admin/AdminNav.tsx` — erstatt tekst-logo med `<Logo context="nav" />`

#### Akseptansekriterier
- [ ] `logo.webp` brukes med `logo.png` som fallback via `<picture>` eller `next/image`
- [ ] Korrekt CSS-filter er applisert slik at sort logo vises som varm hvit (`--paper`-temperatur)
- [ ] Riktig størrelse og opacity per kontekst (verifiser alle tre kontekster)
- [ ] `transform: translateX(-10px)` er applisert i nav-kontekst
- [ ] Ingen "Trovum"-tekst gjenstår i PublicHeader eller AdminNav
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-003: Delte UI-komponenter — knapper, lenker og seksjons-divider

**Status:** [x]
**Avhenger av:** TASK-UI-001

#### Hva skal gjøres
Opprett et sett med PRD_UI.md-konformante UI-primitiver. Alle eksisterer som rene CSS-klasser i PRD_UI.md men skal implementeres som React-komponenter for gjenbruk.

**`src/components/ui/Btn.tsx`** — primær ghost-knapp (PRD_UI §7.1):
- `variant: 'default' | 'sm' | 'action' | 'action-primary' | 'action-cta'`
- Default: `min-height: 44px`, `padding: 12px 24px`, transparent bakgrunn, border `rgba(237,233,230,0.22)`, Jost 9.5px, letter-spacing 0.16em, uppercase
- `sm`: `min-height: 44px`, border `rgba(237,233,230,0.12)`, `--nav`-farge
- `action`: `min-height: 52px`, full bredde, Jost 11px, letter-spacing 0.12em (PRD_UI §7.4)
- Hover-transitions (PRD_UI §9): `background 0.25s, border-color 0.25s`
- Active: `transform: scale(0.985)`
- Hover-løft på `action`-varianter: `translateY(-1px)`
- Ingen `border-radius` (PRD_UI §17)

**`src/components/ui/LinkI.tsx`** — italic Garamond-lenke (PRD_UI §7.3):
- EB Garamond italic, 14px, `--accent`-farge, `border-bottom: 1px solid rgba(160,148,136,0.28)`
- Hover: `color: var(--paper)`

**`src/components/ui/Rule.tsx`** — seksjons-divider (PRD_UI §7.6):
- `width: 100%; height: 1px; background: var(--rule-inner); margin: 16px 0`

**`src/components/ui/Eyebrow.tsx`** — seksjonsetikett (PRD_UI §3.3):
- IBM Plex Sans, 8px, letter-spacing 0.24em, uppercase, `--index-num`-farge
- Valgfri `withLine`-prop som legger til dekorativ 16px horisontal strek foran

#### Filer som påvirkes
- **Opprett:** `src/components/ui/Btn.tsx`
- **Opprett:** `src/components/ui/LinkI.tsx`
- **Opprett:** `src/components/ui/Rule.tsx`
- **Opprett:** `src/components/ui/Eyebrow.tsx`

#### Akseptansekriterier
- [ ] `Btn` rendrer alle 5 varianter uten `border-radius`
- [ ] `min-height: 44px` på alle Btn-varianter (52px på action)
- [ ] Hover-transition er 0.25s (ikke mer)
- [ ] Active press-state er `scale(0.985)`
- [ ] `LinkI` bruker EB Garamond italic og `--accent`-farge
- [ ] `Eyebrow` bruker IBM Plex Sans (med monospace-fallback), 8px, uppercase
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-004: Skjemaelementer og tomme tilstander

**Status:** [x]
**Avhenger av:** TASK-UI-001, TASK-UI-003

#### Hva skal gjøres

**Skjemaelementer** (PRD_UI §7.5) — samle i `src/components/ui/FormField.tsx`:
- Input: `background: rgba(237,233,230,0.03)`, border `rgba(237,233,230,0.14)`, `min-height: 44px`
- Placeholder: `color: var(--mast-left); opacity: 1`
- Focus: `border-color: rgba(237,233,230,0.35)`, `background: rgba(237,233,230,0.05)`
- Textarea: `min-height: 120px`, `resize: vertical`
- Label: Jost, 10px, letter-spacing 0.14em, uppercase, `--nav`-farge
- Valgfri-markering (`.label-optional`): EB Garamond italic, 12px, `--mast-left`
- Feilstate: `border-color: rgba(175,140,135,0.5)` + feilmelding Jost 12px, `#af8c87`
- Select: custom chevron-pil (SVG) i `--nav`-farge, `appearance: none`
- Filopplasting: `min-height: 80px`, `border: 1px dashed rgba(237,233,230,0.18)`, flex sentrert

**Tom tilstand** (PRD_UI §15) — `src/components/ui/EmptyState.tsx`:
- Props: `icon` (SVG-node), `title` (EB Garamond italic 18px `--nav`), `text` (Jost 13px `--mast-left`, max 32ch), valgfri `action` (knapp)
- Ikon: `48×48px`, `opacity: 0.25`, `color: var(--nav)`
- Padding: `48px 24px`, sentrert

**Feilstate** (PRD_UI §15) — legg til `variant="error"` på `EmptyState`:
- Feilikon i `#af8c87` med `opacity: 0.35`
- "Prøv igjen"-knapp

**Loading skeleton** (PRD_UI §15):
- `src/components/ui/Skeleton.tsx`: `background: rgba(237,233,230,0.04)` med rolig pulse-animasjon (ingen spinner)

#### Filer som påvirkes
- **Opprett:** `src/components/ui/FormField.tsx`
- **Opprett:** `src/components/ui/EmptyState.tsx`
- **Opprett:** `src/components/ui/Skeleton.tsx`

#### Akseptansekriterier
- [ ] Input-focus-state er korrekt (border + bakgrunn endres, ingen native outline)
- [ ] Placeholder bruker `--mast-left` (ikke standard grå)
- [ ] Feilstate bruker dempet rød-brun (`#af8c87`), ikke knallrød
- [ ] `EmptyState` har korrekt EB Garamond italic-tittel og Jost-undertekst
- [ ] `Skeleton` bruker puls-animasjon uten spinner
- [ ] Ingen `border-radius` på inputfelter
- [ ] `pnpm typecheck && pnpm build` passerer

---

## Fase 2 — Public site-layout og navigasjon

---

### TASK-UI-010: Public header — logo, navigasjon og CTA

**Status:** [x]
**Avhenger av:** TASK-UI-002, TASK-UI-003

#### Hva skal gjøres
Redessign `src/components/public/PublicHeader.tsx` til PRD_UI.md-standard:

- Bakgrunn: `var(--bg)` (ikke hardkodet)
- Border-bottom: `1px solid var(--rule)` (ikke `--color-border-subtle`)
- Logo: `<Logo context="nav" />` fra TASK-UI-002
- Nav-lenker (PRD_UI §3.3): Jost, 7.5px mobil / 9.5px desktop, letter-spacing 0.08em mobil / 0.12em desktop, uppercase, `--nav`-farge, hover `--paper`
- Lenker: `/book`, `/faq`, `/booking-info`, `/aftercare` — skjul på smal mobil (vis kun CTA)
- CTA-knapp: `<Btn variant="default">Book time</Btn>` fra TASK-UI-003
- Ingen `border-radius` på CTA

#### Filer som påvirkes
- **Modifiser:** `src/components/public/PublicHeader.tsx`

#### Akseptansekriterier
- [ ] Logo-bildet (`logo.webp`) vises med korrekt filter og opacity
- [ ] CTA-knapp er ghost-stil (transparent bakgrunn, subtil border) — ikke amber/gold
- [ ] Nav-tekst er Jost uppercase i `--nav`-farge
- [ ] Header-border bruker `var(--rule)`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-011: Public footer

**Status:** [x]
**Avhenger av:** TASK-UI-002, TASK-UI-010

#### Hva skal gjøres
Redesign `src/components/public/PublicFooter.tsx`:

- Logo: `<Logo context="footer" />` (opacity 0.35)
- Jost brødtekst i `--footer-label` for metadata
- Footer-lenker (PRD_UI §7.7): `--accent`, `border-bottom: 1px solid rgba(160,148,136,0.18)`, hover `--paper`
- Seksjoner: Instagram-lenke, e-post, `©`-tekst
- Top-border: `1px solid var(--rule)`
- Padding: `var(--pad)` horisontalt, `40px` vertikalt

#### Filer som påvirkes
- **Modifiser:** `src/components/public/PublicFooter.tsx`

#### Akseptansekriterier
- [ ] Footer-logo er bildefil med korrekt opacity (0.35)
- [ ] Lenker bruker `--accent`-farge og footer-link-stil
- [ ] Footer-tekst bruker `--footer-label`-farge
- [ ] Border-top bruker `var(--rule)`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-020: Admin layout — navigasjon, header og panel-overflate

**Status:** [x]
**Avhenger av:** TASK-UI-002, TASK-UI-003, TASK-UI-004

#### Hva skal gjøres
Redesign admin-layouten (`src/app/admin/layout.tsx`) og `src/components/admin/AdminNav.tsx`:

**Layout-overflate** (PRD_UI §6.2–6.3):
- Sidebar-bakgrunn: `var(--panel)` (`#161412`), border `1px solid var(--rule)`
- Hoved-innholdsflate: `var(--bg)`
- Desktop: sidebar + main-grid (`grid-template-columns: 224px 1fr` eller lignende)

**AdminNav desktop sidebar** (PRD_UI §11):
- Logo øverst: `<Logo context="nav" />`
- Nav-lenker: Jost 9.5px, uppercase, `--nav`-farge, hover `--paper`, aktiv `--accent`
- Aktiv bakgrunn: `rgba(237,233,230,0.04)` — ikke `#1c1916`
- Ingen `border-radius` på lenker

**AdminNav mobil bunnavigasjon:**
- Bakgrunn: `var(--panel)`, border-top `1px solid var(--rule)`
- Ikoner: inline SVG `stroke="currentColor"` `stroke-width="1.5"` (PRD_UI §10) — bruk Lucide
- Aktiv: `--accent`, inaktiv: `--nav`
- Labels: Jost, 7px, uppercase
- Min-height: 64px, tap targets ≥ 44px

**Ulest-badge på varsler:**
- Bakgrunn: `var(--accent)`, tekst: `var(--bg)`
- Ingen `border-radius: 999px` — bruk `border-radius: 2px` (badge er rektangulær i admin-stil)

**Admin header (sticky):**
- Bakgrunn: `var(--panel)`, border-bottom `1px solid var(--rule)`
- Tittel: Jost, font-weight 500, `--paper`

**StatusBadge** (PRD_UI §11):
- Oppdater `src/components/admin/StatusBadge.tsx` til PRD_UI §11-fargene:
  - `Ny`: `--status-new-bg` / `--status-new-text`
  - `Trenger mer info`: `--status-info-bg` / `--status-info-text`
  - `Tilbud sendt`: `--status-offer-bg` / `--status-offer-text`
  - `Venter på depositum`: `--status-deposit-bg` / `--status-deposit-text`
  - `Booket`: `--status-booked-bg` / `--status-booked-text`
  - `Fullført`: `--status-done-bg` / `--status-done-text`
  - `Avslått`: `--status-rejected-bg` / `--status-rejected-text`
- Badge: Jost 9px, letter-spacing 0.12em, uppercase, `border-radius: 2px`, `padding: 4px 10px`

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/layout.tsx`
- **Modifiser:** `src/components/admin/AdminNav.tsx`
- **Modifiser:** `src/components/admin/StatusBadge.tsx`

#### Akseptansekriterier
- [ ] Sidebar-bakgrunn er `var(--panel)` — ikke hardkodet `#141210`
- [ ] StatusBadge bruker PRD_UI §11-fargene (dempede, varme — ikke mettede blå/grønn/rød)
- [ ] StatusBadge har `border-radius: 2px` (ikke pille-form)
- [ ] AdminNav mobile-badges er rektangulære
- [ ] Ulest-varsler-badge bruker `var(--accent)` bakgrunn
- [ ] Alle token-referanser bruker CSS custom properties — ingen hardkodede hex
- [ ] `pnpm typecheck && pnpm build` passerer

---

## Fase 3 — Public site-sider

---

### TASK-UI-050: Public hjemmeside — hero, portfolio og CTA

**Status:** [ ]
**Avhenger av:** TASK-UI-010, TASK-UI-011, TASK-UI-003

#### Hva skal gjøres
Redesign `src/app/(public)/page.tsx` mot PRD_UI.md §3 (typografiskala) og §5 (portfolio-assets).

**Hero-seksjon** (PRD_UI §3.3 Display/Hero H1):
- H1: EB Garamond italic, 44px mobil / `clamp(48px, 7vw, 72px)` desktop, `line-height: 0.92`, `letter-spacing: -0.025em`, `--paper`
- Bruk tagline, ikke bare "Trovum Tattoo"
- Logo-watermark bak H1: `<Logo context="hero-watermark" />` med `position: absolute; pointer-events: none`
- Hero-hero-seksjon: `min-height: 100svh`, relativ posisjonering for watermark
- Ingress (PRD_UI §3.3 Pull-sitat): EB Garamond italic, 17px, `line-height: 1.4`, `rgba(237,233,230,0.60)`, `max-width: 28ch`
- CTA: `<Btn variant="action-cta">Send bookingforespørsel</Btn>` — full bredde på mobil

**Artistintro-seksjon:**
- Eyebrow: `<Eyebrow withLine>Om tatovøren</Eyebrow>`
- H2: EB Garamond italic, `clamp(22px, 3vw, 30px)`, `--paper`
- Brødtekst: Jost, 13px mobil / 14px desktop, `line-height: 1.8`, `--body`, `max-width: 48ch`
- Portrett: `profilbilde.jpeg` med `filter: grayscale(20%) contrast(1.05)` (PRD_UI §5.2)
  - Firkantede kanter (ikke round), `border: 1px solid var(--rule-heavy)`
  - Størrelse: `72×72px` eller litt større på desktop

**Portfolio-grid:**
- Eyebrow: `<Eyebrow withLine>Portfolio</Eyebrow>`
- Bruk faktiske bilder fra `public/artworks/Art1–7.png` (PRD_UI §5.1)
- Filter: `grayscale(20%) contrast(1.05)` på hvert bilde
- Grid: 2 kolonner mobil, 3–4 desktop
- `aspect-ratio: 1` (kvadratiske celler)
- Ingen `border-radius`

**Stilretning/spesialisering:**
- Eyebrow + H2
- Liste med stilretninger (dark art, blackwork, realism, custom design)
- Jost brødtekst

**Bookingprosess-seksjon:**
- Tre steg med seksjonstall (IBM Plex Sans, 8px, `--index-num`)
- Steg-tittel: Jost 500
- Steg-tekst: Jost 13px `--body`

**Avsluttende CTA:**
- H2: EB Garamond italic
- `<Btn variant="action-cta">Book tatovering</Btn>` — mobil full bredde

**Seksjon-separatorer:** `<Rule />` mellom alle seksjoner

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/page.tsx`

#### Akseptansekriterier
- [ ] H1 bruker EB Garamond italic med korrekt `line-height: 0.92` og `letter-spacing: -0.025em`
- [ ] Hero-watermark (logo) er synlig bak H1 med `opacity: 0.07`
- [ ] Portrettbilde er kvadratisk med grayscale-filter og `var(--rule-heavy)` border
- [ ] Portfolio viser `Art1–7.png` (ikke placeholder-rektangler)
- [ ] Alle CTA-knapper bruker ghost-stil (ingen amber/gold bakgrunn)
- [ ] Eyebrow-etiketter er synlige på alle seksjoner
- [ ] Ingen `border-radius` på bilder eller knapper
- [ ] Siden er lesbar og flott på 390px mobil (CTA above the fold)
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-051: FAQ-side

**Status:** [ ]
**Avhenger av:** TASK-UI-050

#### Hva skal gjøres
Redesign `src/app/(public)/faq/page.tsx` (PRD §11.3):

- Page-header: Eyebrow + H1 EB Garamond italic `clamp(32px, 5vw, 48px)`
- Accordion: Fjern shadcn Accordion hvis den bruker `border-radius` eller feil typografi. Bygg custom (eller tilpass shadcn til PRD_UI §17 — ingen rounded corners)
- Spørsmål: Jost, `--paper`, `min-height: 52px`, uppercase letter-spacing svak
- Svar: Jost 13px, `--body`, `line-height: 1.8`, `max-width: 48ch`
- Åpen/lukket-indikator: inline SVG chevron i `--nav`-farge
- Dividers: `1px solid var(--rule)` mellom hvert spørsmål
- Back-lenke øverst: `<LinkI href="/">← Tilbake</LinkI>`

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/faq/page.tsx`

#### Akseptansekriterier
- [ ] Ingen `border-radius` på accordion-elementer
- [ ] H1 bruker EB Garamond italic
- [ ] Svar-tekst bruker Jost `--body`, 1.8 linjehøyde
- [ ] Dividers bruker `var(--rule)` (ikke hardkodet)
- [ ] Back-lenke er synlig
- [ ] Siden er brukbar på mobil (store tap targets på accordion)
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-052: Booking-info-side

**Status:** [ ]
**Avhenger av:** TASK-UI-050

#### Hva skal gjøres
Redesign `src/app/(public)/booking-info/page.tsx` (PRD §11.2):

- Page-header: Eyebrow + H1 EB Garamond italic
- Seksjoner med H2 (EB Garamond italic, `clamp(22px, 3vw, 30px)`)
- Brødtekst: Jost, 13px / 14px, `--body`, `max-width: 48ch`
- `<Rule />` mellom seksjoner
- "Highlighted info-celle" (PRD_UI §6.4) for viktig informasjon (f.eks. depositum-forklaring):
  ```css
  background: linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02));
  border-top: 1px solid rgba(237,233,230,0.1);
  border-bottom: 1px solid rgba(237,233,230,0.1);
  ```
- CTA til `/book` i bunnen av siden

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/booking-info/page.tsx`

#### Akseptansekriterier
- [ ] H1 og H2 bruker EB Garamond italic
- [ ] Highlighted-celle er implementert for minst én nøkkelinformasjon
- [ ] `<Rule />` brukes mellom seksjoner
- [ ] CTA er synlig i bunnen
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-053: Aftercare-side

**Status:** [ ]
**Avhenger av:** TASK-UI-050

#### Hva skal gjøres
Redesign `src/app/(public)/aftercare/page.tsx` (PRD §11.4):

- Page-header: Eyebrow + H1 EB Garamond italic
- Trinn-for-trinn med seksjonstall (IBM Plex Sans 8px, `--index-num`)
- Hvert trinn: Jost 500 tittel + Jost 13px `--body` tekst
- `<Rule />` mellom trinn
- Back-lenke

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/aftercare/page.tsx`

#### Akseptansekriterier
- [ ] Seksjonstall bruker IBM Plex Sans 8px `--index-num`
- [ ] H1 bruker EB Garamond italic
- [ ] Trinn-tekst er Jost `--body`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-030: Bookingskjema — redesign mot PRD_UI §7.5

**Status:** [x]
**Avhenger av:** TASK-UI-004, TASK-UI-010

#### Hva skal gjøres
Redesign `src/app/(public)/book/page.tsx` og fjern alle hardkodede inline styles til fordel for `<FormField />` fra TASK-UI-004:

- Page-header: Eyebrow + H1 EB Garamond italic
- Alle input-felter: bruk `<FormField />` (ikke `inputStyle`-objektet fra eksisterende kode)
- Labels: Jost 10px uppercase `--nav` (valgfri-markering i EB Garamond italic `--mast-left`)
- Feilmeldinger: Jost 12px `#af8c87` — dempet rød-brun, ikke `#c9933a`
- Filopplastings-felt: dashed border-stil (PRD_UI §7.5)
- Submit-knapp: `<Btn variant="action-cta">Send forespørsel</Btn>` — mobil full bredde
- Loading-state: tekst "Sender…" og deaktivert tilstand — ikke spinner
- Suksess-skjerm: EB Garamond italic overskrift, Jost brødtekst, `<Btn variant="sm">`-lenke til ny forespørsel

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/book/page.tsx`

#### Akseptansekriterier
- [ ] Ingen `inputStyle`-objekt-konstanter gjenstår i koden
- [ ] Alle felt bruker `<FormField />` fra TASK-UI-004
- [ ] Feilmeldinger er `#af8c87` (dempet) — ikke amber
- [ ] Submit-knapp er ghost-stil, full bredde på mobil
- [ ] Filopplastingsfelt har dashed border-stil
- [ ] Siden er brukbar med én hånd på 390px mobil
- [ ] `pnpm typecheck && pnpm build` passerer

---

## Fase 4 — Admin-sider

---

### TASK-UI-040: Admin inquiry-liste — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/inquiries/page.tsx`:

- Sidetittel: Jost 500, `--paper`
- Filter-tabs: Jost 8.5px uppercase, aktiv `--paper`, inaktiv `--nav`, understrek-indikator i `--accent`
- Inquiry-kort:
  - Bakgrunn: `var(--panel)`, border `1px solid var(--rule)`
  - Navn: Jost 500, `--paper`
  - E-post: Jost 13px, `--body`
  - `<StatusBadge />` — oppdatert fra TASK-UI-020
  - Dato: Jost 12px, `--mast-left`
  - `min-height: 60px` per rad, `padding: 14px 16px`
  - Hover: `background: rgba(237,233,230,0.02)`
- Tom tilstand: `<EmptyState icon={...} title="Ingen forespørsler ennå" text="Forespørsler vil dukke opp her..." />`
- Ingen `border-radius` på kort

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/inquiries/page.tsx`

#### Akseptansekriterier
- [ ] Kort bruker `var(--panel)` og `var(--rule)` — ikke hardkodede verdier
- [ ] StatusBadge viser PRD_UI §11-farger
- [ ] Filter-tabs er tydelige og brukbare på mobil
- [ ] Tom tilstand bruker `<EmptyState />`
- [ ] Ingen `border-radius` på kortene
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-041: Admin inquiry detail — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-040

#### Hva skal gjøres
Redesign `src/app/admin/inquiries/[id]/page.tsx`:

- Tilbakeknapp: Jost, `--nav`, pil-ikon SVG
- Kundenavn: H1 EB Garamond italic, `--paper`
- `<StatusBadge />` ved siden av navn
- Felt-grid: Label (Jost 10px uppercase `--nav`) + Verdi (Jost 14px `--paper`)
- Highlighted info-celle (PRD_UI §6.4) for nøkkeldetaljer (beskrivelse, plassering)
- Bildegalleri: kvadratiske celler, `grayscale(20%) contrast(1.05)`, ingen `border-radius`
- Hurtighandlings-knapper: `<Btn variant="action-primary" />` for "Endre status", `<Btn variant="sm" />` for sekundærhandlinger
- Aktivitetslogg: Jost 12px `--mast-left`, timestamp + handling
- `<Rule />` mellom seksjoner

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/inquiries/[id]/page.tsx`

#### Akseptansekriterier
- [ ] Kundenavn er EB Garamond italic
- [ ] Bildegalleri har grayscale-filter og ingen rounded corners
- [ ] Hurtighandlings-knapper bruker korrekte Btn-varianter
- [ ] Aktivitetslogg bruker Jost 12px `--mast-left`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-042: Admin dashboard — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/page.tsx`:

- Summary-kort:
  - Bakgrunn: `var(--panel)`, border `1px solid var(--rule)`
  - Tall: EB Garamond, 36px, `--paper` (lett å scanne)
  - Label: Jost 10px uppercase `--mast-left`
  - Grid: 2 kolonner på mobil (gap 12px)
- Snarveier: `<Btn variant="action" />` med bredde tilpasset mobil
- "Siste forespørsler"-seksjon:
  - Eyebrow-etikett øverst
  - Rad-kortene fra TASK-UI-040
- Loading: Erstatt `<p>Laster…</p>` med `<Skeleton />`-komponenter
- Ingen `border-radius` på kort

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/page.tsx`

#### Akseptansekriterier
- [ ] Summary-tall bruker EB Garamond, 36px, `--paper`
- [ ] Loading-state bruker `<Skeleton />` — ikke teksten "Laster…"
- [ ] Snarveier er `<Btn variant="action" />`
- [ ] Ingen hardkodede hex-verdier
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-043: Admin klientliste — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/clients/page.tsx`:

- Søkefelt: `<FormField />` input med lupe-ikon (SVG inline, `--nav`-farge)
- Klient-kort: samme kortstil som inquiry-lista (panel, rule, padding)
- Instagram-handle: Jost 12px `--mast-left` med `@`-prefix
- Dato: relativ dato Jost 12px `--mast-left`
- Tom tilstand: `<EmptyState />`

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/clients/page.tsx`

#### Akseptansekriterier
- [ ] Søkefelt bruker `<FormField />`-stil
- [ ] Klient-kort bruker `var(--panel)` og `var(--rule)`
- [ ] Tom tilstand bruker `<EmptyState />`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-044: Admin klient- og prosjektdetalj — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-043

#### Hva skal gjøres
Redesign `src/app/admin/clients/[id]/page.tsx` og `src/app/admin/projects/[id]/page.tsx`:

**Klientdetalj:**
- Portrett (hvis tilgjengelig): 72×72px, firkantet (PRD_UI §5.3), `--rule-heavy` border
- Kundenavn: H1 EB Garamond italic
- Kontaktinfo: Jost 13px `--body`
- Notater-felt: `<FormField />` textarea med inline lagre-knapp
- Prosjektliste: panel-kort med StatusBadge og dato

**Prosjektdetalj:**
- H1 EB Garamond italic (prosjektnavn eller kundenavn)
- `<StatusBadge />` fremtredende
- Highlighted info-celle (PRD_UI §6.4) for estimat og depositumstatus
- Depositumstatus-indikator: `--status-deposit-text` for `pending`, `--status-done-text` for `received`
- Hurtighandlinger (Send aftercare, Be om anmeldelse, Endre status): `<Btn variant="action-primary" />` eller `<Btn variant="sm" />`
- Aktivitetslogg: `<ActivityLogTimeline />` med korrekte typografi-tokens
- `<Rule />` mellom seksjoner

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/clients/[id]/page.tsx`
- **Modifiser:** `src/app/admin/projects/[id]/page.tsx`

#### Akseptansekriterier
- [ ] H1 er EB Garamond italic på begge sider
- [ ] Depositumstatus-farger er PRD_UI §11-kompatible
- [ ] Highlighted-celle for estimat og depositum
- [ ] Aktivitetslogg bruker Jost 12px `--mast-left`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-045: Admin kalender — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/calendar/page.tsx`:

- Dato-headers: IBM Plex Sans 8px uppercase `--index-num`
- Booking-kort: panel-bakgrunn, rule border, `min-height: 60px`
  - Kundenavn: Jost 500 `--paper`
  - Tidsrom: Jost 13px `--body`
  - StatusBadge
- Tom tilstand: `<EmptyState />`
- "Ny booking"-knapp: `<Btn variant="action-cta" />` sticky bunn på mobil

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/calendar/page.tsx`

#### Akseptansekriterier
- [ ] Dato-headers bruker IBM Plex Sans 8px `--index-num`
- [ ] Booking-kort bruker panel + rule
- [ ] Sticky CTA på mobil fungerer
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-046: Admin mail-innboks og trådvisning — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/mail/page.tsx` og `src/app/admin/mail/[threadId]/page.tsx`:

**Innboks:**
- Filter-tabs: Alle / Uleste — samme stil som inquiry-tabs
- Tråd-rad: panel-bakgrunn, rule border, emne Jost 500 `--paper`, deltakere Jost 12px `--body`, timestamp Jost 11px `--mast-left`
- Ulest-markering: tynn venstre-border `2px solid var(--accent)` på uleste tråder
- Ulest-count: badge med `--accent`-bakgrunn, `border-radius: 2px`
- Tom tilstand: `<EmptyState />`

**Trådvisning:**
- Innkommende melding: `var(--panel)` bakgrunn, `--rule`-border
- Utgående melding: `rgba(237,233,230,0.04)` bakgrunn, subtilt skilt
- Timestamp: Jost 11px `--mast-left`
- Svar-composer: `<FormField />` textarea
- Mal-velger: `<FormField />` select
- Send-knapp: `<Btn variant="action-primary" />`

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/mail/page.tsx`
- **Modifiser:** `src/app/admin/mail/[threadId]/page.tsx`

#### Akseptansekriterier
- [ ] Uleste tråder har venstre-border i `--accent`
- [ ] Meldinger skiller tydelig mellom innkommende og utgående
- [ ] Svar-composer bruker `<FormField />` textarea-stil
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-047: Admin maler — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/templates/page.tsx`:

- Mal-liste gruppert etter type: Eyebrow-overskrift per gruppe (IBM Plex Sans 8px `--index-num`)
- Mal-kort: panel + rule, tittel Jost 500 `--paper`, type-label Jost 9px uppercase `--mast-left`
- Rediger/slett-knapper: `<Btn variant="sm" />`
- Ny mal-form: `<FormField />` for tittel og textarea for innhold
- Type-select: `<FormField />` select med custom chevron

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/templates/page.tsx`

#### Akseptansekriterier
- [ ] Gruppe-headers bruker IBM Plex Sans 8px uppercase `--index-num`
- [ ] Form bruker `<FormField />` komponenter
- [ ] Mal-kort bruker panel + rule
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-048: Admin varsler — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020, TASK-UI-004

#### Hva skal gjøres
Redesign `src/app/admin/notifications/page.tsx`:

- Side-header: H1 Jost 500 `--paper` + "Merk alle som lest"-knapp `<Btn variant="sm" />`
- Varsel-rad:
  - Ulest-markering: `2px solid var(--accent)` venstre-border
  - Ikon (SVG, `opacity: 0.55`, `18×18px`): type-spesifikt (klokke, kuvert, kalender)
  - Tittel: Jost 500, `--paper` (ulest) / `--body` (lest)
  - Body: Jost 13px, `--body`
  - Timestamp: Jost 11px, `--mast-left`
  - `min-height: 64px`, `padding: 14px 16px`
- Tom tilstand: `<EmptyState />`

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/notifications/page.tsx`

#### Akseptansekriterier
- [ ] Uleste varsler har `--accent` venstre-border
- [ ] Leste/uleste er visuelt differensiert (ikke bare farge — også font-weight)
- [ ] Tom tilstand bruker `<EmptyState />`
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-049: Admin settings — redesign

**Status:** [ ]
**Avhenger av:** TASK-UI-020

#### Hva skal gjøres
Redesign `src/app/admin/settings/page.tsx`:

- Sidetittel: H1 Jost 500 `--paper`
- Seksjoner med Eyebrow-headers (IBM Plex Sans 8px `--index-num`)
- Panel-kort per seksjon: `var(--panel)` + `1px solid var(--rule)`
- Push-seksjon: `<PushSubscriptionManager />` visuelt integrert med panelstil
- Mail-seksjon: statustekst Jost `--body`, "Tving synkronisering"-knapp `<Btn variant="sm" />`
- Conta-seksjon: informasjonstekst Jost 13px `--body`
- `<Rule />` mellom seksjoner

#### Filer som påvirkes
- **Modifiser:** `src/app/admin/settings/page.tsx`

#### Akseptansekriterier
- [ ] Seksjons-headers bruker Eyebrow-komponenten
- [ ] Panel-kort bruker `var(--panel)` + `var(--rule)`
- [ ] `pnpm typecheck && pnpm build` passerer

---

## Fase 5 — Metadata, PWA og global polish

---

### TASK-UI-060: OG-metadata og Twitter Card — alle public ruter

**Status:** [ ]
**Avhenger av:** TASK-UI-050

#### Hva skal gjøres
Sørg for at alle public ruter har korrekt `og:image` og Twitter Card (PRD_UI §5.4):

- Root `layout.tsx`: legg til `openGraph.images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]`
- Alle public sider (`/`, `/book`, `/faq`, `/booking-info`, `/aftercare`):
  - `twitter:card: 'summary_large_image'` — ikke `'summary'`
  - `twitter:image: 'https://trovumtattoo.no/og-image.jpg'`
  - `og:image` arves fra root metadata — verifiser at det ikke overstyres feil
- `theme-color` meta: `#0d0b09` (ikke `#0d0c0b`) — allerede i `viewport` eksport, verifiser verdien

#### Filer som påvirkes
- **Modifiser:** `src/app/layout.tsx` — legg til OG-image og Twitter-metadata
- **Modifiser:** `src/app/(public)/page.tsx` — verifiser at `og:type: 'website'` er satt
- **Modifiser:** `src/app/(public)/book/page.tsx` — legg til Twitter Card
- **Modifiser:** `src/app/(public)/faq/page.tsx` — legg til Twitter Card
- **Modifiser:** `src/app/(public)/booking-info/page.tsx` — legg til Twitter Card
- **Modifiser:** `src/app/(public)/aftercare/page.tsx` — legg til Twitter Card

#### Akseptansekriterier
- [ ] `og:image` er `/og-image.jpg` (1200×630) på alle public ruter — verifiser med `curl` på HTML
- [ ] `twitter:card` er `summary_large_image` (ikke `summary`)
- [ ] `theme-color` i `viewport`-eksporten er `#0d0b09`
- [ ] `og:type` er `website` på forsiden
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-061: Strukturert data og favicon

**Status:** [ ]
**Avhenger av:** TASK-UI-060

#### Hva skal gjøres
Oppdater JSON-LD på hjemmesiden og favicon (PRD_UI §13):

**JSON-LD** (`src/app/(public)/page.tsx`):
- Endre `@type` til `TattooParlor` (PRD_UI §13)
- Oppdater adresse til: `streetAddress: "Elias Smithsvei 27"`, `addressLocality: "Sandvika"`, `postalCode: "1337"`, `addressCountry: "NO"`
- Oppdater `description` til: `"Custom tatovering: dark art, blackwork, realism."`
- Legg til `sameAs`: `["https://www.instagram.com/trovumtattoo/", "https://www.tiktok.com/@ellenkristinetrovum"]`
- Legg til `priceRange: "Fra 1000 NOK"`

**Favicon** (`src/app/layout.tsx`):
- `icon: '/logo.png'` — sett korrekt `type: 'image/png'` (PRD_UI §13)
- Canonical URL-er: verifiser at alle public ruter har `alternates.canonical` satt til absolutt URL med `trovumtattoo.no`-domenet

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/page.tsx` — oppdater JSON-LD
- **Modifiser:** `src/app/layout.tsx` — verifiser favicon og canonical

#### Akseptansekriterier
- [ ] JSON-LD har `@type: "TattooParlor"`
- [ ] Adresse er `Elias Smithsvei 27, Sandvika, 1337, NO`
- [ ] `sameAs` inkluderer Instagram- og TikTok-URL-er
- [ ] `priceRange` er satt
- [ ] Favicon peker på `/logo.png`
- [ ] Alle 5 public ruter har korrekt `canonical`-URL
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-070: PWA manifest og offline-side

**Status:** [ ]
**Avhenger av:** TASK-UI-001

#### Hva skal gjøres
Oppdater PWA-konfigurasjon til PRD_UI §14-fasiten:

**`public/manifest.json`:**
- `theme_color: "#0d0b09"` (ikke `#0d0c0b`)
- `background_color: "#0d0b09"`
- `name: "Trovum Tattoo"`, `short_name: "Trovum"`
- `display: "standalone"`, `start_url: "/"`
- `icons`: legg til riktige størrelser — 192×192 og 512×512 (bruk `logo.png` med korrekt `sizes: "any"` hvis SVG-ikonene ikke er produksjonsklare)

**`public/offline.html`:**
- Mørk bakgrunn `#0d0b09`, `--paper`-tekstfarge
- EB Garamond italic overskrift: "Du er frakoblet"
- Jost brødtekst: "Sjekk internettforbindelsen og prøv igjen."
- Logo-bilde (inline eller relativ sti)
- Ingen avhengigheter til Next.js runtime

**iOS-metadata** (`src/app/layout.tsx`):
- `apple-mobile-web-app-status-bar-style: 'black-translucent'` — allerede satt, verifiser
- `apple-touch-icon` peker på riktig ikon

#### Filer som påvirkes
- **Modifiser:** `public/manifest.json`
- **Modifiser:** `public/offline.html`
- **Modifiser:** `src/app/layout.tsx` — verifiser iOS-metadata

#### Akseptansekriterier
- [ ] `manifest.json` har korrekt `theme_color: "#0d0b09"`
- [ ] `offline.html` har mørk bakgrunn og korrekte farger uten Next.js-avhengigheter
- [ ] Lighthouse PWA-audit viser ingen kritiske feil
- [ ] Appen kan installeres på iOS Safari (standalone-modus)
- [ ] `pnpm typecheck && pnpm build` passerer

---

### TASK-UI-071: Global animasjon og sluttpolish

**Status:** [ ]
**Avhenger av:** TASK-UI-050, TASK-UI-042, TASK-UI-070

#### Hva skal gjøres
Legg til PRD_UI §9 sine animasjoner på alle sider og gjennomfør en helhetlig visuell audit:

**Page fade-in (PRD_UI §9):**
- Legg til `animation: fade-in 0.4s ease-out both` på `<main>`-elementet i:
  - `src/app/(public)/layout.tsx`
  - `src/app/admin/layout.tsx`
- Animasjonsklassen bruker keyframes fra TASK-UI-001

**Hover-overganger:**
- Verifiser at alle `<Btn>`-varianter har `transition: background 0.25s, border-color 0.25s`
- Verifiser at `action`-varianter har `transform: translateY(-1px)` på hover og `transform: scale(0.985)` on active
- Verifiser at alle lenker har `transition: color 0.2s`

**Bildegalleri — portrait glow (valgfritt, PRD_UI §5.3):**
- Legg til radial gradient-glow bak portrettbildet på hjemmesiden og klientdetalj dersom estetikken tilsier det

**Global visuell audit — sjekkliste:**
- [ ] Ingen hardkodede hex-farger gjenstår i noen komponent (søk etter `#0d0c0b`, `#c9933a`, `#c9b99a`, `#7a6e62`, `#1c1916`, `#141210`, `#2a2724` i kodebasen)
- [ ] Ingen `border-radius` på kort, knapper eller inputfelter (søk etter `rounded-` i TSX-filer, bortsett fra portrettbilder)
- [ ] Ingen Tailwind-klasser som introduserer farge utenfor token-systemet
- [ ] Ingen `font-family` hardkodet i komponentkode — alle fonter via CSS-variabler
- [ ] Admin-sider: alle data-verdier bruker `--paper`, støttetekst `--body`, metadata `--mast-left`
- [ ] Alle tomme tilstander bruker `<EmptyState />` med EB Garamond italic tittel
- [ ] Alle loading-states bruker `<Skeleton />` — ingen "Laster…"-tekst
- [ ] Skjema-feilmeldinger er `#af8c87` (dempet rød-brun)

**Loading-skjeletter** — verifiser at eksisterende `loading.tsx`-filer bruker `<Skeleton />`-komponenten fra TASK-UI-004 (ikke blank side eller spinner).

#### Filer som påvirkes
- **Modifiser:** `src/app/(public)/layout.tsx` — page fade-in på `<main>`
- **Modifiser:** `src/app/admin/layout.tsx` — page fade-in på `<main>`
- **Modifiser:** Diverse `loading.tsx`-filer — bruk `<Skeleton />`
- **Søk og erstatt:** alle hardkodede fargeverdier i komponentkode

#### Akseptansekriterier
- [ ] Siden "fader inn" ved navigasjon (verifiser i browser ved å navigere mellom admin-sider)
- [ ] Ingen `#0d0c0b`, `#c9933a`, `#c9b99a`, `#7a6e62`, `#1c1916`, `#141210`, `#2a2724` i komponentkode (kun i CSS og design-tokens)
- [ ] Ingen `rounded-` Tailwind-klasser på interaktive elementer og kort (unntatt portrettbilder)
- [ ] Alle loading.tsx bruker Skeleton-komponenten
- [ ] Lighthouse performance score ≥ 80 på forsiden (mobil)
- [ ] `pnpm typecheck && pnpm build` passerer uten advarsleer

---

## Oppsummering

| ID | Tittel | Fase | Avhenger av |
|---|---|---|---|
| TASK-UI-001 | Design system — tokens, fontstack, globale stiler | 1 | — |
| TASK-UI-002 | Logo-komponent — bildefil erstatter tekst | 1 | 001 |
| TASK-UI-003 | Delte UI-komponenter — Btn, LinkI, Rule, Eyebrow | 1 | 001 |
| TASK-UI-004 | Skjemaelementer, tomme tilstander og Skeleton | 1 | 001, 003 |
| TASK-UI-010 | Public header — logo, nav, CTA | 2 | 002, 003 |
| TASK-UI-011 | Public footer | 2 | 002, 010 |
| TASK-UI-020 | Admin layout — nav, header, StatusBadge | 2 | 002, 003, 004 |
| TASK-UI-030 | Bookingskjema redesign | 3 | 004, 010 |
| TASK-UI-040 | Admin inquiry-liste redesign | 4 | 020, 004 |
| TASK-UI-041 | Admin inquiry detail redesign | 4 | 040 |
| TASK-UI-042 | Admin dashboard redesign | 4 | 020, 004 |
| TASK-UI-043 | Admin klientliste redesign | 4 | 020, 004 |
| TASK-UI-044 | Admin klient- og prosjektdetalj redesign | 4 | 043 |
| TASK-UI-045 | Admin kalender redesign | 4 | 020, 004 |
| TASK-UI-046 | Admin mail redesign | 4 | 020, 004 |
| TASK-UI-047 | Admin maler redesign | 4 | 020, 004 |
| TASK-UI-048 | Admin varsler redesign | 4 | 020, 004 |
| TASK-UI-049 | Admin settings redesign | 4 | 020 |
| TASK-UI-050 | Public hjemmeside redesign | 3 | 010, 011, 003 |
| TASK-UI-051 | FAQ-side redesign | 3 | 050 |
| TASK-UI-052 | Booking-info-side redesign | 3 | 050 |
| TASK-UI-053 | Aftercare-side redesign | 3 | 050 |
| TASK-UI-060 | OG-metadata og Twitter Card | 5 | 050 |
| TASK-UI-061 | Strukturert data og favicon | 5 | 060 |
| TASK-UI-070 | PWA manifest og offline-side | 5 | 001 |
| TASK-UI-071 | Global animasjon og sluttpolish | 5 | 050, 042, 070 |

**Kritisk vei:** TASK-UI-001 → TASK-UI-003 → TASK-UI-004 → TASK-UI-020 → (admin-sider parallelt) → TASK-UI-071

**Parallelliseringsmuligheter etter Fase 1:**
- TASK-UI-002 og TASK-UI-003 kan gjøres parallelt
- TASK-UI-010 og TASK-UI-020 kan gjøres parallelt etter Fase 1
- Alle admin-sider (TASK-UI-040–049) kan gjøres parallelt etter TASK-UI-020
- Alle public innholdssider (TASK-UI-051–053) kan gjøres parallelt etter TASK-UI-050
