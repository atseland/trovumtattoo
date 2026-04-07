'use client'

import { useAction } from 'convex/react'
import { toast } from 'sonner'
import { PushSubscriptionManager } from '@/components/admin/PushSubscriptionManager'
import { MailAccountForm } from '@/components/admin/MailAccountForm'
import { api } from '../../../../convex/_generated/api'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

export default function SettingsPage() {
  const syncMail = useAction(api.mail.sync.syncMail)

  async function handleForceSync() {
    try {
      await syncMail({})
      toast.success('Synkronisering startet')
    } catch {
      toast.error('Synkronisering feilet')
    }
  }

  return (
    <div className='max-w-2xl flex flex-col gap-8'>
      <h1 className='font-sans font-medium text-[18px] text-paper'>Innstillinger</h1>

      {/* Push notifications */}
      <section>
        <Eyebrow withLine className='mb-4'>Push-varsler</Eyebrow>
        <div className='bg-panel border border-rule px-5 py-5'>
          <PushSubscriptionManager />
        </div>
      </section>

      <Rule />

      {/* Mail account */}
      <section>
        <Eyebrow withLine className='mb-4'>Mail-konto</Eyebrow>
        <div className='bg-panel border border-rule px-5 py-5 flex flex-col gap-5'>
          <MailAccountForm />
          <div className='border-t border-rule pt-4'>
            <Btn variant='sm' onClick={handleForceSync}>Tving synkronisering</Btn>
          </div>
        </div>
      </section>

      <Rule />

      {/* Conta */}
      <section>
        <Eyebrow withLine className='mb-4'>Conta</Eyebrow>
        <div className='bg-panel border border-rule px-5 py-5 flex flex-col gap-3'>
          <p className='font-sans text-[13px] text-body leading-[1.8] max-w-[48ch]'>
            Conta er regnskapssystemet som brukes for fakturering. Etter at et prosjekt er fullført
            og betalt, registrer fakturanummer fra Conta på prosjektsiden under «Conta-referanse».
            Merk prosjektet som «Fakturert i Conta» for å holde oversikt over hva som er bokført.
          </p>
          <p className='font-sans text-[12px] text-mast-left'>
            Logg inn på <span className='text-accent'>conta.no</span> for å opprette og sende fakturaer.
          </p>
        </div>
      </section>
    </div>
  )
}
