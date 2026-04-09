'use client'

import { Btn } from '@/components/ui/Btn'
import { InputField, SelectField } from '@/components/ui/FormField'

const depositStatusLabel: Record<string, string> = {
  pending: 'Venter',
  received: 'Mottatt',
  waived: 'Frafalt',
}

interface ProjectDepositSectionProps {
  projectPaymentLink?: string | null
  depositAmount: string
  depositStatus: string
  paymentLink: string
  paymentNote: string
  saving: boolean
  onDepositAmountChange: (value: string) => void
  onDepositStatusChange: (value: string) => void
  onPaymentLinkChange: (value: string) => void
  onPaymentNoteChange: (value: string) => void
  onSave: () => void
}

export function ProjectDepositSection({
  projectPaymentLink,
  depositAmount,
  depositStatus,
  paymentLink,
  paymentNote,
  saving,
  onDepositAmountChange,
  onDepositStatusChange,
  onPaymentLinkChange,
  onPaymentNoteChange,
  onSave,
}: ProjectDepositSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-4'>
      <div className='flex items-center gap-3 mb-4'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav'>Depositum</h2>
        {depositStatus && (
          <span className='font-sans text-[10px] tracking-[0.1em] uppercase text-mast-left'>
            {depositStatusLabel[depositStatus] ?? depositStatus}
          </span>
        )}
      </div>

      <div className='flex flex-col gap-3'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <InputField
            label='Beløp (NOK)'
            type='number'
            value={depositAmount}
            onChange={(e) => onDepositAmountChange(e.target.value)}
            placeholder='F.eks. 1000'
          />
          <SelectField
            label='Status'
            value={depositStatus}
            onChange={(e) => onDepositStatusChange(e.target.value)}
          >
            <option value='pending'>Venter</option>
            <option value='received'>Mottatt</option>
            <option value='waived'>Frafalt</option>
          </SelectField>
        </div>

        <div>
          <InputField
            label='Betalingslenke'
            type='url'
            value={paymentLink}
            onChange={(e) => onPaymentLinkChange(e.target.value)}
            placeholder='https://'
          />
          {projectPaymentLink && (
            <a
              href={projectPaymentLink}
              target='_blank'
              rel='noopener noreferrer'
              className='font-sans text-[12px] text-accent hover:text-paper transition-colors duration-[200ms] no-underline block mt-1'
            >
              Åpne betalingslenke →
            </a>
          )}
        </div>

        <InputField
          label='Betalingsnotat'
          value={paymentNote}
          onChange={(e) => onPaymentNoteChange(e.target.value)}
          placeholder='F.eks. Vipps-referanse'
        />

        <Btn variant='sm' onClick={onSave} disabled={saving}>
          {saving ? 'Lagrer…' : 'Lagre depositum'}
        </Btn>
      </div>
    </div>
  )
}
