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
          className='h-8 w-auto'
          style={{ opacity: 0.92, filter }}
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
          className='h-8 w-auto'
          style={{ opacity: 0.38, filter }}
        />
      </picture>
    )
  }

  return (
    <picture>
      <source srcSet='/logo.webp' type='image/webp' />
      <img
        src='/logo.png'
        alt=''
        aria-hidden='true'
        className='h-auto w-[220px] md:w-[clamp(300px,36vw,480px)]'
        style={{ opacity: 0.04, filter, pointerEvents: 'none' }}
      />
    </picture>
  )
}
