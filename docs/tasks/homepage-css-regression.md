# Task: homepage-css-regression

## Bakgrunn

Forsiden fikk bred CSS-regresjon etter public/home-refaktoren. Symptomer som ble bekreftet i browser:

- hero mistet fullhøydekomposisjon på mobil
- `hidden sm:inline-flex` på header-CTA vant ikke over `inline-flex` i `Btn`
- `px-pad` ga `0px` padding i runtime
- body falt tilbake til systemfont i stedet for Jost

## Gjennomforte steg

- Repro i Playwright på desktop og mobil.
- Sammenlignet nåværende public/home-sti med `6c0a3c1`, `c8041e7` og `a0c668a`.
- Gjeninnførte tidligere fungerende homepage-komposisjon i de splittede home-komponentene.
- Fikset `Btn` til å bruke `cn(...)`/`twMerge`.
- Gjenopprettet runtime-tilgang til rå designvariabler via `body`-style i `layout.tsx`.
- Byttet forsiden fra `px-pad` til eksplisitte `px-5 lg:px-12`.

## Viktig beslutning

`globals.css` beholdes PRD-nært, men Turbopack emitterte fortsatt ikke rå `:root`-variabler og `px-pad` i runtime. For å få stabil app-atferd nå ble rå `--*`-variabler injisert på `body`, siden resten av appen bruker mange `var(--panel)`, `var(--accent)` og `var(--status-*)`-referanser i inline styles.

## Verifisering

- `pnpm typecheck`
- Playwright browser-pass på `/`:
  - mobil 390x844: 20px sidepadding, fullhøyde hero, skjult header-CTA, Jost-font
  - desktop 1200x900: 48px sidepadding, gradientbakgrunn, synlig header-CTA
- `just verify`
