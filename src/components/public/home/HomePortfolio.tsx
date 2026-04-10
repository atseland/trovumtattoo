import Image from 'next/image'
import { Eyebrow } from '@/components/ui/Eyebrow'

interface HomePortfolioProps {
  artworks: string[]
}

export function HomePortfolio({ artworks }: HomePortfolioProps) {
  return (
    <section className='px-pad py-16'>
      <div className='mx-auto max-w-4xl'>
        <Eyebrow withLine className='mb-6'>Portfolio</Eyebrow>
        <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4'>
          {artworks.map((src, index) => (
            <div key={src} className='aspect-square overflow-hidden'>
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
