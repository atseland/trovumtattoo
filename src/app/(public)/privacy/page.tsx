import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'

export default function PrivacyPage() {
  return (
    <div className='mx-auto max-w-2xl px-6 lg:px-12 py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>Juridisk</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Personvernerklæring
      </h1>
      <p className='font-sans text-[12px] text-mast-left mb-10'>Sist oppdatert: april 2025</p>

      <div className='flex flex-col gap-8'>
        {[
          {
            title: 'Hvem er ansvarlig',
            body: 'Trovum Tattoo er behandlingsansvarlig for personopplysninger som samles inn gjennom dette nettstedet. For spørsmål om personvern, kontakt oss på e-post.',
          },
          {
            title: 'Hvilke opplysninger vi samler inn',
            body: 'Når du sender inn en bookingforespørsel, samler vi inn: navn, e-postadresse, telefonnummer, Instagram-håndtak (valgfritt), beskrivelse av tatoveringsprosjektet, og eventuelle referansebilder du laster opp. Disse opplysningene brukes utelukkende for å behandle din forespørsel og kommunisere med deg.',
          },
          {
            title: 'Formål og rettslig grunnlag',
            body: 'Vi behandler personopplysninger for å kunne svare på og behandle bookingforespørsler (berettiget interesse), og for å oppfylle en eventuell avtale om tatovering (avtaleoppfyllelse). Vi sender ikke markedsføring uten ditt eksplisitte samtykke.',
          },
          {
            title: 'Lagring og sletting',
            body: 'Forespørsler og kundedata lagres så lenge det er nødvendig for å gjennomføre og dokumentere tatoveringsoppdraget, og i tråd med regnskapslovens krav (5 år for fakturadokumentasjon). Du kan når som helst be om innsyn i, retting av, eller sletting av dine personopplysninger.',
          },
          {
            title: 'Deling med tredjeparter',
            body: 'Vi deler ikke personopplysninger med tredjeparter med unntak av tekniske underleverandører (hosting, e-post, betalingsprosessering) som er bundet av databehandleravtaler. Disse leverandørene behandler data utelukkende på våre vegne.',
          },
          {
            title: 'Dine rettigheter',
            body: 'I henhold til GDPR har du rett til innsyn, retting, sletting («retten til å bli glemt»), begrensning av behandling, dataportabilitet og innsigelse. Klager kan rettes til Datatilsynet (datatilsynet.no).',
          },
        ].map((section, i, arr) => (
          <div key={i}>
            <h2 className='font-sans font-medium text-[14px] text-paper mb-3'>{section.title}</h2>
            <p className='font-sans text-[13px] text-body leading-[1.8] max-w-[52ch]'>{section.body}</p>
            {i < arr.length - 1 && <Rule className='mt-8' />}
          </div>
        ))}
      </div>
    </div>
  )
}
