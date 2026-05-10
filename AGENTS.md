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

### Current state og låst scope

`CURRENT_STATE.md` er styrende statuskilde for hva som er ferdig, låst og åpent.

- Les `CURRENT_STATE.md` før alle nye implementeringsøkter.
- Respekter låste backend/core-områder i `CURRENT_STATE.md`; ikke endre dem automatisk i UI/UX-arbeid.
- Hvis videre arbeid krever endring i låst backend/core, stopp og få eksplisitt brukerbeskjed før implementering.
- Når en UI/UX-del er ferdig gjennomgått og godkjent, oppdater `CURRENT_STATE.md` slik at den delen også låses.

### Spec-drevet utvikling

For oppgaver storre enn en liten patch:

1. Les `CURRENT_STATE.md` og relevant spec/task for det oppgaven handler om. Eksisterende produktkontekst ligger i `PRD.md`, `PRD_UI.md`, `PROSJEKTBESKRIVELSE.md` og aktive filer i `docs/tasks/`.
2. Bryt arbeid ned i smaa, testbare steg. Skriv dem i `docs/tasks/`.
3. Implementer ett steg om gangen. Kjor smalest nyttig verifikasjon etter hvert steg.
4. Naar du stopper: skriv handoff-fil i `docs/handoffs/` med hva som er gjort, hva som gjenstaar, og viktige beslutninger.

Foer live/deploy-arbeid eller prosjekt-sluttfoering skal `docs/tasks/pre-live-finalization-2026-05-10.md` leses foerst. Den er gjeldende statuskilde for live-blockere etter cleanupen.

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
- Ikke erstatt produksjonsforsiden med uferdig public UI.
- Public Instagram contact-lenker skal vurderes mot pre-live tasken; direct message URL er `https://www.instagram.com/m/trovumtattoo/`.
- Verifiser public UI med browser/Playwright paa baade mobil og desktop foer deploy.
- Public-flaten skal ikke vaere PWA. Ikke registrer service worker, ikke eksponer install-manifest, og ikke legg push-subscription UI paa public routes.

### Admin PWA / Push

- PWA-laget er kun for admin-flaten under `/admin`.
- Gammel/global PWA-funksjonalitet kan fjernes naar admin-only PWA bygges.
- Service worker-registrering skal skje fra admin-only client component, ikke global root layout.
- Manifest/scope/start_url skal peke mot `/admin` og ikke gjøre `/`, `/book`, `/kontakt` eller andre public routes installable.
- Push notifications skal aapne admin-ruter, med `/admin/notifications` som trygg default ved notification click.
- VAPID-konfig maa valideres eksplisitt for baade browser/public key og Convex/server send path.
- Hvis gammel root-scoped service worker kan henge igjen hos brukere, implementer eller dokumenter trygg cleanup/migrering.

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
