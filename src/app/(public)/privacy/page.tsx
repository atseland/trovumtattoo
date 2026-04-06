import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href='/' style={{ color: '#7a6e62', fontSize: '0.8rem', textDecoration: 'none' }}>
          ← Tilbake til forsiden
        </Link>
      </div>

      <h1
        className='font-serif italic'
        style={{ color: '#c9b99a', fontSize: '2rem', marginBottom: '8px' }}
      >
        Personvernerklæring
      </h1>
      <p style={{ color: '#7a6e62', marginBottom: '40px', fontSize: '0.8rem' }}>
        Sist oppdatert: april 2025
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Hvem er ansvarlig
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Trovum Tattoo er behandlingsansvarlig for personopplysninger som samles inn gjennom
            dette nettstedet. For spørsmål om personvern, kontakt oss på e-post.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Hvilke opplysninger vi samler inn
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Når du sender inn en bookingforespørsel, samler vi inn: navn, e-postadresse,
            telefonnummer, Instagram-håndtak (valgfritt), beskrivelse av tatoveringsprosjektet,
            og eventuelle referansebilder du laster opp. Disse opplysningene brukes utelukkende
            for å behandle din forespørsel og kommunisere med deg.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Formål og rettslig grunnlag
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Vi behandler personopplysninger for å kunne svare på og behandle bookingforespørsler
            (berettiget interesse), og for å oppfylle en eventuell avtale om tatovering
            (avtaleoppfyllelse). Vi sender ikke markedsføring uten ditt eksplisitte samtykke.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Lagring og sletting
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Forespørsler og kundedata lagres så lenge det er nødvendig for å gjennomføre og
            dokumentere tatoveringsoppdraget, og i tråd med regnskapslovens krav (5 år for
            fakturadokumentasjon). Du kan når som helst be om innsyn i, retting av, eller
            sletting av dine personopplysninger.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Deling med tredjeparter
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Vi deler ikke personopplysninger med tredjeparter med unntak av tekniske
            underleverandører (hosting, e-post, betalingsprosessering) som er bundet av
            databehandleravtaler. Disse leverandørene behandler data utelukkende på våre vegne.
          </p>
        </section>

        <section>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
            Dine rettigheter
          </h2>
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.7' }}>
            I henhold til GDPR har du rett til innsyn, retting, sletting («retten til å bli
            glemt»), begrensning av behandling, dataportabilitet og innsigelse. Klager kan
            rettes til Datatilsynet (datatilsynet.no).
          </p>
        </section>
      </div>
    </div>
  )
}
