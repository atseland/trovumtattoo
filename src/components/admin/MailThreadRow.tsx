'use client'

import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useRouter } from 'next/navigation'

interface MailThreadRowProps {
  thread: {
    _id: string
    subject: string
    participants: string[]
    lastMessageAt: number
    unreadCount: number
  }
  mode: 'active' | 'archived'
  onArchive: (threadId: string) => void
  onRestore: (threadId: string) => void
  onDelete: (threadId: string) => void
}

function formatDate(ts: number) {
  const diff = Date.now() - ts
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}t`
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short' })
}

export function MailThreadRow({ thread, mode, onArchive, onRestore, onDelete }: MailThreadRowProps) {
  const router = useRouter()
  const startX = useRef<number | null>(null)
  const dragged = useRef(false)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX
    dragged.current = false
    setDragging(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return
    const delta = event.clientX - startX.current
    if (delta < -8) dragged.current = true
    setOffset(Math.max(-88, Math.min(0, delta)))
  }

  function handlePointerUp() {
    const shouldOpen = offset < -56
    startX.current = null
    setDragging(false)
    setOffset(shouldOpen ? -88 : 0)
  }

  function openThread() {
    if (dragged.current) {
      dragged.current = false
      return
    }
    router.push(`/admin/mail/${thread._id}`)
  }

  return (
    <div className='relative overflow-hidden border border-rule bg-panel'>
      <div className='absolute inset-y-0 right-0 flex w-[88px] items-stretch'>
        {mode === 'active' ? (
          <button
            type='button'
            onClick={() => onArchive(thread._id)}
            className='w-full bg-transparent font-sans text-[8.5px] uppercase tracking-[0.12em]'
            style={{ color: '#af8c87', borderLeft: '1px solid rgba(175,140,135,0.25)' }}
          >
            Slett
          </button>
        ) : (
          <button
            type='button'
            onClick={() => onDelete(thread._id)}
            className='w-full bg-transparent font-sans text-[8.5px] uppercase tracking-[0.12em]'
            style={{ color: '#af8c87', borderLeft: '1px solid rgba(175,140,135,0.25)' }}
          >
            Slett
          </button>
        )}
      </div>

      <div
        role='link'
        tabIndex={0}
        onClick={openThread}
        onKeyDown={(event) => {
          if (event.key === 'Enter') router.push(`/admin/mail/${thread._id}`)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          startX.current = null
          setDragging(false)
          setOffset(0)
        }}
        className='relative flex min-h-[64px] cursor-pointer touch-pan-y flex-wrap items-center justify-between gap-3 bg-panel px-4 py-[14px] transition-colors duration-[200ms] hover:bg-[rgba(237,233,230,0.02)]'
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 160ms ease',
          ...(thread.unreadCount > 0 && mode === 'active' ? { borderLeft: '2px solid var(--accent)' } : {}),
        }}
      >
        <div className='min-w-0 flex-1'>
          <p className={`mb-[2px] truncate font-sans text-[14px] ${thread.unreadCount > 0 ? 'font-medium text-paper' : 'text-body'}`}>
            {thread.subject}
          </p>
          <p className='truncate font-sans text-[12px] text-mast-left'>{thread.participants.join(', ')}</p>
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          {thread.unreadCount > 0 && mode === 'active' && (
            <span
              className='px-[6px] py-[2px] font-sans text-[9px] uppercase tracking-[0.08em]'
              style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '2px' }}
            >
              {thread.unreadCount}
            </span>
          )}
          <span className='font-sans text-[12px] text-mast-left'>{formatDate(thread.lastMessageAt)}</span>
        </div>
        <div className='basis-full sm:basis-auto sm:pl-2'>
          {mode === 'archived' && (
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation()
                onRestore(thread._id)
              }}
              className='min-h-[34px] border border-rule bg-transparent px-3 font-sans text-[8.5px] uppercase tracking-[0.12em] text-nav transition-colors duration-[200ms] hover:text-paper'
            >
              Gjenopprett
            </button>
          )}
          <button
            type='button'
            onClick={(event) => {
              event.stopPropagation()
              if (mode === 'active') onArchive(thread._id)
              else onDelete(thread._id)
            }}
            className='ml-2 min-h-[34px] border bg-transparent px-3 font-sans text-[8.5px] uppercase tracking-[0.12em]'
            style={{ borderColor: 'rgba(175,140,135,0.3)', color: '#af8c87' }}
          >
            {mode === 'active' ? 'Arkiver' : 'Slett permanent'}
          </button>
        </div>
      </div>
    </div>
  )
}
