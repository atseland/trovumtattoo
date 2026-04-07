'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useAction, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { LinkThreadSheet } from '@/components/admin/LinkThreadSheet'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString('nb-NO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ghostInput: React.CSSProperties = {
  background: 'rgba(237,233,230,0.03)',
  border: '1px solid rgba(237,233,230,0.14)',
}

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [replyBody, setReplyBody] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [sending, setSending] = useState(false)
  const [linkSheetOpen, setLinkSheetOpen] = useState(false)

  const thread = useQuery(api.mail.queries.getThread, isAuthenticated ? { threadId: threadId as Id<"mailThreads"> } : 'skip')
  const messages = useQuery(api.mail.queries.listMessages, isAuthenticated ? { threadId: threadId as Id<"mailThreads"> } : 'skip')
  const templates = useQuery(api.templates.list, isAuthenticated ? {} : 'skip')
  const markRead = useMutation(api.mail.mutations.markThreadRead)
  const sendReply = useAction(api.mail.sendReply.sendReply)

  useEffect(() => {
    if (isAuthenticated && thread && thread.unreadCount > 0) {
      markRead({ threadId: threadId as Id<"mailThreads"> }).catch(() => {})
    }
  }, [isAuthenticated, thread?._id])

  async function handleSend() {
    if (!replyBody.trim() || !thread) return
    setSending(true)
    try {
      await sendReply({
        threadId: threadId as Id<"mailThreads">,
        to: thread.participants,
        subject: `Re: ${thread.subject}`,
        body: replyBody,
      })
      toast.success('Svar sendt')
      setReplyBody('')
    } catch (e) {
      toast.error(`Feil ved sending: ${(e as Error).message}`)
    } finally {
      setSending(false)
    }
  }

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

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-5'>
        <Link href='/admin/mail' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline'>
          ← Innboks
        </Link>
        <Btn variant='sm' onClick={() => setLinkSheetOpen(true)}>Koble til kunde</Btn>
      </div>

      <h1 className='font-serif italic text-[clamp(18px,2.5vw,24px)] text-paper leading-[1.1] tracking-[-0.02em] mb-1'>
        {thread.subject}
      </h1>
      <p className='font-sans text-[12px] text-mast-left mb-6'>{thread.participants.join(', ')}</p>

      <Rule className='mb-6' />

      {/* Messages */}
      <div className='flex flex-col gap-3 mb-7'>
        {messages === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2].map(i => <Skeleton key={i} className='h-[80px]' />)}
          </div>
        ) : (messages as any[]).map((msg) => (
          <div
            key={msg._id}
            className='px-4 py-4 border'
            style={{
              background: msg.direction === 'outbound'
                ? 'rgba(160,148,136,0.05)'
                : 'rgba(237,233,230,0.02)',
              borderColor: msg.direction === 'outbound'
                ? 'rgba(160,148,136,0.18)'
                : 'rgba(237,233,230,0.065)',
              alignSelf: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
            }}
          >
            <div className='flex justify-between gap-3 mb-2 flex-wrap'>
              <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-nav'>
                {msg.direction === 'outbound' ? 'Du' : msg.from}
              </span>
              <span className='font-sans text-[11px] text-mast-left'>
                {formatDateTime(msg.sentAt ?? msg.receivedAt ?? 0)}
              </span>
            </div>
            <p className='font-sans text-[13px] text-body leading-[1.7] whitespace-pre-wrap'>
              {msg.bodyText}
            </p>
          </div>
        ))}
      </div>

      <LinkThreadSheet open={linkSheetOpen} onOpenChange={setLinkSheetOpen} threadId={threadId as Id<"mailThreads">} />

      {/* Reply composer */}
      <div className='bg-panel border border-rule px-5 py-5'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Svar</h2>

        {templates && (templates as any[]).length > 0 && (
          <div className='mb-3 relative'>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value)
                const tpl = (templates as any[]).find((t) => t._id === e.target.value)
                if (tpl) setReplyBody(tpl.content)
              }}
              className='w-full font-sans text-[13px] text-paper px-4 min-h-[44px] outline-none appearance-none transition-colors duration-[200ms] cursor-pointer'
              style={ghostInput}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
              }}
            >
              <option value=''>Velg mal…</option>
              {(templates as any[]).map((tpl) => (
                <option key={tpl._id} value={tpl._id}>{tpl.title}</option>
              ))}
            </select>
            <svg className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' width='12' height='8' viewBox='0 0 12 8' fill='none'>
              <path d='M1 1l5 5 5-5' stroke='var(--nav)' strokeWidth='1.5' strokeLinecap='square'/>
            </svg>
          </div>
        )}

        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder='Skriv svar…'
          rows={4}
          className='w-full font-sans text-[13px] text-paper placeholder:text-mast-left px-4 py-3 outline-none resize-vertical transition-colors duration-[200ms] mb-3'
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

        <Btn
          variant='action-primary'
          onClick={handleSend}
          disabled={sending || !replyBody.trim()}
        >
          {sending ? 'Sender…' : 'Send svar'}
        </Btn>
      </div>
    </div>
  )
}
