# PRD_UI — Trovum Tattoo OS v1
## Frontend Design System & UI Requirements

**Status:** Autoritativ kilde for alle frontend-avgjørelser
**Kilde:** Ekstrahert fra live linktree-side (`trovumtattoo/linktree.html` + CSS), PRD.md, og visuelle assets
**Bruk:** Denne filen skal leses av enhver LLM eller agent som jobber med frontend. Følg verdiene eksakt — ikke interpoler, ikke "synes" noe ser bedre ut.

### Kildekategorier
Dokumentet inneholder to typer informasjon — viktig å vite hva som er hva:
- **Ekstraherte verdier** (§1–10, §13–14, §18): Farger, fonts, komponentstiler, animasjoner, breakpoints og assets er hentet direkte fra live-sidens CSS og HTML. Disse er fasit.
- **Designretningslinjer** (§11, §12, §15, §16): Admin-adaptasjon, statusfarger, skjemaelementer, tomme tilstander og prioriteringsregler er tolkninger av PRD.md tilpasset palettens temperatur. Disse er designforslag og kan justeres.

### Implementeringsspråk: Tailwind CSS v4
Kodebasen bruker **Tailwind CSS v4** med `@theme inline`-blokken i `globals.css`. CSS-blokkene i dette dokumentet er **referanseverdier**, ikke bokstavelig CSS som skal limes inn i komponentfiler. Implementer alltid med Tailwind utility-klasser i `className`. Se §2.1 for token-til-Tailwind-mapping.

---

## 1. IDENTITET OG TONE

Trovum Tattoo er én tatovør som jobber med dark art, blackwork, realism og custom design. Merkevaren er:

- **Utad:** premium, estetisk sterk, tillitsvekkende, enkel å forstå
- **Internt (admin):** rolig, funksjonell, handlingsorientert, lite "systemete"
- **Aldri:** corporate, lys, generisk, SaaS-aktig, klinisk

Public site skal føles som å bla i et high-end kunstmagasin. Admin skal føles som samme merkevare, men nedtonet og praktisk.

---

## 2. FARGEPALETT (DESIGN TOKENS)

Alle farger er definert som CSS custom properties. Bruk alltid token-navnene i kode — ikke hardkode hex-verdier direkte.

```css
:root {
  /* Bakgrunner */
  --bg:           #0d0b09;   /* Hoved-bakgrunn. Nær-svart, varm undertone */
  --panel:        #161412;   /* Løftet panelflate (cards, modals) */

  /* Tekst */
  --paper:        #ede9e6;   /* Primær tekst. Varm off-white */
  --body:         #b8b0a8;   /* Brødtekst. Varm mellomgrå */
  --nav:          #9a948e;   /* Sekundær tekst, nav-elementer */
  --mast-left:    #8a8078;   /* Tertiær tekst, metadata */
  --mast-right:   #7a7068;   /* Mørkere tertiær */
  --index-num:    #6a6058;   /* Etiketter, seksjonstall, eyebrows */
  --footer-label: #685850;   /* Footer-metadata */

  /* Aksent */
  --accent:       #a09488;   /* Varm taupe. Brukes på lenker, handle-tekst, aktive elementer */

  /* Skillelinjer (alltid rgba — aldri solid farge) */
  --rule:         rgba(237,233,230,0.065);  /* Standard border/divider */
  --rule-heavy:   rgba(237,233,230,0.08);   /* Tyngre aksent-border */
  --rule-light:   rgba(237,233,230,0.04);   /* Meget subtil, indre grid */
  --rule-inner:   rgba(237,233,230,0.07);   /* Indre seksjoner */

  /* Spacing */
  --pad: 20px;  /* mobil */
  /* --pad: 48px; på desktop ≥ 1024px */
}
```

### 2.1 Tailwind-mapping (`@theme inline`)

Tokens i `:root` gjøres tilgjengelige for Tailwind via `@theme inline`-blokken i `globals.css`. Denne blokken erstatter den eksisterende fullstendig:

```css
@theme inline {
  /* Farger → bg-*, text-*, border-* */
  --color-bg: var(--bg);
  --color-panel: var(--panel);
  --color-paper: var(--paper);
  --color-body: var(--body);
  --color-nav: var(--nav);
  --color-mast-left: var(--mast-left);
  --color-mast-right: var(--mast-right);
  --color-index-num: var(--index-num);
  --color-footer-label: var(--footer-label);
  --color-accent: var(--accent);
  --color-rule: var(--rule);
  --color-rule-heavy: var(--rule-heavy);
  --color-rule-light: var(--rule-light);
  --color-rule-inner: var(--rule-inner);

  /* Statusfarger */
  --color-status-new: var(--status-new);
  --color-status-new-text: var(--status-new-text);
  --color-status-info: var(--status-info);
  --color-status-info-text: var(--status-info-text);
  --color-status-offer: var(--status-offer);
  --color-status-offer-text: var(--status-offer-text);
  --color-status-deposit: var(--status-deposit);
  --color-status-deposit-text: var(--status-deposit-text);
  --color-status-booked: var(--status-booked);
  --color-status-booked-text: var(--status-booked-text);
  --color-status-done: var(--status-done);
  --color-status-done-text: var(--status-done-text);
  --color-status-rejected: var(--status-rejected);
  --color-status-rejected-text: var(--status-rejected-text);

  /* Fonter → font-sans, font-serif, font-mono */
  --font-sans: var(--font-jost);
  --font-serif: var(--font-garamond);
  --font-mono: var(--font-plex);

  /* Spacing */
  --spacing-pad: var(--pad);
}
```

**Resulterende Tailwind-klasser:**

| CSS-verdi | Tailwind-klasse |
|---|---|
| `background: var(--bg)` | `bg-bg` |
| `color: var(--paper)` | `text-paper` |
| `border-color: var(--rule)` | `border-rule` |
| `color: var(--accent)` | `text-accent` |
| `background: var(--panel)` | `bg-panel` |
| `color: var(--status-booked-text)` | `text-status-booked-text` |
| `background: var(--status-booked)` | `bg-status-booked` |
| `font-family: Jost` | `font-sans` |
| `font-family: EB Garamond` | `font-serif italic` |
| `font-family: IBM Plex Sans` | `font-mono` |
| `padding: var(--pad)` | `px-pad` / `py-pad` |

**For verdier uten token** (f.eks. spesifikke opaciteter, arbitrære størrelser):
Bruk Tailwinds bracket-notasjon: `text-[44px]`, `leading-[0.92]`, `tracking-[-0.025em]`, `border-[rgba(237,233,230,0.22)]`.

**Aldri skriv rå CSS-klasser** (`.btn`, `.input` etc.) i separate stylesheets. All styling skjer via `className` med Tailwind utilities. CSS-blokkene i dette dokumentet er referanseverdier for *hva* verdiene skal være, ikke *hvordan* de implementeres.

### Fargebruk — regler
- Hvit (`#ffffff`) brukes **aldri** som bakgrunn eller tekst
- Ingen mettede farger. Alt er dempet og varmt
- Aksent `--accent` er varm taupe — ikke en kontrasterande highlightfarge
- Skillelinjer skal alltid være subtile rgba-verdier, aldri harde linjer
- Sekundær tekst er `--nav`, enda svakere er `--mast-left`, laveste nivå er `--index-num`

---

## 3. TYPOGRAFI

### 3.1 Font stack (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Sans:wght@400;500&family=Jost:wght@400;500&display=swap" rel="stylesheet">
```

| Font | Rolle | Bruk |
|---|---|---|
| **EB Garamond** (serif, italic) | Merkevare og editorial identitet | Headings, hero, artistnavn, pull-sitater, italic lenker, logo-erstatning |
| **IBM Plex Sans** (sans-serif, brukt som etikett-font) | Metadata og etiketter | Eyebrows, seksjonstall, labels — alltid tiny og uppercase. Fallback: `monospace` |
| **Jost** | UI sans-serif | Brødtekst, knapper, nav, all funksjonell tekst |

**Regel:** EB Garamond brukes **alltid italic** i eksisterende design. Roman-vekter er lastet inn og tilgjengelige, men bruk italic som default med mindre det finnes en god grunn til roman.

### 3.2 Globale tekst-regler

```css
html { scroll-behavior: smooth; }
body {
  -webkit-font-smoothing: antialiased;  /* Kritisk — uten denne ser lys tekst på mørk bg fet og uskarp ut */
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { color: inherit; }
```

### 3.3 Typografisk skala

#### Display — Hero H1
```css
font-family: 'EB Garamond', serif;
font-style: italic;
font-weight: 400;
font-size: 44px;           /* mobil */
font-size: clamp(48px, 7vw, 72px);  /* desktop */
line-height: 0.92;
letter-spacing: -0.025em;
color: var(--paper);
```

#### Heading H2 (seksjoner)
```css
font-family: 'EB Garamond', serif;
font-style: italic;
font-weight: 400;
font-size: 22px–30px;      /* mobil, kontekstavhengig */
font-size: clamp(22px, 3vw, 30px);  /* desktop standard */
font-size: clamp(32px, 5vw, 48px);  /* desktop stor (hero/contact) */
letter-spacing: -0.02em;
line-height: 1.1;
color: var(--paper);
```

Dempet em i heading: `color: rgba(237,233,230,0.42)` — brukes på kontrasterende ord i tittelen.

#### Heading H3 (card-titler)
```css
font-family: 'EB Garamond', serif;
font-style: italic;
font-weight: 400;
font-size: 15px;           /* mobil */
font-size: 17px;           /* desktop */
letter-spacing: -0.01em;
color: var(--paper);
```

#### Artistnavn
```css
font-family: 'EB Garamond', serif;
font-style: italic;
font-size: 16px;           /* mobil */
font-size: 18px;           /* desktop */
color: var(--paper);
```

#### Pull-sitat / ingress
```css
font-family: 'EB Garamond', serif;
font-style: italic;
font-size: 17px;
line-height: 1.4;
color: rgba(237,233,230,0.60);
max-width: 28ch;
```

#### Brødtekst
```css
font-family: 'Jost', sans-serif;
font-weight: 400;
font-size: 13px;           /* mobil */
font-size: 14px;           /* desktop */
line-height: 1.8;
color: var(--body);
max-width: 48ch;           /* aldri bredere enn dette */
```

#### Seksjonsetikett / Eyebrow
```css
font-family: 'IBM Plex Sans', monospace; /* IBM Plex Sans er sans-serif; monospace er fallback */
font-size: 8px;            /* 7px–8.5px avhengig av kontekst */
letter-spacing: 0.24em;    /* 0.16em–0.28em */
text-transform: uppercase;
color: var(--index-num);
```

Med dekorativ strek:
```css
.eyebrow::before {
  content: '';
  width: 16px;
  height: 1px;
  background: var(--index-num);
}
```

#### Navigasjonslenker
```css
font-family: 'Jost', sans-serif;
font-size: 7.5px;          /* mobil */
font-size: 9.5px;          /* desktop */
letter-spacing: 0.08em;    /* mobil */
letter-spacing: 0.12em;    /* desktop */
text-transform: uppercase;
color: var(--nav);
```

#### Knapper
```css
font-family: 'Jost', sans-serif;
font-size: 9.5px;
letter-spacing: 0.16em;
text-transform: uppercase;
```

---

## 4. LOGO OG BRAND MARK

### 4.1 Logo-asset
- **Fil:** `/public/logo.png` — svart blackletter-wordmark med flaggermus-silhuetter
- **Navn:** "Trovum Tattoo" i gothic/blackletter-stil — dette er en image-asset, ikke reproduserbar i CSS-type
- **Webp-versjon:** `/public/logo.webp`

### 4.2 Logo-behandling på mørk bakgrunn
```css
filter: invert(93%) sepia(5%) saturate(200%) hue-rotate(340deg) brightness(95%);
```
Dette gir logoens sorte linjer en varm hvit farge som matcher `--paper`.

### 4.3 Logo-plassering
| Kontekst | Størrelse | Opacity |
|---|---|---|
| Navigasjon (mobil) | height: 32px | 0.92 |
| Navigasjon (desktop) | height: 36px | 0.92 |
| Footer | height: 36px | 0.35 |
| Hero watermark | width: 300px (mobil) / clamp(360px, 44vw, 560px) (desktop) | 0.07 |

Logo i nav: `transform: translateX(-10px)` — visuell justering mot venstre kant.

---

## 5. BILDER OG ASSETS

### 5.1 Tilgjengelige assets i `/public/`
| Fil | Bruk |
|---|---|
| `profilbilde.jpeg` | Portrettbilde av tatovøren. B&W, høy kontrast |
| `og-image.jpg` | OG/sosiale medier thumbnail. 1200×630px. Mørkt med logo og tattoo-artwork |
| `logo.png` | Blackletter wordmark, sort på transparent |
| `logo.webp` | Webp-versjon av logo |
| `artworks/Art1–7.png` | Portefølje-bilder. Brukes i galleri |

### 5.2 Bilde-behandling
Alle bilder på siden behandles med:
```css
filter: grayscale(20%) contrast(1.05);
```
Dette drar fargefoto mot B&W-estetikken uten å fjerne all farge.

### 5.3 Portrait-visning
```css
/* Firkantet (artikkel/admin) */
.portrait {
  width: 72px;
  height: 72px;
  overflow: hidden;
  border: 1px solid var(--rule-heavy);
}

/* Sirkulær (linktree/sosial profil) */
.portrait-round {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid rgba(237,233,230,0.13);
}
```

Portrait-glow (valgfritt, på profilvisninger):
```css
.portrait-wrap::after {
  content: '';
  position: absolute;
  inset: -24px;
  background: radial-gradient(circle, rgba(160,148,136,0.10), transparent 70%);
  pointer-events: none;
}
```

### 5.4 Sosiale medier / OG-metadata
```html
<!-- Open Graph -->
<meta property="og:title" content="Trovum Tattoo — Tatovør i Sandvika">
<meta property="og:description" content="Custom tatovering: dark art, blackwork, realism.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://trovumtattoo.no">
<meta property="og:image" content="https://trovumtattoo.no/og-image.jpg">

<!-- Twitter Card -->
<!-- Merk: live-siden bruker "summary" (kvadratisk). Vi bruker "summary_large_image" fordi OG-bildet er 1200×630 landskap. -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Trovum Tattoo — Tatovør i Sandvika">
<meta name="twitter:description" content="Custom tatovering: dark art, blackwork, realism.">
<meta name="twitter:image" content="https://trovumtattoo.no/og-image.jpg">

<!-- Theme color (nettleser-UI på mobil) -->
<meta name="theme-color" content="#0d0b09">
```

OG-bildet (`og-image.jpg`) er 1200×630px og viser mørk bakgrunn + tattoo-artwork flankerende sentrert logo. Brukes som default for alle public routes.

---

## 6. BAKGRUNNER OG OVERFLATER

### 6.1 Body-bakgrunn

**Mobil (default):**
```css
background: var(--bg); /* #0d0b09, flat */
```

**Desktop (≥1024px) — med subtil glow:**
```css
background:
  radial-gradient(circle at top, rgba(160,148,136,0.06), transparent 38%),
  linear-gradient(180deg, #13110f 0%, var(--bg) 100%);
```

**Linktree / sentrert enkeltside:**
```css
background:
  radial-gradient(ellipse at 50% 0%, rgba(160,148,136,0.07), transparent 60%),
  var(--bg);
```

### 6.2 Side-wrapper (desktop card)
```css
.page {
  background: linear-gradient(180deg, rgba(22,20,18,0.98), rgba(13,11,9,0.98));
  border: 1px solid rgba(237,233,230,0.08);
  box-shadow: 0 24px 80px rgba(0,0,0,0.45);
  width: min(1200px, 100%);
}
```

### 6.3 Panel / card-flate
```css
background: var(--panel); /* #161412 */
border: 1px solid var(--rule);
```

### 6.4 Highlighted info-celle
```css
background: linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02));
border-top: 1px solid rgba(237,233,230,0.1);
border-bottom: 1px solid rgba(237,233,230,0.1);
box-shadow: inset 0 1px 0 rgba(237,233,230,0.04);
```

---

## 7. KOMPONENTER

### 7.1 Knapp — Primær ghost (`.btn`)
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;          /* tilgjengelighet */
  padding: 12px 24px;
  background: transparent;
  border: 1px solid rgba(237,233,230,0.22);
  color: var(--paper);
  font-family: 'Jost', sans-serif;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s;
}

.btn:hover {
  background: rgba(237,233,230,0.04);
  border-color: rgba(237,233,230,0.38);
}
```

### 7.2 Knapp — Liten (`.btn-sm`)
```css
.btn-sm {
  min-height: 44px;
  padding: 10px 18px;
  border-color: rgba(237,233,230,0.12);
  color: var(--nav);
  font-size: 8.5px;
  letter-spacing: 0.14em;
}

.btn-sm:hover {
  color: var(--paper);
  border-color: rgba(237,233,230,0.22);
  background: rgba(237,233,230,0.03);
}
```

### 7.3 Italic lenke (`.link-i`)
```css
.link-i {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: 14px;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid rgba(160,148,136,0.28);
  transition: color 0.2s;
}

.link-i:hover { color: var(--paper); }
```

### 7.4 Store handlingsknapper (mobil-first, linktree-stil)
```css
.action-link {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 52px;
  padding: 14px 20px;
  background: transparent;
  border: 1px solid rgba(237,233,230,0.14);
  color: var(--paper);
  font-family: 'Jost', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.3s, border-color 0.3s, transform 0.2s;
}

/* Primær variant */
.action-link-primary {
  border-color: rgba(237,233,230,0.28);
  background: rgba(237,233,230,0.025);
}

/* CTA-variant (booking, viktige handlinger) */
.action-link-cta {
  border-color: rgba(237,233,230,0.32);
  background: rgba(237,233,230,0.06);
  box-shadow: 0 0 12px rgba(237,233,230,0.04), 0 0 2px rgba(237,233,230,0.06);
}

.action-link:hover {
  background: rgba(237,233,230,0.04);
  border-color: rgba(237,233,230,0.30);
  transform: translateY(-1px);
}

.action-link:active {
  transform: scale(0.985);
}
```

### 7.5 Skjemaelementer (input, textarea, select, filopplasting)

Bookingskjemaet (PRD §12) er en kjernefunksjon. Skjemaelementene skal følge samme visuelle språk som knapper: ghost-stil, subtile borders, varm tekst.

```css
/* Tekst-input og textarea */
.input {
  width: 100%;
  min-height: 44px;          /* tilgjengelighet */
  padding: 12px 16px;
  background: rgba(237,233,230,0.03);
  border: 1px solid rgba(237,233,230,0.14);
  color: var(--paper);
  font-family: 'Jost', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 0.2s, background 0.2s;
}

.input::placeholder {
  color: var(--mast-left);
  opacity: 1;
}

.input:focus {
  outline: none;
  border-color: rgba(237,233,230,0.35);
  background: rgba(237,233,230,0.05);
}

/* Textarea */
.textarea {
  min-height: 120px;
  resize: vertical;
}

/* Etikett over inputfelt */
.label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--nav);
  margin-bottom: 6px;
}

/* Valgfritt-markering */
.label-optional {
  color: var(--mast-left);
  font-style: italic;
  text-transform: none;
  letter-spacing: normal;
  font-family: 'EB Garamond', serif;
  font-size: 12px;
  margin-left: 6px;
}

/* Select */
.select {
  appearance: none;
  /* Samme styling som .input, pluss custom pil */
  background-image: url("data:image/svg+xml,..."); /* chevron-down i --nav farge */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Filopplasting */
.file-upload {
  min-height: 80px;
  border: 1px dashed rgba(237,233,230,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.file-upload:hover {
  border-color: rgba(237,233,230,0.30);
  background: rgba(237,233,230,0.03);
}

/* Radio og checkbox — custom styling */
/* Bruk custom visuell indikator (border-basert), ikke native browser-kontroller */
/* Checked state: border-color økes, bakgrunn gets en subtil fill */

/* Validering — feilstate */
.input-error {
  border-color: rgba(175,140,135,0.5);  /* Dempet rød-brun, ikke knallrød */
}

.error-message {
  font-family: 'Jost', sans-serif;
  font-size: 12px;
  color: #af8c87;            /* Dempet rød-brun */
  margin-top: 4px;
}

/* Validering — suksess (valgfritt, kun ved behov) */
.input-success {
  border-color: rgba(130,165,145,0.4);  /* Dempet grønn */
}
```

**Merk:** Disse er designforslag som følger palettens visuelle språk. De er ikke hentet fra live-siden (som ikke har skjema). Prinsippet er: samme ghost-stil, samme borders, samme temperaturer.

### 7.6 Focus-state (tilgjengelighet)
```css
:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 2px;
}
```

### 7.6 Seksjons-divider (`.rule`)
```css
.rule {
  width: 100%;
  height: 1px;
  background: var(--rule-inner);
  margin: 16px 0;
}
```

### 7.7 Footer-lenker
```css
.footer-link {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid rgba(160,148,136,0.18);
  transition: color 0.2s;
}
.footer-link:hover { color: var(--paper); }
```

---

## 8. LAYOUT

### 8.1 Spacing-system
- Base padding: `--pad` (20px mobil, 48px desktop)
- Ingen fancy spacing-skala. Bruker 4/8/10/12/14/16/20/24/28/32/40/48px
- Ingenting under 4px i margin/padding

### 8.2 Responsivt grid

**Mobil (default — full-bleed):**
```css
.page { width: 100%; }
```

**Linktree / enkeltside (max-width: 440px, sentrert):**
```css
.lt {
  width: 100%;
  max-width: 440px;
  padding: 0 24px;
}
```

**Desktop (≥1024px — contained card):**
```css
.page { width: min(1200px, 100%); }
body { display: flex; align-items: center; justify-content: center; padding: 32px; }
```

**Med sidebar-indeks (desktop layout):**
```css
.body-layout {
  display: grid;
  grid-template-columns: 150px 1fr;
}
```

**Stil-grid:**
- Mobil: 2 kolonner
- Desktop: 4 kolonner

**Info-ribbon:**
- Mobil: 1 kolonne, stacked
- Desktop: 3 kolonner side-ved-side

### 8.3 Breakpoints

**Generelt for appen:**

| Breakpoint | Endring |
|---|---|
| `1024px` | Desktop: sidebar-navigasjon, flerspaltet layout, større type, `--pad: 48px` |

Mobil er default. Desktop er én tilpasning ved 1024px.

**Kun linktree-layout (ikke generelt):**

| Breakpoint | Endring |
|---|---|
| `441px` | Side-borders synlige (linktree er max 440px bred) |
| `600px` | Card-stil med bakgrunn og skygge |

Disse er spesifikke for den smale linktree-kolonnen og gjelder ikke for hovedsiden eller admin.

---

## 9. ANIMASJON OG BEVEGELSE

```css
/* Side-innlasting */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page { animation: fade-in 0.4s ease-out both; }

/* Hover-overganger */
transition: color 0.2s;           /* tekst/lenker */
transition: background 0.25s, border-color 0.25s;  /* knapper */
transition: background 0.3s, border-color 0.3s, transform 0.2s;  /* store handlingsknapper */

/* Hover-løft */
transform: translateY(-1px);      /* på store knapper */

/* Active-press */
transform: scale(0.985);          /* på store knapper */
```

Ingen bounce, ingen spring, ingen tunge animasjoner. Alt er subtilt og rolig.

---

## 10. IKONER

Bruker inline SVG. Stil:
```
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="round"
stroke-linejoin="round"
fill="none"
```

Ikonstørrelse i handlingsknapper: `18×18px`, `opacity: 0.55` (standard) / `0.75` (primær).

---

## 11. ADMIN — DESIGNADAPTASJON

> **Merknad:** Denne seksjonen er retningslinjer tolket fra PRD.md §13, §25.4, §25.5 og §33. Det finnes ingen eksisterende admin-CSS å trekke verdier fra. Verdiene her er designprinsipper, ikke ekstraherte fakta.

Admin bruker **samme fargetokens og fonts**, men:

- Mer nedtonet — panel-bakgrunner (`--panel`) er dominant flate
- Mindre editorial Garamond, mer Jost som UI-font
- Høyere informasjonstetthet — kortere linjehopp, mer kompakte padding
- Store trykkflater: **alltid min-height: 44px** på interaktive elementer, **52px på mobile primærhandlinger**
- Bunnnavigasjon på mobil (ikke sidemeny)
- Sticky primærhandlinger der det gir mening
- Ingen grafer eller fancy dashboards — rene lister og kort

### Admin-farger — funksjonell bruk
Admin bruker de samme tokens, men mer funksjonelt:
- `--paper` kun for viktige data-verdier (navn, status)
- `--body` for støttetekst og etiketter
- `--nav` og `--mast-left` for sekundær info
- `--accent` for aktive states, lenker til handlinger

### Admin-statusfarger
PRD §14.1 definerer statusmodellen (Ny, Trenger mer info, Tilbud sendt, Venter på depositum, Booket, Fullført, Avslått). Disse trenger visuell differensiering. Fargene skal være dempede og varme — samme temperatur som resten av paletten. Aldri mettede.

```css
:root {
  /* Statusfarger — dempede, varme varianter */
  --status-new:       rgba(200, 185, 160, 0.15);  /* Varm sand — ny, ubehandlet */
  --status-new-text:  #c8b9a0;

  --status-info:      rgba(170, 165, 190, 0.12);  /* Dempet lavendel — trenger mer info */
  --status-info-text: #aaa5be;

  --status-offer:     rgba(180, 170, 140, 0.12);  /* Varm gyllen — tilbud sendt */
  --status-offer-text:#b4aa8c;

  --status-deposit:   rgba(190, 165, 130, 0.14);  /* Varm amber — venter på depositum */
  --status-deposit-text: #bea582;

  --status-booked:    rgba(140, 175, 155, 0.12);  /* Dempet salvie — booket */
  --status-booked-text: #8caf9b;

  --status-done:      rgba(130, 165, 145, 0.14);  /* Dempet grønn — fullført */
  --status-done-text: #82a591;

  --status-rejected:  rgba(175, 140, 135, 0.12);  /* Dempet rosa-brun — avslått */
  --status-rejected-text: #af8c87;
}
```

Brukes som badge-bakgrunn + tekst. Eksempel:
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-family: 'Jost', sans-serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;  /* Eneste sted med border-radius i admin utover portretter */
}

/* Eksempel: Booket */
.status-booked {
  background: var(--status-booked);
  color: var(--status-booked-text);
}
```

**Merk:** Disse statusfargene er designforslag basert på palettens temperatur. De er ikke hentet fra live-siden (som ikke har admin). Juster ved behov, men hold dem dempede og varme.

---

## 12. TILGJENGELIGHET (MINIMUMSKRAV)

### Kontrast — realitetssjekk
Designet prioriterer estetikk i sekundærtekst. Ikke alle tokens passerer WCAG AA:

| Token | Kontrast mot `--bg` | Status |
|---|---|---|
| `--paper` (#ede9e6) | ~15.6:1 | AA OK |
| `--body` (#b8b0a8) | ~4:1 | Grenseland — OK for stor tekst, feiler normal |
| `--nav` (#9a948e) | ~2.9:1 | Feiler AA |
| `--accent` (#a09488) | ~3.1:1 | Feiler normal tekst, OK stor tekst (3:1) |
| `--mast-left` (#8a8078) | ~2.5:1 | Feiler |
| `--index-num` (#6a6058) | ~2:1 | Feiler klart |

**Regel for public site:** Lav kontrast på dekorativ/atmosfærisk tekst (eyebrows, indeks-tall, metadata) er en bevisst del av den editoriale estetikken. Ikke endre disse verdiene for å "fikse" kontrasten — det ødelegger designet.

**Regel for admin:** Informasjon brukeren *trenger* å lese (kundenavn, status, handlinger) skal alltid bruke `--paper` eller `--body`. Aldri bruk `--mast-left`, `--index-num` eller svakere tokens for funksjonell tekst i admin. Dekorativ admin-tekst (tidsstempler, meta) kan bruke svakere tokens.

### Andre tilgjengelighetskrav
- **Trykkflater:** Alle interaktive elementer: minimum `44px` høyde/bredde
- **Focus-state:** Alltid synlig via `outline: 1px solid var(--accent); outline-offset: 2px`
- **Feilmeldinger:** Forståelig tekst, ikke bare fargeendring
- **Skjema:** Brukbart uten mus — mobile-native inputs

---

## 13. SEO — TEKNISKE KRAV

```html
<!-- Per side -->
<title>Trovum Tattoo — [Sidenavn] | Tatovør i Sandvika</title>
<meta name="description" content="[Unik beskrivelse per side, maks 155 tegn]">
<link rel="canonical" href="https://trovumtattoo.no[/path]">

<!-- Favicon -->
<link rel="icon" href="/logo.png" type="image/png">

<!-- Strukturert data (homepage) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "Trovum Tattoo",
  "description": "Custom tatovering i Sandvika. Dark art, blackwork, dark fantasy, black and grey, realisme og semi-realism.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Elias Smithsvei 27",
    "addressLocality": "Sandvika",
    "postalCode": "1337",
    "addressCountry": "NO"
  },
  "url": "https://trovumtattoo.no",
  "sameAs": [
    "https://www.instagram.com/trovumtattoo/",
    "https://www.tiktok.com/@ellenkristinetrovum"
  ],
  "priceRange": "Fra 1000 NOK"
}
</script>
```

---

## 14. PWA — MANIFEST OG SHELL

```json
{
  "name": "Trovum Tattoo",
  "short_name": "Trovum",
  "theme_color": "#0d0b09",
  "background_color": "#0d0b09",
  "display": "standalone",
  "icons": [{ "src": "/logo.png", "sizes": "any", "type": "image/png" }]
}
```

App-shell caches. Offline-tilstand viser forklarende melding, ikke tom skjerm.

---

## 15. TOMME TILSTANDER OG FEILSTATER

PRD §28 krever at tomme tilstander er "pene og forklarende". Retningslinjer:

### Tomme lister (ingen inquiries, ingen bookinger etc.)
- Sentrert innhold, vertikal midtstilling
- Ikon (inline SVG, `opacity: 0.25`, `48×48px`) over tekst
- Overskrift i EB Garamond italic, `--nav`-farge, 18px
- Forklarende undertekst i Jost, `--mast-left`, 13px, max-width 32ch
- Valgfri handlingsknapp under (`.btn-sm`)
- Ingen illustrasjoner eller grafikk — hold det enkelt og tekstbasert

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  opacity: 0.25;
  color: var(--nav);
  margin-bottom: 16px;
}

.empty-state-title {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--nav);
  margin-bottom: 6px;
}

.empty-state-text {
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  color: var(--mast-left);
  max-width: 32ch;
  line-height: 1.6;
  margin-bottom: 16px;
}
```

### Feilstater (nettverksfeil, synkfeil etc.)
- Samme layout som tom tilstand
- Feilikon i dempet rød-brun (`#af8c87`, `opacity: 0.35`)
- Kort, forståelig feilmelding — aldri teknisk stacktrace
- Prøv igjen-knapp med `.btn-sm`

### Lastetilstand
- Ingen spinner-animasjoner i merkevarefarger
- Bruk subtile skeleton-screens i `rgba(237,233,230,0.04)` med en rolig pulse-animasjon
- Eller enkle laster-indikatorer med lav opacity

---

## 16. DESIGNVALG-HIERARKI (PRIORITERINGSREGLER)

Når du er i tvil mellom to valg:

| Situasjon | Velg |
|---|---|
| Flere features vs bedre mobilflyt | Bedre mobilflyt |
| Fleksibilitet vs enkelhet | Enkelhet |
| Fancy UI vs tydelig neste handling | Tydelig neste handling |
| Ny farge vs etablert token | Etablert token |
| Ny font vs de tre definerte | De tre definerte |
| Lys bakgrunn vs mørk | Mørk |
| Mye tekst vs lite tekst | Lite tekst |

---

## 17. HVA SOM ALDRI SKAL GJØRES

- Ikke introduser nye bakgrunnsfarger utenfor token-systemet
- Ikke bruk hvit (`#fff`) eller lys bakgrunn noe sted
- Ikke bruk mettede farger (rød, grønn, blå) som aksenter
- Ikke bytt font uten eksplisitt godkjenning
- Ikke reproduser logoens blackletter-stil i CSS-type — bruk alltid image-asset
- Ikke legg til grafer, charts eller datavisualisering i admin uten eksplisitt oppgave
- Ikke bruk border-radius på UI-komponenter (kort, knapper, inputfelter) — designet er kantete og editorial. Unntak: portrettbilder kan være sirkulære (`border-radius: 50%`)
- Ikke bruk box-shadow til dekorasjon — kun til card elevation (mørk, diffus)
- Ikke bruk animasjoner over 0.4s varighet
- Ikke bygg noe som krever desktop for å fungere

---

## 18. ASSET-OVERSIKT (PRODUKSJONSKLARE FILER)

Alle filer ligger i `/public/`:

| Fil | Dimensjoner | Bruk |
|---|---|---|
| `profilbilde.jpeg` | ~600×600px, kvadratisk | Artistportrett på public site og admin |
| `og-image.jpg` | 1200×630px | Open Graph / sosiale medier, alle sider |
| `logo.png` | ~800px bred, transparent | Wordmark i nav og footer |
| `logo.webp` | Tilsvarende | Webp-versjon av logo |
| `artworks/Art1–7.png` | Varierende | Portefølje-galleri |
