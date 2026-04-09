'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import {
  ClientHeader,
  ClientInfoSection,
  ClientMailThreadsSection,
  ClientProjectsSection,
} from '@/components/admin/client-detail/ClientDetailSections'
import { useClientNotes } from '@/components/admin/client-detail/useClientNotes'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()

  const client = useQuery(api.clients.get, isAuthenticated ? { id: id as Id<"clients"> } : 'skip')
  const projects = useQuery(api.projects.listByClient, isAuthenticated && client ? { clientId: id as Id<"clients"> } : 'skip')
  const mailThreads = useQuery(api.mail.queries.listByClient, isAuthenticated ? { clientId: id as Id<"clients"> } : 'skip')
  const clientNotes = useClientNotes(client)

  if (!isAuthenticated || client === undefined) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[160px]' />
        <Skeleton className='h-[40px]' />
        <Skeleton className='h-[160px]' />
        <Skeleton className='h-[100px]' />
      </div>
    )
  }

  if (!client) {
    return (
      <div className='max-w-2xl'>
        <p className='font-sans text-[13px] text-[#af8c87] mb-4'>Kunden ble ikke funnet.</p>
        <Link href='/admin/clients' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms]'>
          ← Tilbake
        </Link>
      </div>
    )
  }

  return (
    <div className='max-w-2xl'>
      <ClientHeader name={client.name} />
      <ClientInfoSection
        client={client}
        notes={clientNotes.notes}
        savingNotes={clientNotes.savingNotes}
        onNotesChange={clientNotes.setNotes}
        onSaveNotes={clientNotes.saveNotes}
      />
      <ClientMailThreadsSection mailThreads={mailThreads} />
      <ClientProjectsSection projects={projects} />
    </div>
  )
}
