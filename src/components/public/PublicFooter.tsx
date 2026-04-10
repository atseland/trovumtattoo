import Link from 'next/link'
import { Logo } from '@/components/Logo'

export function PublicFooter() {
  return (
    <footer className='border-t border-rule bg-bg'>
      <div className='px-5 py-8 md:py-12 lg:px-12'>
        <div className='mx-auto max-w-3xl'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <Logo context='footer' />

            <div className='flex gap-4 sm:gap-6'>
              <Link
                href='https://instagram.com/trovumtattoo'
                target='_blank'
                rel='noopener noreferrer'
                className='font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper sm:text-[13px]'
              >
                @trovumtattoo
              </Link>
              <a
                href='mailto:kontakt@trovum.no'
                className='font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper sm:text-[13px]'
              >
                kontakt@trovum.no
              </a>
            </div>
          </div>

          <p className='mt-6 font-sans text-[10px] tracking-wide text-footer-label sm:mt-8 sm:text-[11px]'>
            {`© ${new Date().getFullYear()} Trovum Tattoo — Sandvika`}
          </p>
        </div>
      </div>
    </footer>
  )
}
