# release-readiness-audit

**Dato:** 2026-04-08
**Status:** audit-baseline etablert

## Maal

Gjennomfoere en full parity-audit av naa-vaerende working tree opp mot:

- faktisk runtime-adferd
- implementert kode i `src/` og `convex/`
- produktdokumentasjon i `PRD.md` og `PRD_UI.md`
- arbeidsdokumentasjon i `TASKS.md`, `TASKS_UI.md`, `README.md`, `docs/` og `PROSJEKTBESKRIVELSE.md`

Auditten skal gi et beslutningsklart bilde av:

- hvor langt produktet faktisk har kommet
- hvilke launch blockers som gjenstaar
- hvilke deler som er implementert, delvis implementert eller bare markert som ferdige i dokumentasjon
- hvilke dokumenter som er autoritative, stale eller derivert

## Kildehierarki

1. `PRD.md` er autoritativt for produktscope.
2. `PRD_UI.md` er autoritativt for visuell/designmessig fasit.
3. `TASKS.md` og `TASKS_UI.md` er historikk og deklarert ferdiggrad, ikke bevis paa runtime-parity alene.
4. `README.md`, `docs/RULES.md` og `AGENTS.md` er operative arbeids- og onboardingsdokumenter.
5. `PROSJEKTBESKRIVELSE.md` behandles som derivert dokument og maa synkes mot `PRD.md` eller arkiveres.

## Scope

- Working tree er in scope, ikke bare siste commit.
- Alle funn skal tagges som `HEAD`, `working-tree` eller `begge`.
- Auditfasen er read-mostly for produktkode. Bare auditdokumenter oppdateres i denne runden.
- Ingen schema-endringer eller brede refaktorer inngaar i auditfasen.

## Fase

- [x] Kjerne (maa fungere for launch)
- [x] Polish (UI-iterasjoner, edge cases)
- [x] Deploy/ops (env, domene, monitoring)

## Arbeidsform

1. Frys baseline med branch, HEAD, `git status --short --branch` og `git diff --stat`.
2. Kjor verifikasjonspakken og registrer faktiske resultater.
3. Reproduser runtime-funn med minst ett konkret bevis per kritisk avvik.
4. Sammenlign dokumentsettet mot faktisk kode og runtime.
5. Lever parity-matrise og prioritert remediation-backlog i review-notatet.

## Akseptansekriterier

- [x] Auditbaselinen er fryst med branch, HEAD og working-tree-status.
- [x] Verifikasjon er kjaert og dokumentert med utfall per kommando.
- [x] Hvert hovedomraade er klassifisert som `implemented`, `partial`, `missing`, `doc-stale` eller `unclear`.
- [x] Dokumentsettet er rangert som `autoritativt og korrekt`, `autoritativt men stale`, `derivert` eller `arkiveres/erstattes`.
- [x] Launch blockers og ikke-blokkerende gap er skilt eksplisitt.
- [x] Auditten kan brukes direkte som input til siste remediation-fase uten nye produktvalg.

## Verifisering

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
pnpm test:e2e
```

Supplerende runtime-pass:

```bash
pnpm dev
curl -I http://localhost:3000/admin
curl -I http://127.0.0.1:3000
playwright-cli open http://localhost:3000/book --headed
playwright-cli open http://localhost:3000/admin --headed
```
