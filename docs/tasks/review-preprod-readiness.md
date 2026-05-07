# Review: preprod-readiness

**Dato:** 2026-04-09
**Formaal:** beslutningsrapport for hva som gjenstaar foer ekte brukertesting og produksjon
**Kildegrunnlag:** `docs/tasks/review-release-readiness-audit.md`, handoffs 2026-04-09, commit-historikk til og med `03d444e`

## Kort status

Repoet er naer klar for kontrollert ekte brukertesting, men ikke klart for produksjon som dagens lokale arbeidsflate.

Det viktigste skillet er:

- Den verifiserte commit-historikken er i god stand for test med ekte brukerflyt.
- Dagens worktree inneholder store urelaterte lokale endringer som ikke er auditert eller verifisert som release-kandidat.

## Det som er bevist

### Public og booking

- Public-ruter eksisterer og laster.
- Bookingflyten er implementert, inkludert referansebilder.
- Fiksen for offentlig bildeflyt er commit-et og tidligere verifisert.

### Admin-kjerne

- Clerk/Convex-auth fungerer i runtime.
- Committed Playwright dekker `inquiry -> client -> project -> booking`.
- `mail`, `notifications`, `settings` og `templates` renderer som innlogget admin.
- Template CRUD er verifisert i committed Playwright.

### Mail

- one.com-kontoen `kontakt@trovumtattoo.no` er konfigurert server-side i Convex.
- Ekte inbound sync er testet.
- Ekte outbound reply er testet og mottatt.
- Thread-visning er ryddet opp til lesbar tekst.
- Historiske dubletter i dev-data er ryddet.

### Verifikasjon

- `pnpm typecheck` passerer.
- `pnpm lint` passerer med kun kjente warnings i `convex/_generated/*`.
- `pnpm test:e2e` og smal admin-Playwright har passert etter host-fiks.
- `just verify` har passert i den verifiserte commit-linjen.

## Foer ekte brukertesting

Maalet her er ikke full launch, men et trygt testmiljo med ekte flyter og lav risiko.

### Maa paa plass

1. Velg eksplisitt release-kandidat.
   Dagens worktree er for uryddig til aa brukes som testgrunnlag uten ny audit. Ekte brukertest boer skje fra en kjent commit eller en liten, eksplisitt testbranch.

2. Kjor en samlet manuell smoke-pass i appen.
   Minimum:
   - public booking med og uten bilder
   - admin inbox/thread/reply
   - inquiry -> client -> project -> booking
   - templates
   - settings/notifications som faktisk brukes i testscope

3. Bekreft miljoverdier i testmiljo.
   Minimum:
   - Clerk nøkler
   - Convex URL/site URL
   - Clerk issuer/JWKS
   - one.com mail-env i Convex
   - eventuelt VAPID hvis push skal testes

### Bør paa plass

1. Beslutt om push-varsler er i scope for ekte brukertest.
   Hvis ja, maa `NEXT_PUBLIC_VAPID_PUBLIC_KEY` og server-side `VAPID_*` verifiseres i runtime.
   Hvis nei, bør push eksplisitt behandles som utsatt launch-scope.

2. Kjor et preview-pass paa den valgte kandidaten.
   `just preview` boer brukes for aa teste et repeterbart deploy-lignende miljo før ekte bruker slippes til.

## Foer produksjon

### P0 blokkerere

1. Rydd release-grunnlaget.
   Produksjon kan ikke baseres paa dagens lokale worktree med store urelaterte endringer. Disse maa enten:
   - commit-es i avgrensede, verifiserte steg, eller
   - holdes helt utenfor release-kandidaten.

2. Kjor full launch-gate paa faktisk kandidat.
   Minimum:
   - `just verify`
   - `just launch-check`
   - manuell smoke-pass mot deployet kandidat

3. Fullfoer miljokonfig for prod.
   Minimum:
   - produksjonsverdier for Clerk
   - produksjonsverdier for Convex
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `MAIL_*` i Convex
   - `VAPID_*` og `NEXT_PUBLIC_VAPID_PUBLIC_KEY` hvis push er i scope

4. Verifiser deploy-flyten ende-til-ende.
   - preview deploy
   - produksjonsdeploy
   - health endpoint
   - admin-auth
   - booking-submit
   - mail sync/reply

### P1 viktige gap

1. Push/PWA er ikke ferdig bevist som operativ feature.
   Kode og UI finnes, men runtime subscribe/send er ikke bekreftet i denne audit-runden.

2. `just launch-check` peker fortsatt paa `http://127.0.0.1:3000/api/health`.
   Repoet er ellers standardisert paa `localhost`. Dette er liten kodejobb, men boer ryddes foer launch for aa unngaa falske advarsler.

3. Mailflyten mangler committed regressjonsdekning for ekte thread-handlinger.
   Dette er ikke lenger en funksjonsblokker, men gir svakere sikkerhetsnett ved senere endringer.

## Anbefalt beslutning

### Klar for ekte brukertesting

Ja, med forbehold:

- bruk en kjent verifisert commit eller en ryddet testbranch
- gjør en kort manuell smoke-pass først
- ikke test fra dagens uauditerte worktree

### Klar for produksjon

Ikke ennå.

Hovedgrunner:

- release-kandidaten er ikke avklart fordi worktree er uryddig
- push/runtime er ikke fullverifisert dersom det er launch-scope
- produksjonsmiljo og deploy-gate er ikke bekreftet som full kjede ennå

## Konkret neste sekvens

1. Frys en release-kandidat fra verifisert commit-linje.
2. Kjor `just preview` paa kandidaten.
3. Kjor manuell smoke-pass mot preview:
   - public booking
   - admin pipeline
   - mail inbound/reply
   - templates
4. Avklar push:
   - verifiser, eller
   - ta ut av launch-scope
5. Sett prod-env fullt ut, inkludert Sentry.
6. Rydd `launch-check` til `localhost`.
7. Kjor `just launch-check`.
8. Deploy til produksjon.

## Risiko hvis vi hopper over dette

- Vi kan shippe en lokal worktree som ikke matcher den commit-historikken som faktisk er verifisert.
- Push kan fremstaa som ferdig i UI uten at runtime er operativ.
- Launch-check kan gi feil signal i lokal/preprod pga host-mismatch.
- Produksjonsfeil kan bli vanskeligere aa fange uten Sentry og en eksplisitt preview-pass.
