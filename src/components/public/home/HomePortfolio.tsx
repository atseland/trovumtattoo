import Image from 'next/image'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface HomePortfolioProps {
  artworks: string[]
}

export function HomePortfolio({ artworks }: HomePortfolioProps) {
  return (
    <section className='border-t border-rule py-10 md:py-20'>
      <div className='mx-auto max-w-3xl px-6 md:px-12 lg:px-12'>
        <Eyebrow withLine className='mb-5'>Portfolio</Eyebrow>
      </div>
      <div className='mx-auto max-w-3xl md:px-12 lg:px-12'>
        <div className='grid grid-cols-2 gap-px sm:grid-cols-3'>
          {artworks.map((src, index) => (
            <div key={src} className='aspect-square overflow-hidden bg-panel'>
              <Image
                src={src}
                alt={`Portfolio-bilde ${index + 1}`}
                width={400}
                height={400}
                className='h-full w-full object-cover'
                style={{ filter: 'grayscale(20%) contrast(1.05)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
