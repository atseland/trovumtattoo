'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../../convex/_generated/api'

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString('nb-NO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [replyBody, setReplyBody] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [sending, setSending] = useState(false)

  const thread = useQuery((api as any).mail.queries.getThread, isAuthenticated ? { threadId } : 'skip')
  const messages = useQuery((api as any).mail.queries.listMessages, isAuthenticated ? { threadId } : 'skip')
  const templates = useQuery((api as any).templates.list, isAuthenticated ? {} : 'skip')
  const markRead = useMutation((api as any).mail.mutations.markThreadRead)
  const sendReply = useMutation((api as any).mail.sendReply.sendReply)

  // Mark thread as read on open
  useEffect(() => {
    if (isAuthenticated && thread && thread.unreadCount > 0) {
      markRead({ threadId }).catch(() => {})
    }
  }, [isAuthenticated, thread?._id])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1c1916',
    border: '1px solid #2a2724',
    borderRadius: '4px',
    color: '#c9b99a',
    padding: '10px 14px',
    fontSize: '0.9rem',
    outline: 'none',
  }

  async function handleSend() {
    if (!replyBody.trim() || !thread) return
    setSending(true)
    try {
      await sendReply({
        threadId,
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
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster…</p>
  }
  if (!thread) {
    return <div style={{ padding: '20px' }}><p style={{ color: '#c96b6b' }}>Tråd ikke funnet.</p></div>
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <Link href='/admin/mail' style={{ color: '#7a6e62', fontSize: '0.875rem', textDecoration: 'none' }}>← Innboks</Link>
        {/* Koble til klient/prosjekt implementeres i TASK-034 */}
        <button style={{ padding: '8px 14px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', minHeight: '36px' }}>
          Koble til kunde
        </button>
      </div>

      <h1 style={{ color: '#c9b99a', fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>{thread.subject}</h1>
      <p style={{ color: '#7a6e62', fontSize: '0.8rem', marginBottom: '24px' }}>{thread.participants.join(', ')}</p>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {messages === undefined ? (
          <p style={{ color: '#7a6e62' }}>Laster…</p>
        ) : (messages as any[]).map((msg) => (
          <div
            key={msg._id}
            style={{
              padding: '14px 16px',
              background: msg.direction === 'outbound' ? '#0d1a0d' : '#141210',
              border: '1px solid',
              borderColor: msg.direction === 'outbound' ? '#1a2a1a' : '#2a2724',
              borderRadius: '8px',
              alignSelf: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ color: msg.direction === 'outbound' ? '#4ab97a' : '#7a6e62', fontSize: '0.75rem' }}>
                {msg.direction === 'outbound' ? 'Du' : msg.from}
              </span>
              <span style={{ color: '#7a6e62', fontSize: '0.7rem' }}>
                {formatDateTime(msg.sentAt ?? msg.receivedAt ?? 0)}
              </span>
            </div>
            <p style={{ color: '#c9b99a', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {msg.bodyText}
            </p>
          </div>
        ))}
      </div>

      {/* Reply composer */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '16px' }}>
        <h2 style={{ color: '#c9b99a', fontSize: '0.9rem', marginBottom: '12px' }}>Svar</h2>

        {/* Template picker */}
        {templates && (templates as any[]).length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value)
                const tpl = (templates as any[]).find((t) => t._id === e.target.value)
                if (tpl) setReplyBody(tpl.content)
              }}
              style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }}
            >
              <option value=''>Velg mal…</option>
              {(templates as any[]).map((tpl) => (
                <option key={tpl._id} value={tpl._id}>{tpl.title}</option>
              ))}
            </select>
          </div>
        )}

        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', marginBottom: '10px' }}
          placeholder='Skriv svar…'
        />

        <button
          onClick={handleSend}
          disabled={sending || !replyBody.trim()}
          style={{
            padding: '10px 20px',
            background: sending || !replyBody.trim() ? '#5a4a2a' : '#c9933a',
            color: '#0d0c0b',
            border: 'none',
            borderRadius: '4px',
            cursor: sending || !replyBody.trim() ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            minHeight: '44px',
          }}
        >
          {sending ? 'Sender…' : 'Send svar'}
        </button>
      </div>
    </div>
  )
}
