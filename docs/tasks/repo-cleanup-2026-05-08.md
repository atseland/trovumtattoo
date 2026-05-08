# Repo Cleanup 2026-05-08

## Scope

Production-first cleanup of the active Trovum Tattoo repo. The goal is to keep the current working frontend, backend, tests, deploy/runtime configuration, and minimal process documentation, while removing prototype surfaces, scaffold leftovers, unused assets, unused dependencies, and stale process history.

## Keep

- `src/app`, `src/components`, `src/lib`, and `convex` code used by the current app.
- Convex generated files under `convex/_generated`.
- Runtime/deploy config: `next.config.ts`, `src/proxy.ts`, Sentry files, `instrumentation*.ts`, `.sentryclirc`, `.vercel` local project state.
- PWA/static runtime assets: `public/sw.js`, `public/offline.html`, `public/manifest.json`, `public/icons/*`, `public/logo.*`, `public/og-image.jpg`.
- Current homepage assets: `public/Bilde2_less.png`, `public/profilbilde_v2.jpeg`, and current `public/portfolio/*.png`.
- Repo operation docs: `README.md`, `AGENTS.md`, `docs/RULES.md`, current cleanup task, and final cleanup handoff.
- Repo skills and MCP config: `.agents/skills/*`, `.vscode/mcp.json`.

## Remove Candidates

- Ignored local artifacts: `.playwright-cli/`, `playwright-report/`, `test-results/`, `.next/`, `tsconfig.tsbuildinfo`, `.DS_Store`.
- Old homepage design preview route and prototypes: `src/app/(public)/design/page.tsx`, `design/forsiden/`.
- Old modular homepage components superseded by `src/components/public/home/Layout11Home.tsx`.
- Unused public assets from Next starter files, old design prototypes, and obsolete profile/artwork variants.
- Scaffold validator example files.
- Dependencies confirmed unused by source search and verification.
- Stale handoffs/tasks whose durable content is folded into a cleanup handoff.

## Commands Run

- `git status --short`
- `just session-start "repo-cleanup"`
- `git status --short --ignored`
- `rg -n "design/forsiden|PreviewPage|Layout11Final|/design" src docs README.md AGENTS.md`
- `rg -n "HomeHero|HomeAbout|homeContent|/artworks|Bilde1_more|profilbilde_v3|next.svg|vercel.svg|window.svg|file.svg|globe.svg" src public docs`

## Verification Checklist

- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test:run`
- [ ] `pnpm build`
- [ ] `pnpm playwright test tests/e2e/home.spec.ts`
- [ ] `pnpm playwright test tests/e2e/admin.spec.ts`
- [ ] `just verify`
- [ ] Browser smoke for `/`, `/book`, `/kontakt`, `/faq`, `/aftercare`, `/admin`, `/api/health`.

## Final File Removals

- Removed ignored local artifacts: `.playwright-cli/`, `playwright-report/`, `test-results/`, `.next/`, `tsconfig.tsbuildinfo`, `public/.DS_Store`, `public/portfolio/.DS_Store`.
- Removed old design preview surface: `src/app/(public)/design/page.tsx`, `design/forsiden/`.
- Removed old home modules superseded by `Layout11Home`: `HomeAbout.tsx`, `HomeCta.tsx`, `HomeHero.tsx`, `HomePortfolio.tsx`, `HomeProcess.tsx`, `HomeStyles.tsx`, `homeContent.ts`.
- Removed unused static assets: `public/artworks/`, `public/Bilde1_more.png`, `public/profilbilde.jpeg`, `public/profilbilde_v3.png`, Next starter SVGs, `public/portfolio/.gitkeep`, `public/portfolio/image_descriptions.txt`.
