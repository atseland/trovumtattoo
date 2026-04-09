'use client'

import { useEffect, useState } from 'react'
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

export function useProjectDetailForm(project: ProjectDetailFormProject | null | undefined) {
  const updateProject = useMutation(api.projects.update)

  const [estimate, setEstimate] = useState('')
  const [savingEstimate, setSavingEstimate] = useState(false)

  const [depositAmount, setDepositAmount] = useState('')
  const [depositStatus, setDepositStatus] = useState('pending')
  const [paymentLink, setPaymentLink] = useState('')
  const [paymentNote, setPaymentNote] = useState('')
  const [savingDeposit, setSavingDeposit] = useState(false)

  const [invoiceReference, setInvoiceReference] = useState('')
  const [accountingStatus, setAccountingStatus] = useState('')
  const [savingAccounting, setSavingAccounting] = useState(false)

  useEffect(() => {
    if (!project) return

    setEstimate(toInputValue(project.estimatedPrice))
    setDepositAmount(toInputValue(project.depositAmount))
    setDepositStatus(project.depositStatus ?? 'pending')
    setPaymentLink(project.paymentLink ?? '')
    setPaymentNote(project.paymentNote ?? '')
    setInvoiceReference(project.invoiceReference ?? '')
    setAccountingStatus(project.accountingStatus ?? '')
  }, [project])

  async function saveEstimate() {
    if (!project) return

    setSavingEstimate(true)
    try {
      await updateProject({
        id: project._id,
        estimatedPrice: estimate ? parseFloat(estimate) : undefined,
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
        depositAmount: depositAmount ? parseFloat(depositAmount) : undefined,
        depositStatus: depositStatus || undefined,
        paymentLink: paymentLink || undefined,
        paymentNote: paymentNote || undefined,
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
        invoiceReference: invoiceReference || undefined,
        accountingStatus: accountingStatus || undefined,
      })
      toast.success('Conta-data lagret')
    } catch {
      toast.error('Kunne ikke lagre')
    } finally {
      setSavingAccounting(false)
    }
  }

  return {
    estimate,
    setEstimate,
    savingEstimate,
    saveEstimate,
    depositAmount,
    setDepositAmount,
    depositStatus,
    setDepositStatus,
    paymentLink,
    setPaymentLink,
    paymentNote,
    setPaymentNote,
    savingDeposit,
    saveDeposit,
    invoiceReference,
    setInvoiceReference,
    accountingStatus,
    setAccountingStatus,
    savingAccounting,
    saveAccounting,
  }
}
