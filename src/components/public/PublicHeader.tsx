'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'

const navLinks = [
  { href: '/booking-info', label: 'Booking info' },
  { href: '/faq', label: 'FAQ' },
  { href: '/aftercare', label: 'Etterpleie' },
]

export function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className='sticky top-0 z-40 border-b border-rule bg-bg'>
      <div className='flex items-center justify-between px-pad py-4'>
        <Link href='/' onClick={() => setOpen(false)}>
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

        <div className='flex items-center gap-3'>
          <Btn href='/book' variant='default'>
            Book time
          </Btn>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Lukk meny' : 'Åpne meny'}
            className='md:hidden flex flex-col justify-center gap-[5px] w-[44px] h-[44px] items-center cursor-pointer'
          >
            <span
              className='block h-px bg-paper transition-all duration-[250ms] origin-center'
              style={{
                width: 18,
                transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className='block h-px bg-paper transition-all duration-[250ms]'
              style={{
                width: 18,
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className='block h-px bg-paper transition-all duration-[250ms] origin-center'
              style={{
                width: 18,
                transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav className='md:hidden border-t border-rule bg-bg px-pad py-5 flex flex-col gap-5'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className='font-sans text-[10px] tracking-[0.16em] uppercase text-nav transition-colors duration-[200ms] hover:text-paper'
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
