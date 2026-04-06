# tmpscaffold

## Foerste gang

```bash
cp .env.local.example .env.local
# Fyll inn Clerk-secrets i .env.local
npx convex dev
pnpm dev
```

## Test

```bash
pnpm test:run
```

## AI tooling

- Playwright MCP er konfigurert i `.vscode/mcp.json` for klienter som stoetter workspace-MCP.
- Bruk den til UI-feilsoeking og reproduksjon, men behold testkode i `tests/` som varig verifikasjon.

## DevLogs

- Hver arbeidsokt skal loggfoeres til `/Users/33selale/Documents/Dev_Prosjekter/DevLogs/<framework>/<prosjekt>/...`.
- Start med `just session-start "<slug>"`.
- Logg implementeringer, LLM-feil, kommentarer og workflow underveis.
- Avslutt med `just session-close "<kort oppsummering>"`.

## Struktur

```
docs/specs/      # Feature-spesifikasjoner
docs/tasks/      # Oppgavelister
docs/handoffs/   # Kontekstoverfoering
.agents/skills/  # Repo-spesifikke guardrails
.vscode/mcp.json # Workspace MCP-konfig
scripts/devlog.sh # Session-logging til ekstern DevLogs-mappe
src/             # Applikasjonskode
```

Se AGENTS.md for arbeidsmaate og regler.
