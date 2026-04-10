import Image from 'next/image'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeAbout() {
  return (
    <section className='px-pad py-16'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4'>Om tatovøren</Eyebrow>
        <div className='flex flex-col gap-8 md:flex-row md:items-start'>
          <div className='shrink-0 self-center md:self-auto'>
            <Image
              src='/profilbilde.jpeg'
              alt='Trovum Tattoo'
              width={96}
              height={96}
              className='object-cover'
              style={{
                width: 96,
                height: 96,
                filter: 'grayscale(20%) contrast(1.05)',
                border: '1px solid var(--rule-heavy)',
              }}
            />
          </div>
          <div className='text-center md:text-left'>
            <h2 className='mb-4 font-serif italic text-[clamp(22px,3vw,30px)] leading-[1.1] tracking-[-0.02em] text-paper'>
              Trovum Tattoo
            </h2>
            <p className='mx-auto max-w-[48ch] font-sans text-[13px] leading-[1.8] text-body md:mx-0 md:text-[14px]'>
              Spesialiserer seg på dark art, blackwork, realism og custom design.
              Hvert arbeid er tegnet fra bunnen av — skreddersydd til deg og kroppen din.
              Basert i Sandvika.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
