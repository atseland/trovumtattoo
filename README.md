# Trovum Tattoo OS v1

Next.js App Router-app for `trovumtattoo.no` med public bookingflyt, adminflate, Convex-backend, Clerk-auth, mail, varsler og PWA-stotte.

## Oppstart

```bash
cp .env.local.example .env.local
# fyll inn Clerk- og Convex-verdier i .env.local

npx convex dev
pnpm dev
```

Notater:

- `npx convex dev` maa kjoere under utvikling slik at lokale Convex-funksjoner pushes til dev deployment og `convex/_generated/*` holdes i sync.
- Appen kjoerer lokalt paa `http://localhost:3000`.
- Clerk maa ha en JWT-template med navnet `convex`, og `CLERK_JWT_ISSUER_DOMAIN` maa peke til samme Clerk-instans. Uten dette vil admin-sider med Convex-data ikke laste.
- Aktiv Clerk issuer i dette prosjektet er `https://united-piranha-14.clerk.accounts.dev`.
- Tilsvarende JWKS er `https://united-piranha-14.clerk.accounts.dev/.well-known/jwks.json`.
- Mail er laast til one.com-kontoen `kontakt@trovumtattoo.no` via server-side `MAIL_*`-variabler i Convex. Passord og endringer skal ikke lagres fra admin-UI.

## Verifikasjon

Smale kommandoer:

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm test:e2e
pnpm build
```

Full repo-verifikasjon:

```bash
just verify
```

Playwright-browser maa vaere installert foerste gang:

```bash
pnpm exec playwright install chromium
```

## Viktige kommandoer

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test:run
pnpm test:e2e
pnpm build
npx convex dev

just verify
just launch-check
just preview
just deploy-prod
```

## DevLogs

- Hver arbeidsokt skal loggfoeres til `/Users/33selale/Documents/Dev_Prosjekter/DevLogs/<framework>/<prosjekt>/...`.
- Start med `just session-start "<slug>"`.
- Logg underveis med `just session-implementation`, `just session-error`, `just session-feedback`, `just session-flow` og `just session-verify`.
- Avslutt med `just session-close "<kort oppsummering>"`.

## Struktur

```text
docs/specs/        # feature-specs og audit/spec-drevne arbeidsdokumenter
docs/tasks/        # review-notater og oppgavespor
docs/handoffs/     # handoff mellom sesjoner
docs/RULES.md      # prosjektregler for preview/deploy/launch
.agents/skills/    # repo-spesifikke Codex-skills
.vscode/mcp.json   # workspace MCP-konfig
scripts/devlog.sh  # session-logging til ekstern DevLogs-mappe
convex/            # backendfunksjoner og schema
src/               # Next.js-applikasjonen
tests/             # Playwright e2e
```

## AI tooling

- Playwright MCP er konfigurert i `.vscode/mcp.json` for klienter som stoetter workspace-MCP.
- Bruk MCP/Playwright CLI til UI-repro og frontend-feilsoeking, men behold repeterbar verifikasjon i committed tester.

Se [AGENTS.md](/Users/33selale/Documents/Dev_Prosjekter/trovumtattoo_v2/AGENTS.md) for arbeidsmaate og repo-regler.
