# Prosjektregler

- Preview foer prod naar mulig (`just preview`)
- Observability foer launch — sett Sentry DSN i `.env.local`
- Ikke batch mange urelaterte features i en endring
- Hold deploy-flyt enkel og repeterbar
- Polish skal ikke blokkere shipping av fungerende kjerneverdi
- Kjor `just launch-check` foer forste prod-deploy
