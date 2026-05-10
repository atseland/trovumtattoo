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
  const [savedState, setSavedState] = useState(() => createProjectFormState(project))
  const [savingEstimate, setSavingEstimate] = useState(false)
  const [savingDeposit, setSavingDeposit] = useState(false)
  const [savingAccounting, setSavingAccounting] = useState(false)

  const activeFormState = formState.projectId === projectId ? formState : createProjectFormState(project)
  const activeSavedState = savedState.projectId === projectId ? savedState : activeFormState

  function updateField(field: keyof Omit<typeof activeFormState, 'projectId'>, value: string) {
    setFormState((current) => ({
      ...(current.projectId === projectId ? current : createProjectFormState(project)),
      projectId,
      [field]: value,
    }))
  }

  const estimateDirty = activeFormState.estimate !== activeSavedState.estimate
  const depositDirty =
    activeFormState.depositAmount !== activeSavedState.depositAmount ||
    activeFormState.depositStatus !== activeSavedState.depositStatus ||
    activeFormState.paymentLink !== activeSavedState.paymentLink ||
    activeFormState.paymentNote !== activeSavedState.paymentNote
  const accountingDirty =
    activeFormState.invoiceReference !== activeSavedState.invoiceReference ||
    activeFormState.accountingStatus !== activeSavedState.accountingStatus

  async function saveEstimate() {
    if (!project) return

    setSavingEstimate(true)
    try {
      await updateProject({
        id: project._id,
        estimatedPrice: activeFormState.estimate ? parseFloat(activeFormState.estimate) : undefined,
      })
      setSavedState((current) => ({ ...current, projectId, estimate: activeFormState.estimate }))
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
      setSavedState((current) => ({
        ...current,
        projectId,
        depositAmount: activeFormState.depositAmount,
        depositStatus: activeFormState.depositStatus,
        paymentLink: activeFormState.paymentLink,
        paymentNote: activeFormState.paymentNote,
      }))
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
      setSavedState((current) => ({
        ...current,
        projectId,
        invoiceReference: activeFormState.invoiceReference,
        accountingStatus: activeFormState.accountingStatus,
      }))
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
    estimateDirty,
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
    depositDirty,
    saveDeposit,
    invoiceReference: activeFormState.invoiceReference,
    setInvoiceReference: (value: string) => updateField('invoiceReference', value),
    accountingStatus: activeFormState.accountingStatus,
    setAccountingStatus: (value: string) => updateField('accountingStatus', value),
    savingAccounting,
    accountingDirty,
    saveAccounting,
  }
}
