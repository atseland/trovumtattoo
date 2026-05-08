# AGENTS.md

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vitest + Playwright
- Zod + React Hook Form
- shadcn/ui + Sonner + next-themes
- Convex (reaktiv backend)
- Clerk (autentisering)

## Kommandoer

```bash
pnpm dev           # Start dev-server
pnpm typecheck      # TypeScript-sjekk
pnpm build          # Produksjonsbygg
pnpm lint           # Lint
pnpm test:run       # Vitest
pnpm test:e2e       # Playwright
npx convex dev      # Convex backend

# just-recipes
just verify         # Typesjekk + lint + test + bygg
just launch-check   # Verify + health + Sentry-sjekk
just preview        # Convex preview-deploy (branch-basert)
just deploy-prod    # Convex produksjons-deploy
```

## Arbeidsmaate

### Spec-drevet utvikling

For oppgaver storre enn en liten patch:

1. Les relevant spec/task for det oppgaven handler om. Eksisterende produktkontekst ligger i `PRD.md`, `PRD_UI.md`, `PROSJEKTBESKRIVELSE.md` og aktive filer i `docs/tasks/`.
2. Bryt arbeid ned i smaa, testbare steg. Skriv dem i `docs/tasks/`.
3. Implementer ett steg om gangen. Kjor smalest nyttig verifikasjon etter hvert steg.
4. Naar du stopper: skriv handoff-fil i `docs/handoffs/` med hva som er gjort, hva som gjenstaar, og viktige beslutninger.

### Session-logging

For hver arbeidsokt i prosjektet:

1. Start med `just session-start "<slug>"`.
2. Logg fortlopende med `just session-implementation`, `just session-error`, `just session-feedback`, `just session-flow` og `just session-verify`.
3. Avslutt med `just session-close "<kort oppsummering>"`.

Loggene skal skrives til `/Users/33selale/Documents/Dev_Prosjekter/DevLogs/<framework>/<prosjekt>/...`.
Dette er en hard regel. Ikke avslutt arbeidsokt eller oppgave uten at session-loggen er oppdatert.
`just verify`, `just handoff` og `just review` krever aktiv session-logg.

### Regler

- Jobb spec-drevet naar oppgaven er storre enn en liten patch.
- Bryt arbeid ned i smaa testbare steg.
- Oppdater tasks/handoff ved stoppunkt.
- Kjor smalest nyttige verifikasjon forst (typesjekk > lint > tester > bygg).
- Unngaa brede refaktorer uten eksplisitt grunn.
- Hold demo/bootstrap-filer isolert og lette aa slette.
- Ikke innfor ny kompleksitet uten klar gevinst.
- Ved UI-bugs: repro med Playwright MCP forst foer du prover bredere refaktorer eller gjetter om DOM-/browser-oppfoersel.
- Flagg antakelser i stedet for aa gjette.
- Foretrekk smaa, enkeltformaalsfunksjoner og komponenter.
- Haandter feil eksplisitt — ingen tomme catch-blokker.
- Bruk miljovariabler for hemmeligheter, aldri hardkodede verdier.

Se `docs/RULES.md` for prosjektregler om preview, deploy og launch.

### Public UI-arbeid

- Public-home er nå portet inn i appen som `src/components/public/home/Layout11Home.tsx`; den gamle previewflaten er ikke lenger del av repoet.
- Produksjon kan midlertidig vise placeholder paa `/`; ikke erstatt den med uferdig public UI.
- Naar `design/`-prototyper flyttes til ekte app, port dem inn i `src/app/(public)/` og/eller `src/components/public/` i stedet for aa la produksjonsruter importere direkte fra `design/`.
- Verifiser public UI med browser/Playwright paa baade mobil og desktop foer deploy.

## Repo-skills

- `$repo-verify` for endringssikker verifikasjon og avslutning.
- `$next-guardrails` ved arbeid i Next.js App Router-kode.

## MCP

- Playwright MCP er konfigurert i `.vscode/mcp.json`.
- Bruk den for UI-repro, navigasjon, DOM-inspeksjon og frontend-feilsoeking.
- Behold committed Playwright-tester som kilde til repeterbar verifikasjon; MCP-en er et arbeidsverktoy.

### Commits

- Format: `feat|fix|refactor|test|chore|docs(scope): kort beskrivelse`
- En oppgave = en commit.
- Aldri commit kode som feiler verifikasjon.

## Filstruktur

```
docs/
  tasks/      # Aktive oppgavespor og cleanup-logg
  handoffs/   # Gjeldende kontekstoverfoering mellom sesjoner
  RULES.md    # Prosjektregler (preview, deploy, launch)
.agents/skills/ # Repo-spesifikke Codex-skills
.vscode/       # Workspace MCP-konfig
src/          # Applikasjonskode
```

## Konteksthaandtering

- Ved lange sesjoner: bruk `/compact` foer det blir for sent.
- Ved stoppunkt: skriv handoff-fil.
- Les handoff-filer ved oppstart av ny sesjon.
- Ikke les hele oppgavelisten — les bare gjeldende oppgave.
