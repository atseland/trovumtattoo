type Context = 'nav' | 'footer' | 'hero-watermark'

interface LogoProps {
  context: Context
}

const filter = 'invert(93%) sepia(5%) saturate(200%) hue-rotate(340deg) brightness(95%)'

export function Logo({ context }: LogoProps) {
  if (context === 'nav') {
    return (
      <picture>
        <source srcSet='/logo.webp' type='image/webp' />
        <img
          src='/logo.png'
          alt='Trovum Tattoo'
          className='h-8 md:h-9 w-auto'
          style={{ opacity: 0.92, filter, transform: 'translateX(-10px)' }}
        />
      </picture>
    )
  }

  if (context === 'footer') {
    return (
      <picture>
        <source srcSet='/logo.webp' type='image/webp' />
        <img
          src='/logo.png'
          alt='Trovum Tattoo'
          className='h-9 w-auto'
          style={{ opacity: 0.35, filter }}
        />
      </picture>
    )
  }

  // hero-watermark
  return (
    <picture>
      <source srcSet='/logo.webp' type='image/webp' />
      <img
        src='/logo.png'
        alt=''
        aria-hidden='true'
        className='w-[300px] md:w-[clamp(360px,44vw,560px)] h-auto'
        style={{ opacity: 0.07, filter, pointerEvents: 'none' }}
      />
    </picture>
  )
}
