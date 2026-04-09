import { Eyebrow } from '@/components/ui/Eyebrow'

interface HomeStylesProps {
  styles: string[]
}

export function HomeStyles({ styles }: HomeStylesProps) {
  return (
    <section className='border-t border-rule px-6 py-10 md:px-12 md:py-20 lg:px-12'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-3'>Spesialiseringer</Eyebrow>
        <h2 className='mb-5 font-serif italic text-[22px] leading-[1.15] tracking-[-0.02em] text-paper sm:text-[28px]'>
          Stilretninger
        </h2>
        <ul className='grid grid-cols-2 gap-x-4 gap-y-0 sm:gap-x-10'>
          {styles.map((style) => (
            <li key={style} className='flex items-center gap-2.5 border-t border-rule py-2.5 sm:gap-3 sm:py-3'>
              <span className='block h-px w-3 shrink-0 bg-index-num sm:w-4' />
              <span className='font-sans text-[13px] text-body'>{style}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
