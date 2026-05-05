# Task: public-home-layout11-port

## Bakgrunn

Forsiden paa `https://trovumtattoo.no` viser naa en midlertidig placeholder etter commit `a8cf5a9`. Dette er tilsiktet for aa unngaa at en uferdig eller feil frontend ligger live.

Den faktiske public-home-retningen som skal portes videre er `design/forsiden/Layout11Final.tsx`.

## Maal

Port Layout 11 til produksjonsklar public homepage uten aa gjeninnfoere tidligere CSS-/service-worker-regresjoner.

## Viktige kilder

- `design/forsiden/Layout11Final.tsx` er designreferansen.
- `src/app/(public)/page.tsx` er naa placeholderen paa `/`.
- `src/app/(public)/layout.tsx` og public header/footer maa vurderes mot Layout 11 slik at siden ikke faar dobbelt eller feil navigasjon.
- `src/components/ui/Btn.tsx` har tidligere hatt responsive class-merge-feil; behold `cn(...)`/merge-oppfoerselen.
- `src/app/globals.css` har tidligere hatt Tailwind v4 cascade-regresjon; globale reset-regler maa bli liggende i riktig layer.
- `src/components/ServiceWorkerRegistration.tsx` og `public/sw.js` skal ikke cache gamle dev-bundles paa `localhost`.

## Foreslaatt arbeidsflyt

1. Start med `git status --short` og `just session-start "public-home-layout11"`.
2. Les denne tasken, siste relevante handoff i `docs/handoffs/`, og `design/forsiden/Layout11Final.tsx`.
3. Port Layout 11 inn i appens public-home-struktur.
4. Avklar om public header/footer skal beholdes, tones ned, eller skjules paa forsiden.
5. Sjekk at bookingknapp peker til `/book`, og at eksisterende bookingflyt ikke berøres.
6. Verifiser lokalt paa mobil og desktop med browser/Playwright.
7. Kjor smal verifikasjon foerst, deretter `$repo-verify`/`just verify` foer deploy.
8. Deploy til production foerst naar public UI er visuelt godkjent eller eksplisitt avtalt.

## Akseptansekriterier

- `/` matcher Layout 11-retningen visuelt paa mobil og desktop.
- Ingen horizontal overflow, overlappende tekst, blanke bilder eller layout shift i hovedseksjonene.
- Header/footer oppleves tilsiktet sammen med Layout 11, ikke som rester fra feil frontend.
- `/book` er fortsatt tilgjengelig fra forsiden.
- Produksjonsdeploy er runtime-verifisert etter eventuell deploy.

