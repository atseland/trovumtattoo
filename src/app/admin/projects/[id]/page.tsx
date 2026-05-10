'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { ProjectActivitySection } from '@/components/admin/project-detail/ProjectActivitySection'
import { ProjectAccountingSection } from '@/components/admin/project-detail/ProjectAccountingSection'
import { ProjectBookingsSection } from '@/components/admin/project-detail/ProjectBookingsSection'
import { ProjectDepositSection } from '@/components/admin/project-detail/ProjectDepositSection'
import { ProjectEstimateSection } from '@/components/admin/project-detail/ProjectEstimateSection'
import { ProjectHeader } from '@/components/admin/project-detail/ProjectHeader'
import { ProjectQuickActions } from '@/components/admin/project-detail/ProjectQuickActions'
import { ProjectRelationsSection } from '@/components/admin/project-detail/ProjectRelationsSection'
import type { ProjectBookingSummary } from '@/components/admin/project-detail/projectDetailTypes'
import { BookingSheet } from '@/components/admin/BookingSheet'
import { AftercareSheet } from '@/components/admin/AftercareSheet'
import { ReviewRequestSheet } from '@/components/admin/ReviewRequestSheet'
import { useProjectDetailForm } from '@/components/admin/project-detail/useProjectDetailForm'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'

type BookingSheetMode = 'create' | 'edit' | 'rebook'

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
  const [showArchivedBookings, setShowArchivedBookings] = useState(false)
  const bookings = useQuery(
    api.bookings.listByProject,
    isAuthenticated ? { projectId: id as Id<"projects">, archived: showArchivedBookings } : 'skip'
  )

  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)
  const [bookingSheetMode, setBookingSheetMode] = useState<BookingSheetMode>('create')
  const [activeBooking, setActiveBooking] = useState<ProjectBookingSummary | null>(null)
  const [aftercareSheetOpen, setAftercareSheetOpen] = useState(false)
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
  const [pendingDeleteBookingId, setPendingDeleteBookingId] = useState<string | null>(null)
  const updateBooking = useMutation(api.bookings.update)
  const archiveBooking = useMutation(api.bookings.archive)
  const restoreBooking = useMutation(api.bookings.restore)
  const permanentlyDeleteBooking = useMutation(api.bookings.permanentlyDelete)

  const form = useProjectDetailForm(project)

  function openCreateBookingSheet() {
    setActiveBooking(null)
    setBookingSheetMode('create')
    setBookingSheetOpen(true)
  }

  function openEditBookingSheet(booking: ProjectBookingSummary) {
    setActiveBooking(booking)
    setBookingSheetMode('edit')
    setBookingSheetOpen(true)
  }

  function openRebookBookingSheet(booking: ProjectBookingSummary) {
    setActiveBooking(booking)
    setBookingSheetMode('rebook')
    setBookingSheetOpen(true)
  }

  function handleBookingSheetChange(open: boolean) {
    setBookingSheetOpen(open)
    if (!open) {
      setBookingSheetMode('create')
      setActiveBooking(null)
    }
  }

  async function completeBooking(booking: ProjectBookingSummary) {
    try {
      await updateBooking({ id: booking._id as Id<'bookings'>, status: 'completed' })
      toast.success('Booking fullført')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke fullføre booking'
      toast.error(message)
    }
  }

  async function archiveProjectBooking(booking: ProjectBookingSummary) {
    try {
      await archiveBooking({ id: booking._id as Id<'bookings'> })
      toast.success('Booking arkivert')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke arkivere booking'
      toast.error(message)
    }
  }

  async function restoreProjectBooking(booking: ProjectBookingSummary) {
    try {
      await restoreBooking({ id: booking._id as Id<'bookings'> })
      toast.success('Booking gjenopprettet')
    } catch {
      toast.error('Kunne ikke gjenopprette booking')
    }
  }

  async function permanentlyDeleteProjectBooking(booking: ProjectBookingSummary) {
    if (pendingDeleteBookingId !== booking._id) {
      setPendingDeleteBookingId(booking._id)
      return
    }

    try {
      await permanentlyDeleteBooking({ id: booking._id as Id<'bookings'> })
      toast.success('Booking slettet permanent')
      setPendingDeleteBookingId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke slette booking permanent'
      toast.error(message)
    }
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

  return (
    <div className='max-w-2xl'>
      <ProjectHeader
        clientId={project.clientId}
        clientName={client?.name}
        clientEmail={client?.email}
        status={project.status}
      />
      <ProjectQuickActions
        reviewRequestedAt={project.reviewRequestedAt}
        onCreateBooking={openCreateBookingSheet}
        onSendAftercare={() => setAftercareSheetOpen(true)}
        onSendReviewRequest={() => setReviewSheetOpen(true)}
      />

      <Rule className='mb-6' />

      <ProjectRelationsSection client={client} clientId={project.clientId} inquiryId={project.inquiryId} />
      <ProjectEstimateSection
        estimate={form.estimate}
        saving={form.savingEstimate}
        dirty={form.estimateDirty}
        onEstimateChange={form.setEstimate}
        onSave={form.saveEstimate}
      />
      <ProjectDepositSection
        projectPaymentLink={project.paymentLink}
        depositAmount={form.depositAmount}
        depositStatus={form.depositStatus}
        paymentLink={form.paymentLink}
        paymentNote={form.paymentNote}
        saving={form.savingDeposit}
        dirty={form.depositDirty}
        onDepositAmountChange={form.setDepositAmount}
        onDepositStatusChange={form.setDepositStatus}
        onPaymentLinkChange={form.setPaymentLink}
        onPaymentNoteChange={form.setPaymentNote}
        onSave={form.saveDeposit}
      />
      <ProjectAccountingSection
        invoiceReference={form.invoiceReference}
        accountingStatus={form.accountingStatus}
        saving={form.savingAccounting}
        dirty={form.accountingDirty}
        onInvoiceReferenceChange={form.setInvoiceReference}
        onAccountingStatusChange={form.setAccountingStatus}
        onSave={form.saveAccounting}
      />

      <Rule className='mb-6' />

      <ProjectBookingsSection
        bookings={bookings}
        archived={showArchivedBookings}
        onArchivedChange={(archived) => {
          setShowArchivedBookings(archived)
          setPendingDeleteBookingId(null)
        }}
        onEditBooking={openEditBookingSheet}
        onRebookBooking={openRebookBookingSheet}
        onCompleteBooking={completeBooking}
        onArchiveBooking={archiveProjectBooking}
        onRestoreBooking={restoreProjectBooking}
        onPermanentDeleteBooking={permanentlyDeleteProjectBooking}
        onCancelPermanentDeleteBooking={() => setPendingDeleteBookingId(null)}
        pendingDeleteBookingId={pendingDeleteBookingId}
      />
      <ProjectActivitySection entries={activityLog} />

      {bookingSheetOpen && (
        <BookingSheet
          open={bookingSheetOpen}
          onOpenChange={handleBookingSheetChange}
          projectId={id as Id<"projects">}
          existingBookingId={activeBooking?._id}
          existingStartAt={activeBooking?.startAt}
          existingEndAt={activeBooking?.endAt}
          existingNotes={activeBooking?.notes ?? undefined}
          mode={bookingSheetMode}
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
