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
    <section className='px-pad py-16'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4'>Prosessen</Eyebrow>
        <h2 className='mb-10 font-serif italic text-[clamp(22px,3vw,30px)] leading-[1.1] tracking-[-0.02em] text-paper'>
          Slik fungerer det
        </h2>
        <ol className='flex flex-col gap-10'>
          {steps.map((step) => (
            <li key={step.num} className='flex gap-6'>
              <span className='w-6 shrink-0 pt-[2px] font-mono text-[11px] tracking-[0.18em] text-nav'>
                {step.num}
              </span>
              <div>
                <h3 className='mb-2 font-sans text-[14px] font-medium text-paper'>
                  {step.title}
                </h3>
                <p className='max-w-[52ch] font-sans text-[13px] leading-[1.8] text-body'>
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
