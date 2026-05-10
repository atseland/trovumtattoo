'use client'

import { useState } from 'react'
import { Btn } from '@/components/ui/Btn'

const contactEmail = 'kontakt@trovumtattoo.no'
const instagramDirectMessageUrl = 'https://www.instagram.com/m/trovumtattoo/'

export function ContactActions() {
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopyMessage('E-postadressen er kopiert.')
    } catch {
      setCopyMessage(`Kopier manuelt: ${contactEmail}`)
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <Btn href={`mailto:${contactEmail}`} variant='action-cta'>
        Send e-post
      </Btn>
      <button
        type='button'
        onClick={copyEmail}
        className='flex min-h-[50px] w-full cursor-pointer items-center justify-center border border-[rgba(237,233,230,0.14)] bg-transparent px-5 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-paper transition-[background,border-color,transform] duration-[250ms] hover:-translate-y-px hover:border-[rgba(237,233,230,0.30)] hover:bg-[rgba(237,233,230,0.04)]'
      >
        Kopier e-postadresse
      </button>
      {copyMessage && (
        <p className='font-sans text-[12px] leading-[1.6] text-mast-left' role='status'>
          {copyMessage}
        </p>
      )}
      <Btn
        href={instagramDirectMessageUrl}
        variant='action'
        target='_blank'
        rel='noopener noreferrer'
      >
        Send melding på Instagram
      </Btn>
      <Btn href='/book' variant='action'>
        Bookingforespørsel
      </Btn>
    </div>
  )
}
