'use client'

import { Btn } from '@/components/ui/Btn'
import { InputField } from '@/components/ui/FormField'

interface ProjectAccountingSectionProps {
  invoiceReference: string
  accountingStatus: string
  saving: boolean
  onInvoiceReferenceChange: (value: string) => void
  onAccountingStatusChange: (value: string) => void
  onSave: () => void
}

export function ProjectAccountingSection({
  invoiceReference,
  accountingStatus,
  saving,
  onInvoiceReferenceChange,
  onAccountingStatusChange,
  onSave,
}: ProjectAccountingSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-4'>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Conta — regnskap</h2>
      <div className='flex flex-col gap-3'>
        <InputField
          label='Fakturanummer'
          value={invoiceReference}
          onChange={(e) => onInvoiceReferenceChange(e.target.value)}
          placeholder='F.eks. 10042'
        />

        <label className='flex items-center gap-3 cursor-pointer min-h-[44px]'>
          <input
            type='checkbox'
            checked={accountingStatus === 'invoiced'}
            onChange={(e) => onAccountingStatusChange(e.target.checked ? 'invoiced' : '')}
            className='w-[18px] h-[18px] cursor-pointer'
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className='font-sans text-[14px] text-paper'>Fakturert i Conta</span>
        </label>

        <Btn variant='sm' onClick={onSave} disabled={saving}>
          {saving ? 'Lagrer…' : 'Lagre Conta-data'}
        </Btn>
      </div>
    </div>
  )
}
