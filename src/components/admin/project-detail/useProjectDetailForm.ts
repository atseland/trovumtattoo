'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

interface ProjectDetailFormProject {
  _id: Id<'projects'>
  estimatedPrice?: number | null
  depositAmount?: number | null
  depositStatus?: string | null
  paymentLink?: string | null
  paymentNote?: string | null
  invoiceReference?: string | null
  accountingStatus?: string | null
}

function toInputValue(value?: number | string | null) {
  return value === undefined || value === null ? '' : String(value)
}

function createProjectFormState(project: ProjectDetailFormProject | null | undefined) {
  return {
    projectId: project?._id ?? null,
    estimate: toInputValue(project?.estimatedPrice),
    depositAmount: toInputValue(project?.depositAmount),
    depositStatus: project?.depositStatus ?? 'pending',
    paymentLink: project?.paymentLink ?? '',
    paymentNote: project?.paymentNote ?? '',
    invoiceReference: project?.invoiceReference ?? '',
    accountingStatus: project?.accountingStatus ?? '',
  }
}

export function useProjectDetailForm(project: ProjectDetailFormProject | null | undefined) {
  const updateProject = useMutation(api.projects.update)
  const projectId = project?._id ?? null

  const [formState, setFormState] = useState(() => createProjectFormState(project))
  const [savingEstimate, setSavingEstimate] = useState(false)
  const [savingDeposit, setSavingDeposit] = useState(false)
  const [savingAccounting, setSavingAccounting] = useState(false)

  let activeFormState = formState
  if (formState.projectId !== projectId) {
    activeFormState = createProjectFormState(project)
    setFormState(activeFormState)
  }

  function updateField(field: keyof Omit<typeof activeFormState, 'projectId'>, value: string) {
    setFormState((current) => ({ ...current, projectId, [field]: value }))
  }

  async function saveEstimate() {
    if (!project) return

    setSavingEstimate(true)
    try {
      await updateProject({
        id: project._id,
        estimatedPrice: activeFormState.estimate ? parseFloat(activeFormState.estimate) : undefined,
      })
      toast.success('Estimat lagret')
    } catch {
      toast.error('Kunne ikke lagre estimat')
    } finally {
      setSavingEstimate(false)
    }
  }

  async function saveDeposit() {
    if (!project) return

    setSavingDeposit(true)
    try {
      await updateProject({
        id: project._id,
        depositAmount: activeFormState.depositAmount ? parseFloat(activeFormState.depositAmount) : undefined,
        depositStatus: activeFormState.depositStatus || undefined,
        paymentLink: activeFormState.paymentLink || undefined,
        paymentNote: activeFormState.paymentNote || undefined,
      })
      toast.success('Depositum lagret')
    } catch {
      toast.error('Kunne ikke lagre depositum')
    } finally {
      setSavingDeposit(false)
    }
  }

  async function saveAccounting() {
    if (!project) return

    setSavingAccounting(true)
    try {
      await updateProject({
        id: project._id,
        invoiceReference: activeFormState.invoiceReference || undefined,
        accountingStatus: activeFormState.accountingStatus || undefined,
      })
      toast.success('Conta-data lagret')
    } catch {
      toast.error('Kunne ikke lagre')
    } finally {
      setSavingAccounting(false)
    }
  }

  return {
    estimate: activeFormState.estimate,
    setEstimate: (value: string) => updateField('estimate', value),
    savingEstimate,
    saveEstimate,
    depositAmount: activeFormState.depositAmount,
    setDepositAmount: (value: string) => updateField('depositAmount', value),
    depositStatus: activeFormState.depositStatus,
    setDepositStatus: (value: string) => updateField('depositStatus', value),
    paymentLink: activeFormState.paymentLink,
    setPaymentLink: (value: string) => updateField('paymentLink', value),
    paymentNote: activeFormState.paymentNote,
    setPaymentNote: (value: string) => updateField('paymentNote', value),
    savingDeposit,
    saveDeposit,
    invoiceReference: activeFormState.invoiceReference,
    setInvoiceReference: (value: string) => updateField('invoiceReference', value),
    accountingStatus: activeFormState.accountingStatus,
    setAccountingStatus: (value: string) => updateField('accountingStatus', value),
    savingAccounting,
    saveAccounting,
  }
}
