'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { LinkThreadSheet } from '@/components/admin/LinkThreadSheet'
import {
  ThreadMessagesSection,
  ThreadReplyComposer,
} from '@/components/admin/mail-thread/ThreadDetailSections'
import { useThreadReplyComposer } from '@/components/admin/mail-thread/useThreadReplyComposer'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const router = useRouter()
  const { isAuthenticated } = useConvexAuth()
  const [linkSheetOpen, setLinkSheetOpen] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const restoreThread = useMutation(api.mail.mutations.restoreThread)
  const permanentlyDeleteThread = useMutation(api.mail.mutations.permanentlyDeleteThread)

  const thread = useQuery(api.mail.queries.getThread, isAuthenticated ? { threadId: threadId as Id<"mailThreads"> } : 'skip')
  const messages = useQuery(api.mail.queries.listMessages, isAuthenticated ? { threadId: threadId as Id<"mailThreads"> } : 'skip')
  const templates = useQuery(api.templates.list, isAuthenticated ? {} : 'skip')
  const replyComposer = useThreadReplyComposer({
    isAuthenticated,
    threadId: threadId as Id<'mailThreads'>,
    thread,
    templates,
  })

  if (!isAuthenticated || thread === undefined) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[160px]' />
        <Skeleton className='h-[40px]' />
        <Skeleton className='h-[100px]' />
        <Skeleton className='h-[100px]' />
      </div>
    )
  }

  if (!thread) {
    return (
      <div className='max-w-2xl'>
        <p className='font-sans text-[13px] text-[#af8c87]'>Tråd ikke funnet.</p>
      </div>
    )
  }

  async function handleRestore() {
    try {
      await restoreThread({ threadId: threadId as Id<'mailThreads'> })
      setDeletePending(false)
      toast.success('Mail gjenopprettet')
    } catch {
      toast.error('Kunne ikke gjenopprette mail')
    }
  }

  async function handleDelete() {
    if (!deletePending) {
      setDeletePending(true)
      return
    }

    try {
      await permanentlyDeleteThread({ threadId: threadId as Id<'mailThreads'> })
      toast.success('Mail slettet permanent')
      router.push('/admin/mail?view=archive')
    } catch {
      toast.error('Kunne ikke slette mail permanent')
    }
  }

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-5'>
        <Link href='/admin/mail' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline'>
          ← Innboks
        </Link>
        <div className='flex flex-wrap gap-2'>
          {thread.status === 'archived' && (
            <>
              <Btn variant='sm' onClick={handleRestore}>Gjenopprett</Btn>
              <Btn variant='sm' onClick={handleDelete}>{deletePending ? 'Bekreft slett' : 'Slett permanent'}</Btn>
              {deletePending && <Btn variant='sm' onClick={() => setDeletePending(false)}>Avbryt</Btn>}
            </>
          )}
          <Btn variant='sm' onClick={() => setLinkSheetOpen(true)}>Koble til kunde</Btn>
        </div>
      </div>

      <h1 className='font-serif italic text-[clamp(18px,2.5vw,24px)] text-paper leading-[1.1] tracking-[-0.02em] mb-1'>
        {thread.subject}
      </h1>
      <p className='font-sans text-[12px] text-mast-left mb-6'>{thread.participants.join(', ')}</p>

      <Rule className='mb-6' />

      <ThreadMessagesSection messages={messages} />

      <LinkThreadSheet open={linkSheetOpen} onOpenChange={setLinkSheetOpen} threadId={threadId as Id<"mailThreads">} />

      <ThreadReplyComposer
        templates={templates}
        selectedTemplate={replyComposer.selectedTemplate}
        replyBody={replyComposer.replyBody}
        sending={replyComposer.sending}
        onTemplateChange={replyComposer.applyTemplate}
        onReplyBodyChange={replyComposer.setReplyBody}
        onSend={replyComposer.handleSend}
      />
    </div>
  )
}
