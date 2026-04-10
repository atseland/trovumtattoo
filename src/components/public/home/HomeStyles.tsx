import { Eyebrow } from '@/components/ui/Eyebrow'

interface HomeStylesProps {
  styles: string[]
}

export function HomeStyles({ styles }: HomeStylesProps) {
  return (
    <section className='px-5 py-16 lg:px-12'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4'>Spesialiseringer</Eyebrow>
        <h2 className='mb-6 font-serif italic text-[clamp(22px,3vw,30px)] leading-[1.1] tracking-[-0.02em] text-paper'>
          Stilretninger
        </h2>
        <ul className='grid grid-cols-2 gap-3'>
          {styles.map((style) => (
            <li key={style} className='flex items-center gap-3'>
              <span className='block h-px w-4 shrink-0 bg-index-num' />
              <span className='font-sans text-[13px] text-body'>{style}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
