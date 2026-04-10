# Task: homepage-css-regression

## Bakgrunn

Forsiden fikk bred CSS-regresjon etter public/home-refaktoren. Symptomer som ble bekreftet i browser:

- hero mistet fullhøydekomposisjon på mobil
- `hidden sm:inline-flex` på header-CTA vant ikke over `inline-flex` i `Btn`
- all `px-*`/`py-*`-spacing falt tilbake til `0px` i runtime
- body falt tilbake til systemfont i stedet for Jost

## Gjennomforte steg

- Repro i Playwright på desktop og mobil.
- Sammenlignet nåværende public/home-sti med `6c0a3c1`, `c8041e7` og `a0c668a`.
- Kartla `design/`-sporet og bekreftet at det ikke injiserer globale CSS-regler.
- Sporingsmålte CSS-cascade i browser og bekreftet at utility-regler som `.px-5` og `px-pad` eksisterte, men tapte mot en u-layered global reset.
- Flyttet `html`, `body`, `a`, `:focus-visible` og universal-reseten i `globals.css` inn i `@layer base`, slik at Tailwind v4-utilities igjen kan overstyre base-laget.
- Gjeninnførte tidligere fungerende homepage-komposisjon i de splittede home-komponentene og gjenopprettet `px-pad`.
- Fikset `Btn` til å bruke `cn(...)`/`twMerge`.
- Fjernet den midlertidige `layout.tsx`-workarounden som injiserte rå designvariabler på `body`.
- Fikset service worker-oppsettet slik at `localhost`/dev ikke registrerer eller beholder SW-cacher som kan fryse gamle `/_next/static/*`-bundles.

## Viktig beslutning

Rotårsaken var ikke `design/` eller manglende Tailwind-emittering. Den faktiske CSS-feilen var at den manuelle reseten i `globals.css` lå utenfor Tailwind-lagene, og dermed outranket spacing-utilities i Tailwind v4. I tillegg gjorde service worker-logikken på `localhost` feilen ekstra vanskelig å debugge fordi gamle dev-bundles ble cachet cache-first og kunne gi samme gamle failstate etter reload.

## Verifisering

- `pnpm typecheck`
- `pnpm build`
- Playwright browser-pass på `/`:
  - mobil 390x844: 20px sidepadding, fullhøyde hero, skjult header-CTA, Jost-font
  - desktop 1200x900: 48px sidepadding, gradientbakgrunn, synlig header-CTA
- Playwright browser-pass på `http://localhost:3020/` etter produksjonsbygg:
  - desktop 1280px: 48px sidepadding og korrekt hero-høyde
- `just verify`
