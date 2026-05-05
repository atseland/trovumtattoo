set shell := ["bash", "-euo", "pipefail", "-c"]

default:
    @just --list

# Start ny session-logg i DevLogs
session-start slug="work":
    @bash scripts/devlog.sh start "{{slug}}"

# Vis aktiv session-logg
session-show:
    @bash scripts/devlog.sh show

# Logg maal for aktiv session
session-goal text:
    @bash scripts/devlog.sh append goal "{{text}}"

# Logg implementering for aktiv session
session-implementation text:
    @bash scripts/devlog.sh append implementation "{{text}}"

# Logg LLM-feil for aktiv session
session-error text:
    @bash scripts/devlog.sh append error "{{text}}"

# Logg brukerkommentar for aktiv session
session-feedback text:
    @bash scripts/devlog.sh append feedback "{{text}}"

# Logg workflow-observasjon for aktiv session
session-flow text:
    @bash scripts/devlog.sh append flow "{{text}}"

# Logg verifikasjon for aktiv session
session-verify text:
    @bash scripts/devlog.sh append verify "{{text}}"

# Avslutt aktiv session-logg
session-close summary="Session avsluttet":
    @bash scripts/devlog.sh close "{{summary}}"

# Opprett ny feature-spec
spec-new slug:
    @bash -c 'file="docs/specs/{{slug}}.md"; if [ -f "$file" ]; then echo "Finnes: $file"; exit 1; fi; mkdir -p docs/specs; date=$(date +%Y-%m-%d); printf "# {{slug}}\n\n**Dato:** %s\n**Status:** draft\n\n## Maal\n\n_Hva skal oppnaas?_\n\n## Fase\n\n- [ ] Kjerne (maa fungere for launch)\n- [ ] Polish (UI-iterasjoner, edge cases)\n- [ ] Deploy/ops (env, domene, monitoring)\n\n## Akseptansekriterier\n\n- [ ] ...\n\n## Verifisering\n\n```bash\n# Kommandoer for verifisering\n```\n" "$date" > "$file"; echo "Opprettet: $file"'

# Kjor verifikasjon (lint, tester, bygg)
verify:
    @bash -euo pipefail -c 'bash scripts/devlog.sh show >/dev/null; run_script() { if [ -f pnpm-lock.yaml ]; then pnpm "$1"; else npm run "$1"; fi; }; echo "==> Typesjekk"; if grep -q "\"typecheck\"" package.json 2>/dev/null; then run_script typecheck; elif grep -q "\"check\"" package.json 2>/dev/null; then run_script check; else echo "Ingen typesjekk-script funnet, hopper over."; fi; if grep -q "\"lint\"" package.json 2>/dev/null; then echo "==> Lint"; run_script lint; fi; echo "==> Tester"; if grep -q "\"test:run\"" package.json 2>/dev/null; then run_script test:run; else run_script test; fi; if grep -q "\"build\"" package.json 2>/dev/null; then echo "==> Bygg"; run_script build; fi; bash scripts/devlog.sh append verify "Verifikasjon besto"; echo "Verifikasjon ferdig."'

# Skriv handoff for kontekstoverfoering
handoff:
    @bash -euo pipefail -c 'bash scripts/devlog.sh show >/dev/null; mkdir -p docs/handoffs; date=$(date +%Y-%m-%d); ts=$(date +%H%M); file="docs/handoffs/${date}-${ts}.md"; printf "# Handoff %s\n\n## Fullfort\n\n-\n\n## Neste sesjon\n\n-\n\n## Beslutninger\n\n-\n" "$date" > "$file"; bash scripts/devlog.sh append flow "Opprettet handoff: $file"; echo "Opprettet: $file"'

# Opprett review-notat
review slug:
    @bash -euo pipefail -c 'bash scripts/devlog.sh show >/dev/null; mkdir -p docs/tasks; file="docs/tasks/review-{{slug}}.md"; date=$(date +%Y-%m-%d); printf "# Review: {{slug}}\n\n**Dato:** %s\n\n## Endrede filer\n\n-\n\n## Testet\n\n- [ ] Typesjekk\n- [ ] Tester\n- [ ] Manuell sjekk\n" "$date" > "$file"; bash scripts/devlog.sh append flow "Opprettet review-notat: $file"; echo "Opprettet: $file"'

# Sjekk launch-krav foer prod-deploy
launch-check:
    @bash -euo pipefail -c 'echo "==> Verifikasjon"; just verify; echo "==> Health endpoint"; url="http://localhost:3000/api/health"; if curl -sf "$url" >/dev/null 2>&1; then echo "OK: $url"; else echo "ADVARSEL: Health endpoint svarer ikke paa $url (dev-server kjoerer?)"; fi; echo "==> Sentry"; if grep -E "^(NEXT_PUBLIC_SENTRY_DSN|SENTRY_DSN)=" .env.local 2>/dev/null | grep -qv "=$"; then echo "OK: Sentry DSN er satt"; else echo "ADVARSEL: Sentry DSN er ikke satt i .env.local"; fi; echo "Launch-sjekk ferdig."'

# Deploy til Convex preview-miljo (branch-basert)
preview:
    @bash -c 'branch="$(git rev-parse --abbrev-ref HEAD)"; echo "==> Deployer til Convex preview: $branch"; npx convex deploy --preview "$branch"; echo "Preview klar: $branch"'

# Deploy til Convex produksjon
deploy-prod:
    @bash -euo pipefail -c 'echo "==> Deployer til Convex produksjon"; npx convex deploy; echo "Produksjons-deploy ferdig."'
