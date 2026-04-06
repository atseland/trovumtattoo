import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'

const navLinks = [
  { href: '/booking-info', label: 'Booking info' },
  { href: '/faq', label: 'FAQ' },
  { href: '/aftercare', label: 'Etterpleie' },
]

export function PublicHeader() {
  return (
    <header className='sticky top-0 z-40 flex items-center justify-between border-b border-rule bg-bg px-pad py-4'>
      <Link href='/'>
        <Logo context='nav' />
      </Link>

      {/* Desktop nav */}
      <nav className='hidden md:flex items-center gap-6'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='font-sans text-[9.5px] tracking-[0.12em] uppercase text-nav transition-colors duration-[200ms] hover:text-paper'
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Btn href='/book' variant='default'>
        Book time
      </Btn>
    </header>
  )
}
