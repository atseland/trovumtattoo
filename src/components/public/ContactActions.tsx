'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { Btn } from '@/components/ui/Btn'

const contactEmail = 'kontakt@trovumtattoo.no'
const instagramDirectMessageUrl = 'https://www.instagram.com/m/trovumtattoo/'

export function ContactActions() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  function scheduleReset() {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setCopyState('idle'), 5000)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    scheduleReset()
  }

  return (
    <div className='flex flex-col gap-3'>
      <Btn href={`mailto:${contactEmail}`} variant='action-cta'>
        Send e-post
      </Btn>
      <button
        type='button'
        onClick={copyEmail}
        className='flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-2 border border-[rgba(237,233,230,0.14)] bg-transparent px-5 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-paper transition-[background,border-color,transform,color] duration-[250ms] hover:-translate-y-px hover:border-[rgba(237,233,230,0.30)] hover:bg-[rgba(237,233,230,0.04)]'
        style={copyState === 'copied' ? { borderColor: 'rgba(122, 168, 126, 0.42)', color: '#9fc69f' } : undefined}
        aria-live='polite'
      >
        {copyState === 'copied' && <Check size={15} strokeWidth={2.2} aria-hidden='true' />}
        {copyState === 'copied'
          ? 'E-post er kopiert'
          : copyState === 'error'
            ? 'Kunne ikke kopiere'
            : 'Kopier e-postadresse'}
      </button>
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
