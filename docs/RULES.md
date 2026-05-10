# Prosjektregler

- Foer ny prod-push eller prosjekt-sluttfoering: les `docs/tasks/pre-live-finalization-2026-05-10.md`.
- Ikke deploy hvis aapne must-fix-punkter i pre-live sjekklisten fortsatt er ulost, med mindre defer er eksplisitt avtalt i chat og dokumentert i handoff.
- Preview foer prod naar mulig (`just preview`)
- Push alene er ikke ferdig; verifiser Vercel/runtime etter deploy naar mulig.
- Observability foer launch — sett Sentry DSN i `.env.local`
- PWA/push er admin-only. Public routes skal ikke bli installable PWA-flater.
- Ikke batch mange urelaterte features i en endring
- Hold deploy-flyt enkel og repeterbar
- Polish skal ikke blokkere shipping av fungerende kjerneverdi
- Kjor `just launch-check` foer forste prod-deploy
