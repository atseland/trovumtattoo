'use client'

import { Btn } from '@/components/ui/Btn'
import { InputField } from '@/components/ui/FormField'

interface ProjectEstimateSectionProps {
  estimate: string
  saving: boolean
  dirty: boolean
  onEstimateChange: (value: string) => void
  onSave: () => void
}

export function ProjectEstimateSection({
  estimate,
  saving,
  dirty,
  onEstimateChange,
  onSave,
}: ProjectEstimateSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-4'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav'>Estimat</h2>
        <span className='font-sans text-[10px] tracking-[0.1em] uppercase text-mast-left'>
          {saving ? 'Lagrer' : dirty ? 'Ulagret' : 'Lagret'}
        </span>
      </div>
      <div className='flex gap-3 items-end'>
        <InputField
          wrapperClassName='flex-1'
          label='Beløp (NOK)'
          type='number'
          value={estimate}
          onChange={(e) => onEstimateChange(e.target.value)}
          placeholder='F.eks. 4500'
        />
        <Btn variant='sm' onClick={onSave} disabled={saving}>
          {saving ? 'Lagrer…' : 'Lagre'}
        </Btn>
      </div>
    </div>
  )
}
