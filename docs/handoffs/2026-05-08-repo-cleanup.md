# Handoff 2026-05-08 Repo Cleanup

## Status

- Repoet er ryddet production-first.
- Den gamle public design-previewflaten er fjernet.
- Gjeldende forsidekode er `src/components/public/home/Layout11Home.tsx`.
- Den gamle public previewruten skal ikke reintroduseres som produksjonsrute.
- Public homepage bruker `Layout11Home` via `src/app/(public)/page.tsx`.
- Public undersider beholder `PublicChrome` med header/footer.

## Hva som ble fjernet

- Ignorerte lokale artefakter: Playwright/test-resultater, `.next`, `tsconfig.tsbuildinfo`, `.DS_Store`.
- Gammel public previewrute.
- Gamle layoutprototyper.
- Gamle home-komponenter som var erstattet av `Layout11Home`.
- Ubrukte public assets fra gamle prototyper og Next starterfiler.
- Scaffold-validatoren `example.ts` og tilhørende test.
- Ubrukte dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `zustand`, `concurrently`, `@testing-library/dom`, `@testing-library/react`, `@types/react-dom`.
- Stale April-/early-May handoffs, review-notater og fullførte task-lister som kun beskrev tidligere cleanup/audit/prototypehistorikk.
- Stale root task ledgers `TASKS.md` og `TASKS_UI.md`.

## Hva som er beholdt

- Runtime appkode under `src/`.
- Convex backend og genererte Convex-bindings under `convex/`.
- PWA/offline/static runtimefiler som fortsatt brukes.
- `PRD.md`, `PRD_UI.md` og `PROSJEKTBESKRIVELSE.md` som produktkontekst.
- `README.md`, `AGENTS.md` og `docs/RULES.md` som operativ repo-kontekst.
- `docs/tasks/admin-ux-remediation.md`, fordi `ux-admin-07` fortsatt er åpen.
- `docs/tasks/repo-cleanup-2026-05-08.md`, som detaljlogg for cleanupen.

## Tidligere funn som fortsatt er relevante

- Tailwind v4 base-regler må ligge i riktig layer; ikke flytt global reset ut av `@layer base`.
- `Btn` skal fortsatt bruke `cn(...)`/`twMerge` slik at responsive utility-klasser kan overstyre baseklasser.
- Service worker skal ikke cache gamle dev-bundles på `localhost`.
- Admin e2e kan skippe dersom Clerk/Convex-testmiljøvariabler mangler.
- Mailbekreftelse for public inquiry er best-effort; inquiry skal fortsatt opprettes selv om SMTP/env mangler.
- Permanent sletting av mail/inquiries skal fortsatt behandles som en admin-operasjon med tydelige guards.

## Verifikasjon i cleanup-runden

- `pnpm typecheck` passerte etter design-preview-fjerning.
- `pnpm build` passerte etter design-preview-fjerning.
- `pnpm typecheck` passerte etter asset/home-opprydding.
- `pnpm build` passerte etter asset/home-opprydding.
- `pnpm playwright test tests/e2e/home.spec.ts` passerte etter ny desktop/mobil image/overflow-dekning.
- `pnpm test:run` passerte etter ny inquiry-validator-test.
- `pnpm typecheck` passerte etter ny inquiry-validator-test.
- `pnpm typecheck`, `pnpm test:run` og `pnpm build` passerte etter dependency cleanup.
- Final `pnpm typecheck` passerte.
- Final `pnpm lint` passerte med eksisterende Convex generated-file warnings.
- Final `pnpm test:run` passerte.
- Final `pnpm build` passerte.
- Final `pnpm playwright test tests/e2e/home.spec.ts` passerte.
- Final `pnpm playwright test tests/e2e/admin.spec.ts` skip'et rent på Clerk/Convex-preconditions.
- Final `just verify` passerte.
- Browser smoke passerte for `/`, `/book`, `/kontakt`, `/faq`, `/aftercare`, `/admin` redirect til sign-in og `/api/health`.

## Neste anbefalte arbeid

1. Bruk `docs/tasks/pre-live-finalization-2026-05-10.md` som aktiv sjekkliste før prosjektet sluttføres eller pushes live på nytt.
2. Kjør full final verification før videre deploy: `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `pnpm build`, home e2e, admin e2e og `just verify`.
3. Dersom UX-opprydding fortsetter, start med `docs/tasks/admin-ux-remediation.md` og task `ux-admin-07`.
4. Ikke bruk gamle task-ledgers som statuskilde; de er fjernet fordi de beskrev implementeringshistorikk som allerede er committet.
