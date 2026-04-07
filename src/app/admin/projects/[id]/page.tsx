'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'
import { BookingSheet } from '@/components/admin/BookingSheet'
import { AftercareSheet } from '@/components/admin/AftercareSheet'
import { ReviewRequestSheet } from '@/components/admin/ReviewRequestSheet'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

const ghostInput: React.CSSProperties = {
  background: 'rgba(237,233,230,0.03)',
  border: '1px solid rgba(237,233,230,0.14)',
}

const depositStatusLabel: Record<string, string> = {
  pending: 'Venter',
  received: 'Mottatt',
  waived: 'Frafalt',
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()

  const project = useQuery(api.projects.get, isAuthenticated ? { id: id as Id<"projects"> } : 'skip')
  const client = useQuery(
    api.clients.get,
    isAuthenticated && project ? { id: project.clientId } : 'skip'
  )
  const activityLog = useQuery(
    api.activityLog.listByEntity,
    isAuthenticated ? { entityType: 'project', entityId: id as Id<"projects"> } : 'skip'
  )
  const bookings = useQuery(api.bookings.listByProject, isAuthenticated ? { projectId: id as Id<"projects"> } : 'skip')
  const updateProject = useMutation(api.projects.update)

  const [estimate, setEstimate] = useState<string>('')
  const [savingEstimate, setSavingEstimate] = useState(false)
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)
  const [aftercareSheetOpen, setAftercareSheetOpen] = useState(false)
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)

  const [depositAmount, setDepositAmount] = useState<string>('')
  const [depositStatus, setDepositStatus] = useState<string>('pending')
  const [paymentLink, setPaymentLink] = useState<string>('')
  const [paymentNote, setPaymentNote] = useState<string>('')
  const [savingDeposit, setSavingDeposit] = useState(false)

  const [invoiceReference, setInvoiceReference] = useState<string>('')
  const [accountingStatus, setAccountingStatus] = useState<string>('')
  const [savingConta, setSavingConta] = useState(false)

  const [synced, setSynced] = useState(false)
  if (project && !synced) {
    setEstimate(project.estimatedPrice?.toString() ?? '')
    setDepositAmount(project.depositAmount?.toString() ?? '')
    setDepositStatus(project.depositStatus ?? 'pending')
    setPaymentLink(project.paymentLink ?? '')
    setPaymentNote(project.paymentNote ?? '')
    setInvoiceReference(project.invoiceReference ?? '')
    setAccountingStatus(project.accountingStatus ?? '')
    setSynced(true)
  }

  if (!isAuthenticated || project === undefined) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[160px]' />
        <Skeleton className='h-[40px]' />
        <Skeleton className='h-[52px]' />
        <Skeleton className='h-[140px]' />
        <Skeleton className='h-[180px]' />
      </div>
    )
  }

  if (!project) {
    return (
      <div className='max-w-2xl'>
        <p className='font-sans text-[13px] text-[#af8c87] mb-4'>Prosjektet ble ikke funnet.</p>
        <Link href='/admin/clients' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms]'>
          ← Tilbake
        </Link>
      </div>
    )
  }

  async function saveEstimate() {
    setSavingEstimate(true)
    try {
      await updateProject({ id: id as Id<"projects">, estimatedPrice: estimate ? parseFloat(estimate) : undefined })
      toast.success('Estimat lagret')
    } catch {
      toast.error('Kunne ikke lagre estimat')
    } finally {
      setSavingEstimate(false)
    }
  }

  async function saveConta() {
    setSavingConta(true)
    try {
      await updateProject({
        id: id as Id<"projects">,
        invoiceReference: invoiceReference || undefined,
        accountingStatus: accountingStatus || undefined,
      })
      toast.success('Conta-data lagret')
    } catch {
      toast.error('Kunne ikke lagre')
    } finally {
      setSavingConta(false)
    }
  }

  async function saveDeposit() {
    setSavingDeposit(true)
    try {
      await updateProject({
        id: id as Id<"projects">,
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

  return (
    <div className='max-w-2xl'>
      <Link
        href={`/admin/clients/${project.clientId}`}
        className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline block mb-5'
      >
        ← Tilbake til klient
      </Link>

      <div className='flex items-center gap-3 flex-wrap mb-4'>
        <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em]'>
          Prosjekt
        </h1>
        <StatusBadge status={project.status} />
      </div>

      {/* Quick actions */}
      <div className='flex flex-wrap gap-2 mb-6'>
        <Btn variant='sm' onClick={() => setBookingSheetOpen(true)}>Opprett booking</Btn>
        <Btn variant='sm' onClick={() => setAftercareSheetOpen(true)}>Send aftercare</Btn>
        <Btn
          variant='sm'
          onClick={() => setReviewSheetOpen(true)}
          disabled={!!project.reviewRequestedAt}
        >
          {project.reviewRequestedAt ? 'Anmeldelse forespurt' : 'Be om anmeldelse'}
        </Btn>
      </div>

      <Rule className='mb-6' />

      {/* Client + inquiry links */}
      <div className='bg-panel border border-rule px-5 py-4 mb-4 flex flex-col gap-3'>
        {client && (
          <div>
            <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Klient</p>
            <Link href={`/admin/clients/${project.clientId}`} className='font-sans text-[14px] text-paper hover:text-accent transition-colors duration-[200ms] no-underline'>
              {client.name}
            </Link>
          </div>
        )}
        {project.inquiryId && (
          <div>
            <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Forespørsel</p>
            <Link href={`/admin/inquiries/${project.inquiryId}`} className='font-sans text-[14px] text-accent hover:text-paper transition-colors duration-[200ms] no-underline'>
              Vis forespørsel →
            </Link>
          </div>
        )}
      </div>

      {/* Estimate */}
      <div className='bg-panel border border-rule px-5 py-5 mb-4'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Estimat</h2>
        <div className='flex gap-3 items-end'>
          <div className='flex-1'>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Beløp (NOK)</label>
            <input
              type='number'
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
              placeholder='F.eks. 4500'
              className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
              style={ghostInput}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
              }}
            />
          </div>
          <Btn variant='sm' onClick={saveEstimate} disabled={savingEstimate}>
            {savingEstimate ? 'Lagrer…' : 'Lagre'}
          </Btn>
        </div>
      </div>

      {/* Deposit */}
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
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Beløp (NOK)</label>
              <input
                type='number'
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder='F.eks. 1000'
                className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
                style={ghostInput}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
                }}
              />
            </div>
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Status</label>
              <div className='relative'>
                <select
                  value={depositStatus}
                  onChange={(e) => setDepositStatus(e.target.value)}
                  className='w-full font-sans text-[14px] text-paper px-4 min-h-[44px] outline-none appearance-none transition-colors duration-[200ms] cursor-pointer'
                  style={ghostInput}
                >
                  <option value='pending'>Venter</option>
                  <option value='received'>Mottatt</option>
                  <option value='waived'>Frafalt</option>
                </select>
                <svg className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' width='12' height='8' viewBox='0 0 12 8' fill='none'>
                  <path d='M1 1l5 5 5-5' stroke='var(--nav)' strokeWidth='1.5' strokeLinecap='square'/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Betalingslenke</label>
            <input
              type='url'
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder='https://'
              className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
              style={ghostInput}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
              }}
            />
            {project.paymentLink && (
              <a href={project.paymentLink} target='_blank' rel='noopener noreferrer' className='font-sans text-[12px] text-accent hover:text-paper transition-colors duration-[200ms] no-underline block mt-1'>
                Åpne betalingslenke →
              </a>
            )}
          </div>

          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Betalingsnotat</label>
            <input
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder='F.eks. Vipps-referanse'
              className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
              style={ghostInput}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
              }}
            />
          </div>

          <Btn variant='sm' onClick={saveDeposit} disabled={savingDeposit}>
            {savingDeposit ? 'Lagrer…' : 'Lagre depositum'}
          </Btn>
        </div>
      </div>

      {/* Conta */}
      <div className='bg-panel border border-rule px-5 py-5 mb-4'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Conta — regnskap</h2>
        <div className='flex flex-col gap-3'>
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Fakturanummer</label>
            <input
              value={invoiceReference}
              onChange={(e) => setInvoiceReference(e.target.value)}
              placeholder='F.eks. 10042'
              className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
              style={ghostInput}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
              }}
            />
          </div>
          <label className='flex items-center gap-3 cursor-pointer min-h-[44px]'>
            <input
              type='checkbox'
              checked={accountingStatus === 'invoiced'}
              onChange={(e) => setAccountingStatus(e.target.checked ? 'invoiced' : '')}
              className='w-[18px] h-[18px] cursor-pointer'
              style={{ accentColor: 'var(--accent)' }}
            />
            <span className='font-sans text-[14px] text-paper'>Fakturert i Conta</span>
          </label>
          <Btn variant='sm' onClick={saveConta} disabled={savingConta}>
            {savingConta ? 'Lagrer…' : 'Lagre Conta-data'}
          </Btn>
        </div>
      </div>

      <Rule className='mb-6' />

      {/* Bookings */}
      <div className='mb-6'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Bookinger</h2>
        {bookings === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2].map(i => <Skeleton key={i} className='h-[52px]' />)}
          </div>
        ) : bookings.length === 0 ? (
          <p className='font-sans text-[13px] text-mast-left'>Ingen bookinger ennå.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {bookings.map((b) => (
              <div key={b._id} className='flex items-center justify-between flex-wrap gap-2 px-4 py-[14px] bg-panel border border-rule min-h-[52px]'>
                <span className='font-sans text-[13px] text-paper'>
                  {new Date(b.startAt).toLocaleString('nb-NO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} –{' '}
                  {new Date(b.endAt).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-mast-left'>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity log */}
      <div>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Aktivitetslogg</h2>
        {activityLog === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2, 3].map(i => <Skeleton key={i} className='h-[40px]' />)}
          </div>
        ) : (
          <ActivityLogTimeline entries={activityLog ?? []} />
        )}
      </div>

      {bookingSheetOpen && (
        <BookingSheet
          open={bookingSheetOpen}
          onOpenChange={setBookingSheetOpen}
          projectId={id as Id<"projects">}
          mode='create'
        />
      )}

      {aftercareSheetOpen && client && (
        <AftercareSheet
          open={aftercareSheetOpen}
          onOpenChange={setAftercareSheetOpen}
          projectId={id as Id<"projects">}
          clientEmail={client.email}
        />
      )}

      {reviewSheetOpen && client && (
        <ReviewRequestSheet
          open={reviewSheetOpen}
          onOpenChange={setReviewSheetOpen}
          projectId={id as Id<"projects">}
          clientEmail={client.email}
          reviewRequestedAt={project.reviewRequestedAt}
        />
      )}
    </div>
  )
}
