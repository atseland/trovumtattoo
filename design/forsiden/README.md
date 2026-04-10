# Forsiden — Layoutforslag

Fem ulike layouter for forsiden (landing page) til trovumtattoo.no.

Alle bruker det eksisterende designsystemet:
- Tailwind v4 med inline `@theme` tokens fra `globals.css`
- Fonter: EB Garamond (serif), Jost (sans), IBM Plex Sans (mono)
- Farger: `bg`, `panel`, `paper`, `body`, `nav`, `accent`, `index-num`, `rule`-varianter
- Eksisterende UI-komponenter (Btn, Eyebrow, Logo)

## Oversikt

| # | Fil | Konsept | Kjennetegn |
|---|-----|---------|------------|
| 1 | `Layout1Editorial.tsx` | **Editorial Vertical** | Magasinlayout. Store bilder med captions ved siden av. Vertikal rytme, generøs whitespace. Portefølje som redaksjonell bildeserie. |
| 2 | `Layout2GridMosaic.tsx` | **Portfolio-First Mosaic** | Porteføljen ER helten. Mosaikk-grid som fyller viewport. Tekst sekundær. Visuelt bevis først. |
| 3 | `Layout3SplitCinematic.tsx` | **Split Cinematic** | Todelt layout: sticky bildepanel til venstre, scrollende innhold til høyre. Filmisk og immersivt. |
| 4 | `Layout4TypographicMinimal.tsx` | **Typographic Minimal** | Typografidrevet hero uten bilder. Horisontal porteføljescroll. Galleriinvitasjon-estetikk. |
| 5 | `Layout5StackedImmersive.tsx` | **Stacked Full-Bleed** | Full-viewport seksjoner med scroll-snap. Hver seksjon er et eget rom. Bakgrunnsbilder med overlay. |

## Innholdsspec

Alle layouter følger den redaksjonelle beslutningen:
- Kort, porteføljedrevet og tydelig norsk
- Varm og rolig tone
- 5 seksjoner: Hero, Om + stil, Portefølje, Booking/kontakt, Footer
- CTA-er: "Se arbeider" og "Send melding" (primær), "Se mer på Instagram" og "Kontaktskjema" (sekundær)
- Portefølje: 5 kuraterte hovedarbeider med korte captions

## Bruk

Hver fil er en selvstendig Next.js-sidekomponent som kan droppes inn i `src/app/(public)/page.tsx` for preview.
Importerer eksisterende UI-komponenter fra `@/components/ui/` og `@/components/`.
