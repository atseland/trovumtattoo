# PRD — Trovum Tattoo OS v1

## 0. Dokumentmetadata

- **Produktnavn:** Trovum Tattoo OS
- **Versjon:** v1
- **Dokumenttype:** Product Requirements Document
- **Status:** Klar for task breakdown og implementering
- **Primær målplattform:** Mobil web / PWA
- **Sekundær plattform:** Desktop web
- **Primær bruker:** Én tatovør
- **Domene:** `trovumtattoo.no`

---

## 1. Executive summary

Trovum Tattoo OS v1 er et mobile-first operativsystem for én tatovør. Produktet skal ta en kaotisk arbeidshverdag som i dag lever i Instagram-DM, e-post, notater og manuell oppfølging, og gjøre den om til en ryddig, lavfriksjons arbeidsflate.

Produktet består av:

1. en **public-facing artist-side** som bygger tillit og leder kunder inn i riktig flyt
2. et **strukturert bookingforespørselsskjema**
3. en **mobil adminflate** for vurdering, prisestimat, depositum, booking og oppfølging
4. en **lett e-postflate** knyttet til one.com-domenemail
5. en **PWA med notifikasjoner**
6. et **lett SEO-lag** for å fange relevant organisk trafikk
7. en **enkel review request-flyt** for å hjelpe med Google-anmeldelser

Dette er **ikke** en SaaS-plattform i v1.  
Dette er **ikke** et studioverktøy for flere artister i v1.  
Dette er **ikke** et regnskapssystem i v1.

---

## 2. Problem statement

Tatovøren får henvendelser via Instagram og e-post, men mangler et samlet system for å:

- ta imot bookingforespørsler strukturert
- samle referansebilder og kundedata
- vurdere og prioritere forespørsler
- be om mer info
- sende prisestimat
- holde oversikt over depositum
- opprette og følge opp bookinger
- sende aftercare
- huske å be fornøyde kunder om anmeldelser

Konsekvenser i dagens situasjon:

- informasjon er spredt
- ting glipper
- mental belastning blir høy
- workflow er unødvendig fragmentert
- kunden får en ujevn eller treg opplevelse
- administrasjon stjeler fokus fra selve tatoveringsarbeidet

Produktet skal løse dette uten å introdusere enterprise-kompleksitet.

---

## 3. Produktvisjon

Bygg et lite tattoo operating system forkledd som en vakker artist-side.

Produktet skal føles:

### Utad
- premium
- estetisk sterkt
- tillitsvekkende
- enkelt å forstå

### Internt
- rolig
- mobilvennlig
- handlingsorientert
- lite “systemete”
- bygd for å redusere kognitiv friksjon

---

## 4. Produktmål

### 4.1 Primære mål
Produktet skal:

- gjøre bookingforespørsler strukturerte
- gi tatovøren en enkel mobil adminflate
- samle kundeinfo, referansebilder, status, meldinger og booking på ett sted
- støtte prisestimat og depositum som operativ flyt
- støtte mail i kontekst via domenemail
- fungere som en installérbar PWA
- sende varsler kun for hendelser som faktisk krever handling
- gi et grunnleggende SEO-fundament
- gjøre det lett å be fornøyde kunder om Google-anmeldelser

### 4.2 Sekundære mål
- redusere avhengigheten av Instagram-DM som arbeidsflate
- øke profesjonaliteten i kundereisen
- gjøre det lettere å senere generalisere systemet dersom produktet faktisk fungerer godt i praksis

---

## 5. Ikke-mål

Disse tingene skal eksplisitt **ikke** bygges i v1:

- multi-tenant SaaS
- flere tatovører / studiohierarki
- avansert rolle- og rettighetsstyring
- studioleie / commission splits
- full CRM- og marketing suite
- nettbutikk / merch
- tung bloggplattform / magazine
- content engine for TikTok/YouTube
- POS / kasseløsning
- full betalingsmotor
- regnskapsmotor
- komplett Conta-integrasjon som kritisk vei
- full e-postklient
- avansert analytics-dashboard
- AI-funksjonalitet som kjernefunksjon
- bred plattformstrategi for “alle tatovører” i v1

---

## 6. Produktprinsipper

### 6.1 Ett domene
All viktig funksjonalitet, innhold og SEO-verdi skal bo på `trovumtattoo.no`.

### 6.2 Instagram er inngang, ikke system
Instagram skal brukes til trafikk og tillit, men selve workflowen skal leve i produktet.

### 6.3 Mobil først
Admin skal designes for mobil først. Desktop skal være god, men mobil er prioritet.

### 6.4 Lav friksjon
Få valg, korte veier, tydelige handlinger.

### 6.5 Høy signalverdi
Systemet skal fremheve hva som er nytt, hva som krever handling, og hva som er neste steg.

### 6.6 Smal produktforståelse
Bygg for én konkret tatovør og hennes virkelige hverdag.

### 6.7 Mail i kontekst
E-post er en del av workflowen, ikke et separat univers.

### 6.8 Conta er økonomisk source of truth
Appen håndterer operativ status, ikke regnskap.

### 6.9 SEO uten content creep
Public site skal ha nok tekstlig substans til å rangere på relevante spørsmål og hjelpe kunder, men skal ikke bli et medieprosjekt i v1.

### 6.10 Reviews som lett vane, ikke modul
Review request skal være en enkel, tydelig handling etter fullført prosjekt — ikke et eget subsystem.

---

## 7. Brukere og personaer

## 7.1 Primær bruker: Tatovøren
Kjennetegn:

- ikke teknisk
- bruker mobilen som hovedflate
- jobber visuelt og kreativt
- har liten toleranse for fragmenterte systemer
- trenger tydelig “hva nå?”
- må kunne gjøre viktig admin raskt mellom arbeid og i farten

### Primære behov
- oversikt
- raske statusendringer
- enkel kommunikasjon
- lite støy
- ett sted å gå til

### Smertepunkter
- DM-kaos
- e-post ute av kontekst
- ting som glipper
- manglende oppfølging
- usikkerhet rundt hvem som venter på hva

## 7.2 Sekundær bruker: Kunden
Kjennetegn:

- kommer ofte fra Instagram
- vil raskt se stil og kvalitet
- trenger trygghet og enkel bookinginngang
- tåler dårlig uklare instrukser
- bruker som regel mobil

### Primære behov
- forstå hvordan booking fungerer
- vite hva som forventes
- kunne sende inn komplett forespørsel
- føle at henvendelsen havner i et profesjonelt system

---

## 8. Jobs to be done

### 8.1 Tatovør
- Når en ny henvendelse kommer inn, vil jeg raskt se om den er relevant og hva som mangler.
- Når jeg vurderer et prosjekt, vil jeg se all relevant info og bilder på ett sted.
- Når jeg sender prisestimat eller depositum, vil jeg gjøre det raskt uten å miste kontekst.
- Når jeg får e-post fra en kunde, vil jeg se hvilken kunde/prosjekt den tilhører.
- Når jeg er på mobil, vil jeg kunne få gjort alt viktig uten friksjon.
- Når et prosjekt er ferdig, vil jeg enkelt kunne sende aftercare og be om review.

### 8.2 Kunde
- Når jeg klikker fra Instagram, vil jeg raskt forstå om dette er riktig artist for meg.
- Når jeg sender inn en bookingforespørsel, vil jeg føle at jeg har gitt riktig info.
- Når jeg får svar, vil prosessen føles ryddig og profesjonell.

---

## 9. Scope for v1

### In scope
- public site
- bookingforespørselsskjema
- admin-dashboard
- inquiries-liste
- kundekort / prosjektsider
- statusstyring
- referansebilde-opplasting
- prisestimat
- depositumfelt og depositumstatus
- enkel kalender
- one.com mail light
- meldingsmaler
- aftercare-maler
- review request-mal og logging
- PWA
- notification center
- push-varsler for høy-signal hendelser
- lett SEO-lag
- enkel settings-side

### Out of scope
- alt nevnt under Ikke-mål

---

## 10. Informasjonsarkitektur

## 10.1 Public routes
- `/`
- `/book`
- `/faq`
- `/booking-info`
- `/aftercare`
- `/portfolio` eller integrert portfolio på forsiden
- `/cover-up` hvis relevant
- `/privacy` og `/terms` hvis nødvendig

## 10.2 Admin routes
- `/admin`
- `/admin/inquiries`
- `/admin/inquiries/[id]`
- `/admin/clients`
- `/admin/clients/[id]`
- `/admin/projects/[id]`
- `/admin/calendar`
- `/admin/mail`
- `/admin/mail/[threadId]`
- `/admin/templates`
- `/admin/notifications`
- `/admin/settings`

---

## 11. Public product requirements

## 11.1 Public homepage
### Formål
- bygge tillit
- vise arbeid og stil
- forklare prosess
- lede til booking

### Innhold
- hero
- artistintro
- portfolio / bildegalleri
- stilretning / spesialisering
- bookingprosess
- FAQ
- CTA til bookingforespørsel
- lenke til Instagram
- enkel kontaktinfo

### Acceptance criteria
- siden fungerer godt på mobil
- CTA til booking er tydelig synlig uten mye scrolling
- designet følger valgt mørk/editorial profil
- teksten forklarer prosessen tydelig
- porteføljen fremstår som premium og ryddig

## 11.2 Booking info page
### Formål
- redusere unødvendige spørsmål
- forklare hvordan henvendelser vurderes
- sette forventninger

### Innhold
- hva slags prosjekter som passer
- hva kunden bør sende inn
- hvordan pris estimeres
- hvordan depositum fungerer
- hvordan booking bekreftes
- hva som skjer videre etter innsending

## 11.3 FAQ
### Formål
- svare på de vanligste spørsmålene
- gi SEO-verdi
- redusere manuelt svarbehov

### Eksempler på FAQ-tema
- hvordan booker jeg?
- hva bør jeg sende inn?
- tar du cover-up?
- hvordan fungerer depositum?
- hvor lang tid tar det å få svar?
- hvordan fungerer aftercare?

## 11.4 Aftercare page
### Formål
- gi kunder et lett tilgjengelig sted å finne etterbehandling
- avlaste direkte henvendelser
- støtte SEO på et naturlig og nyttig tema

---

## 12. Booking inquiry requirements

## 12.1 Form fields
Skjemaet skal ha følgende felter:

- fullt navn
- e-post
- telefonnummer
- Instagram-handle
- beskrivelse av ønsket tattoo
- plassering på kroppen
- størrelse
- ønsket stil
- referansebilder (flere filer)
- budsjett
- ønsket tidsrom / ønskede datoer
- første tattoo? (ja/nei)
- cover-up? (ja/nei)
- touch-up? (ja/nei)
- ekstra kommentarer

## 12.2 Validation
- alle kritiske felter må valideres
- tydelige feilmeldinger på mobil
- filopplasting må håndtere flere bilder
- skjemaet må kunne sendes uten desktop

## 12.3 Submission behavior
Ved innsending skal systemet:
- opprette en Inquiry
- sette status til `Ny`
- lagre referansebilder
- opprette aktivitetshistorikk
- opprette notifikasjon
- gjøre forespørselen synlig i admin

## 12.4 Optional confirmation
- systemet kan sende bekreftelse automatisk senere
- i v1 holder det at forespørselen logges og er synlig i admin, men produktet bør struktureres slik at auto-confirmation kan legges til senere

### Acceptance criteria
- skjemaet er lett å fylle ut på mobil
- opplasting virker på både iPhone og Android
- innsending fører til tydelig ny inquiry i admin
- feilstater er forståelige

---

## 13. Admin dashboard requirements

## 13.1 Formål
Dashboardet skal gi rask oversikt over alt som krever oppmerksomhet.

## 13.2 Innhold
- antall nye forespørsler
- antall som venter på svar
- antall som venter på depositum
- kommende bookinger
- nylig oppdaterte prosjekter
- uleste e-posttråder
- uleste varsler
- snarveier til viktige handlinger

## 13.3 UX-krav
- mobil først
- scannbart på få sekunder
- store trykkflater
- ingen overflødige grafer
- vis først det som krever handling

### Acceptance criteria
- tatovøren kan åpne dashboard og umiddelbart forstå dagens viktigste ting
- dashboard er brukbart med én hånd på mobil
- ingen viktig handling krever mange trykk

---

## 14. Inquiry and project management requirements

## 14.1 Statusmodell
Statusene skal være:

- `Ny`
- `Trenger mer info`
- `Klar for konsultasjon`
- `Tilbud sendt`
- `Venter på depositum`
- `Booket`
- `Fullført`
- `Avslått`

## 14.2 Statusregler
- alle inquiries/prosjekter skal ha én hovedstatus
- statusendringer logges
- systemet skal vise siste statusendring
- admin skal filtrere og søke etter status

## 14.3 Inquiry detail view
Skal vise:
- hele innsendingen
- referansebilder
- kontaktinfo
- hurtighandlinger
- interne notater
- aktivitetshistorikk
- knapper for statusendring

## 14.4 Client / Project detail view
Skal vise:
- kundeinfo
- Instagram-handle
- relaterte inquiries
- prosjektstatus
- prisestimat
- depositum
- betalingslenke
- booking
- e-posttråder
- meldingshistorikk
- notater
- activity log

## 14.5 Quick actions
Fra detaljsider skal admin raskt kunne:
- endre status
- legge til notat
- sette prisestimat
- sende melding
- legge til depositum
- markere depositum mottatt
- opprette booking
- sende aftercare
- sende review request

### Acceptance criteria
- én kunde/prosjektside gir tilstrekkelig oversikt til at admin slipper å lete i flere systemer
- statusoppdateringer er raske
- notater og bilder er lett tilgjengelige på mobil

---

## 15. Client model requirements

## 15.1 Client record
Systemet skal støtte egen kliententitet for å kunne knytte flere interaksjoner til samme person.

## 15.2 Minimum client data
- navn
- e-post
- telefon
- Instagram-handle
- generelle notater
- opprettet dato
- oppdatert dato

## 15.3 Linking behavior
- en inquiry skal kunne bli del av en client/prosjektflyt
- e-poster skal kunne knyttes til klient og prosjekt
- bookinger skal alltid være knyttet til prosjekt

---

## 16. Estimate, deposit and accounting-light requirements

## 16.1 Estimate
Admin skal kunne lagre:
- prisestimat
- notat til estimat
- eventuelt intervall / usikkerhet hvis ønskelig

## 16.2 Deposit
Systemet skal støtte:
- depositumbeløp
- depositumstatus
- manuell betalingslenke
- markering av mottatt depositum

## 16.3 Conta handling
Conta forblir regnskapssystem.

V1 skal kun støtte:
- fakturareferanse
- notat om at fakturering/betaling er håndtert i Conta
- accounting status som operativt felt

## 16.4 Not in scope
- bokføring
- automatisert mva-logikk
- full fakturaopprettelse
- full bidirectional Conta-sync

### Acceptance criteria
- admin kan se om et prosjekt venter på depositum
- admin kan markere når depositum er mottatt
- systemet gir nok info til å holde kontroll uten å være et regnskapssystem

---

## 17. Calendar requirements

## 17.1 Formål
Kalenderen skal gi enkel oversikt over kommende avtaler og støtte grunnleggende bookingarbeid.

## 17.2 Features
- listevisning
- enkel ukevisning eller månedsvisning hvis mobilvennlig
- opprette booking
- redigere booking
- ombooke
- avlyse
- markere fullført

## 17.3 Booking model
Hver booking skal ha:
- prosjektkobling
- starttid
- sluttid
- status
- notat

## 17.4 Not in scope
- avansert availability engine
- ressurshåndtering
- flere artister / rom / stasjoner

### Acceptance criteria
- admin kan opprette booking fra prosjekt
- kommende bookinger er synlige
- endring av booking er mulig fra mobil

---

## 18. Email requirements (one.com)

## 18.1 Overordnet mål
Gi admin en lett mailbox-UI i kontekst.

## 18.2 Supported functionality
- se innboks
- lese tråder
- svare
- sende ny e-post
- markere lest/ulest
- søke i tråder
- koble tråd til client/project
- bruke templates som utgangspunkt

## 18.3 UX rules
- mail skal kunne vises i prosjektkontekst
- relevante tråder skal være synlige på kundesider
- “svar med mal” skal være en enkel handling

## 18.4 Not in scope
- full mail rule engine
- etikett- og mappeverden
- avansert rich text composer
- komplett vedleggssystem
- multi-user mailbox

## 18.5 Technical direction
- IMAP for inbound sync
- SMTP for outbound
- lokal app-indeks for rask visning
- credentials må lagres sikkert

### Acceptance criteria
- admin kan lese og svare på domenemail uten å hoppe til webmail
- e-posttråder kan knyttes til kunde/prosjekt
- mailopplevelsen er enkel og mobilvennlig

---

## 19. Templates requirements

## 19.1 Template types
Systemet skal støtte maler for:

- mottatt forespørsel
- trenger mer info
- prisestimat
- forslag til tidspunkt
- betal depositum
- bookingbekreftelse
- påminnelse før time
- aftercare
- takk etter ferdig prosjekt
- review request

## 19.2 Template behavior
Admin skal kunne:
- opprette og redigere maler
- velge mal når melding skal sendes
- gjøre endringer før sending
- få meldingen logget på riktig prosjekt

### Acceptance criteria
- maler gjør vanlig kommunikasjon raskere
- sending fra mal krever få steg
- sendte meldinger logges

---

## 20. Aftercare and review requirements

## 20.1 Aftercare
Systemet skal støtte:
- lagring av aftercare-maler
- valg av mal på fullført booking/prosjekt
- logging av utsending

## 20.2 Review request
Systemet skal støtte:
- enkel review request-mal
- logging av at review request er sendt
- felt for `reviewRequestedAt`

## 20.3 Non-goals
- ikke bygg review-plattform
- ikke bygg offentlig reviews-feed
- ikke bygg avansert omdømmesystem

### Acceptance criteria
- admin kan sende aftercare raskt
- admin kan sende review request som en enkel siste handling
- systemet gjør det lett å bygge en vane rundt anmeldelser

---

## 21. PWA requirements

## 21.1 Mål
Appen skal kunne installeres på hjemskjermen og brukes som en app.

## 21.2 Required capabilities
- installérbar
- manifest
- ikon
- splash / launch experience
- standalone mode
- rask oppstart
- caching av app shell
- tåle dårlig nett

## 21.3 Offline expectations
Full offline-støtte er ikke krav, men:
- grunnleggende shell bør lastes
- appen skal ikke føles skjør ved kortvarig dårlig dekning
- bruker skal få tydelige meldinger hvis noe krever nett

### Acceptance criteria
- brukeren kan installere appen på mobil
- appen åpnes i standalone mode
- opplevelsen føles nær en app, ikke bare som en side i nettleser

---

## 22. Notification requirements

## 22.1 Prinsipp
Bare varsle når noe faktisk krever handling.

## 22.2 Push notification events
- ny bookingforespørsel
- nytt kundesvar på e-post
- depositum ikke mottatt etter definert tid
- booking i morgen
- booking i dag
- oppfølging forfalt

## 22.3 In-app notification center
Må vise:
- tittel
- type
- prioritet
- tidspunkt
- lenke til relevant entitet
- lest/ulest

## 22.4 Not in scope
- spammy notifikasjoner
- varsler for hver mikroskopisk systemhendelse

### Acceptance criteria
- viktige hendelser blir ikke glemt
- varslene oppleves nyttige, ikke masete
- admin kan rydde i og lese varsler i appen

---

## 23. Search and filtering requirements

Systemet skal støtte:

- søk på navn
- søk på Instagram-handle
- søk på e-post
- filter på status
- filter på `Venter på depositum`
- visning av kommende bookinger
- visning av uleste e-poster
- visning av uleste varsler
- sortering på nyeste / eldste / sist oppdatert

### Acceptance criteria
- admin kan raskt finne riktig kunde eller forespørsel
- filtrering er enkel på mobil
- viktige lister kan prioriteres uten komplisert UI

---

## 24. SEO requirements

## 24.1 Scope for v1
SEO i v1 skal være lett, nyttig og integrert i det produktet allerede trenger.

## 24.2 SEO must-haves
- semantiske sidetitler
- meta descriptions
- tydelig sidehierarki
- tydelig tekst på public sider
- FAQ-innhold som svarer på ekte spørsmål
- booking info med søkbar tekst
- aftercare-side
- enkelt og konsistent hoveddomeneoppsett

## 24.3 SEO non-goals
- omfattende publiseringsstrategi
- tung blogg
- masse SEO-landingssider
- aggressiv content calendar

### Acceptance criteria
- siden har nok tekstlig substans til å rangere på grunnleggende relevante søk
- SEO-laget føles som del av produktet, ikke et eget prosjekt

---

## 25. UX and design requirements

## 25.1 Overordnet stil
Designet skal bygge på valgt visuell profil:

- mørk
- varm
- editorial
- premium
- rolig
- artist-led

## 25.2 Typography
- serif italic til hero/overskrifter/artistidentitet
- ren sans-serif til UI
- monospace / uppercase til små etiketter og metadata der det passer

## 25.3 Color direction
Bruk som grunnlag:
- mørk bakgrunn
- varm, dempet tekstpalett
- subtil aksentfarge
- tynne borders og lette gradients

## 25.4 Admin adaptation
Admin skal bruke samme identitet, men i en mer nedtonet, funksjonell versjon.

## 25.5 Mobile-first rules
- store trykkflater
- få nivåer dypt
- tydelige kort
- sticky handlinger der det gir mening
- bunnnavigasjon eller tilsvarende
- rask tilgang til kjernehandlinger
- minimalt med visuell støy

### Acceptance criteria
- admin er rask å bruke på mobil
- public site føles premium
- admin føles som samme merkevare, men mer praktisk

---

## 26. Accessibility requirements

Minimumskrav:
- lesbar kontrast
- store nok trykkflater
- tydelig fokus state
- forståelige feilmeldinger
- skjemaer skal være brukbare uten presis desktop-mus
- visuell hierarki må være tydelig

---

## 27. Data model (high-level)

## Inquiry
- id
- createdAt
- status
- name
- email
- phone
- instagramHandle
- description
- bodyPlacement
- size
- style
- budget
- desiredTiming
- firstTattoo
- coverUp
- touchUp
- extraNotes

## ReferenceImage
- id
- inquiryId
- url
- altText
- uploadedAt

## Client
- id
- name
- email
- phone
- instagramHandle
- notes
- createdAt
- updatedAt

## Project
- id
- clientId
- inquiryId
- status
- estimatedPrice
- internalNotes
- depositAmount
- depositStatus
- paymentLink
- invoiceReference
- accountingStatus
- paymentNote
- aftercareTemplateId
- reviewRequestedAt
- createdAt
- updatedAt

## Booking
- id
- projectId
- startAt
- endAt
- status
- notes
- createdAt
- updatedAt

## MessageTemplate
- id
- type
- title
- content
- createdAt
- updatedAt

## MailAccount
- id
- emailAddress
- provider
- username
- encryptedCredentialRef
- isActive
- lastSyncAt

## MailThread
- id
- externalThreadId
- subject
- participants
- linkedClientId
- linkedProjectId
- lastMessageAt
- unreadCount
- status

## MailMessage
- id
- threadId
- direction
- from
- to
- cc
- subject
- bodyText
- bodyHtml
- sentAt
- receivedAt
- isRead
- linkedClientId
- linkedProjectId

## Notification
- id
- type
- title
- body
- relatedEntityType
- relatedEntityId
- priority
- isRead
- createdAt

## ActivityLog
- id
- entityType
- entityId
- action
- payload
- createdAt

---

## 28. Edge cases and state handling

Systemet må håndtere:

- ingen inquiries ennå
- manglende bilder
- feil ved bildeopplasting
- ugyldig skjema
- brutt e-postsync
- manglende kobling mellom mail og prosjekt
- booking uten depositum
- kansellert booking
- ombooket booking
- fullført prosjekt uten sendt aftercare
- review request allerede sendt
- tregt nett / dårlig mobildekning
- tomme dashboards og tomme lister

### UX-krav for edge cases
- tomme tilstander skal være pene og forklarende
- feil skal være forståelige
- kritiske feil skal ikke gi datatap
- brukeren skal få tydelig feedback på hva som skjedde

---

## 29. Security and privacy requirements

## Minimumskrav
- admin må være beskyttet bak autentisering
- credentials for one.com må lagres sikkert
- sensitiv kundedata må ikke eksponeres offentlig
- filopplasting må håndteres trygt
- kun nødvendig persondata skal lagres
- systemet skal ha enkel, realistisk sikkerhet for en small-scale produksjonsapp

## Ikke mål i v1
- komplisert enterprise security model
- flerroller med fine-grained access control

---

## 30. Metrics and success criteria

## 30.1 Produktet er vellykket når
1. tatovøren faktisk foretrekker dette fremfor DM-kaos
2. nye forespørsler kommer inn strukturert
3. admin kan gjøres komfortabelt fra mobil
4. hun vet hvem som venter på svar, depositum og booking
5. e-post og booking lever i samme arbeidsflate
6. appen oppleves enkel nok til daglig bruk
7. varsler hjelper uten å bli støy
8. public site fungerer både som Instagram-destinasjon og som SEO-grunnmur
9. det er enkelt å be fornøyde kunder om Google-anmeldelser

## 30.2 Enkle proxy metrics
- antall henvendelser via skjema vs DM
- andel inquiries som får statusoppfølging
- andel prosjekter med registrert depositumstatus
- andel fullførte prosjekter der aftercare er sendt
- andel fullførte prosjekter der review request er sendt

---

## 31. Release plan / phased delivery

## Fase 1
- public landing page
- bookingforespørsel
- inquiry storage
- enkel adminliste
- inquiry detail
- statusstyring
- bildeopplasting

## Fase 2
- client/project pages
- interne notater
- prisestimat
- depositumfelt
- activity log
- enkle meldingsmaler

## Fase 3
- one.com mail light
- innboks
- trådvisning
- send/svar
- kobling mellom mail og kunde/prosjekt

## Fase 4
- kalender
- bookingopprettelse
- ombooking / avlysning
- aftercare
- review request-mal og logging

## Fase 5
- PWA
- notification center
- push-varsler

## Fase 6
- Conta-referanser
- eventuell senere Conta API-integrasjon hvis faktisk behov oppstår
- eventuell senere SEO-utvidelse hvis grunnmuren fungerer og brukes

---

## 32. Open questions

Disse kan avklares i task breakdown eller teknisk design, men skal ikke blokkere PRD-en:

1. Skal Google Calendar sync være med i v1 eller v1.1?
2. Skal bookingbekreftelse og andre meldinger sendes automatisk i v1, eller manuelt via maler?
3. Skal public portfolio være full side eller integrert seksjon på forsiden?
4. Skal cover-up ha egen side i v1, eller bare omtales i FAQ / booking info?
5. Hvordan skal one.com mail credentials provisioneres tryggest i første versjon?
6. Hvilken auth-strategi er enklest og mest robust for én admin-bruker?

---

## 33. Instructions to implementation agent

Bygg dette som et smalt, produksjonsnært verktøy for én konkret tatovør.

### Prioriter
- ekte workflows
- robust CRUD
- mobilvennlighet
- tydelig neste handling
- enkel datastruktur
- lav friksjon
- høy signalverdi

### Ikke prioriter
- fleksibilitet for “senere”
- SaaS-abstraksjoner
- tung backendarkitektur
- dashboardsirkus
- ekstra features uten direkte verdi for admin-kaoset

### Valgregler
Hvis du må velge mellom:
- flere features
- eller bedre mobilflyt

velg bedre mobilflyt.

Hvis du må velge mellom:
- fleksibilitet
- eller enkelhet

velg enkelhet.

Hvis du må velge mellom:
- fancy UI
- eller tydelig neste handling

velg tydelig neste handling.

Hvis du er i tvil om noe hører hjemme i v1:
- spør om det direkte reduserer admin-kaos for én tatovør
- hvis ikke: ikke bygg det nå