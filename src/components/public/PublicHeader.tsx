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
      <div className='flex h-14 items-center justify-between px-pad md:h-16'>
        <Link href='/' onClick={() => setOpen(false)} className='shrink-0'>
          <Logo context='nav' />
        </Link>

        <nav className='hidden items-center gap-7 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='font-sans text-[11px] tracking-[0.13em] uppercase text-nav transition-colors duration-200 hover:text-paper'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex shrink-0 items-center gap-3'>
          <Btn href='/book' variant='default' className='hidden sm:inline-flex'>
            Bookingforespørsel
          </Btn>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={open}
            aria-controls='public-mobile-nav'
            className='flex h-10 w-10 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] md:hidden'
          >
            <span
              className='block h-px origin-center bg-paper transition-all duration-[250ms]'
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
              className='block h-px origin-center bg-paper transition-all duration-[250ms]'
              style={{
                width: 18,
                transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id='public-mobile-nav'
          className='flex flex-col border-t border-rule bg-bg px-pad py-5 md:hidden'
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className='border-b border-rule-light py-3.5 font-sans text-[12px] tracking-[0.12em] uppercase text-nav transition-colors duration-200 last:border-b-0 hover:text-paper'
            >
              {link.label}
            </Link>
          ))}
          <div className='pt-4'>
            <Btn href='/book' variant='action-cta' className='w-full'>
              Bookingforespørsel
            </Btn>
          </div>
        </nav>
      )}
    </header>
  )
}
