import Image from 'next/image'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeAbout() {
  return (
    <section className='border-t border-rule px-6 py-10 md:px-12 md:py-20 lg:px-12'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4'>Om tatovøren</Eyebrow>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8'>
          <div className='shrink-0'>
            <Image
              src='/profilbilde.jpeg'
              alt='Trovum Tattoo'
              width={80}
              height={80}
              className='rounded-sm object-cover'
              style={{
                width: 80,
                height: 80,
                filter: 'grayscale(20%) contrast(1.05)',
                border: '1px solid rgba(237,233,230,0.08)',
              }}
            />
          </div>
          <div>
            <h2 className='mb-2 font-serif italic text-[22px] leading-[1.15] tracking-[-0.02em] text-paper sm:text-[28px]'>
              Trovum Tattoo
            </h2>
            <p className='max-w-[44ch] font-sans text-[14px] leading-[1.7] text-body md:text-[15px]'>
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
