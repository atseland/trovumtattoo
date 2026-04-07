import Link from 'next/link'
import { Logo } from '@/components/Logo'

export function PublicFooter() {
  return (
    <footer className='border-t border-rule px-pad py-10'>
      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <Logo context='footer' />

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6'>
          <Link
            href='https://instagram.com/trovumtattoo'
            target='_blank'
            rel='noopener noreferrer'
            className='font-sans text-[13px] text-accent border-b border-[rgba(160,148,136,0.18)] no-underline transition-colors duration-[200ms] hover:text-paper w-fit'
          >
            @trovumtattoo
          </Link>
          <a
            href='mailto:kontakt@trovum.no'
            className='font-sans text-[13px] text-accent border-b border-[rgba(160,148,136,0.18)] no-underline transition-colors duration-[200ms] hover:text-paper w-fit'
          >
            kontakt@trovum.no
          </a>
        </div>
      </div>
      <p className='mt-8 font-sans text-[11px] text-footer-label'>
        © {new Date().getFullYear()} Trovum Tattoo
      </p>
    </footer>
  )
}
