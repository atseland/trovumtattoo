import { Eyebrow } from '@/components/ui/Eyebrow'

interface HomeStep {
  num: string
  title: string
  body: string
}

interface HomeProcessProps {
  steps: HomeStep[]
}

export function HomeProcess({ steps }: HomeProcessProps) {
  return (
    <section className='border-t border-rule px-6 py-10 md:px-12 md:py-20 lg:px-12'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-3'>Prosessen</Eyebrow>
        <h2 className='mb-6 font-serif italic text-[22px] leading-[1.15] tracking-[-0.02em] text-paper sm:text-[28px] md:mb-8'>
          Slik fungerer det
        </h2>
        <ol className='flex flex-col'>
          {steps.map((step, index) => (
            <li
              key={step.num}
              className={`grid grid-cols-[1.75rem_1fr] gap-x-3 py-4 md:grid-cols-[2rem_1fr] md:gap-x-6 md:py-6 ${
                index > 0 ? 'border-t border-rule' : ''
              }`}
            >
              <span className='pt-0.5 font-mono text-[10px] tracking-[0.16em] text-index-num'>
                {step.num}
              </span>
              <div>
                <h3 className='mb-1 font-sans text-[14px] font-medium leading-snug text-paper md:text-[15px]'>
                  {step.title}
                </h3>
                <p className='max-w-[44ch] font-sans text-[13px] leading-[1.65] text-body md:text-[13.5px]'>
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
