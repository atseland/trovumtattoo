'use client'

import { useEffect, useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

interface ThreadSummary {
  _id: Id<'mailThreads'>
  unreadCount: number
  participants: string[]
  subject: string
}

interface TemplateSummary {
  _id: string
  title: string
  content: string
}

interface UseThreadReplyComposerOptions {
  isAuthenticated: boolean
  threadId: Id<'mailThreads'>
  thread: ThreadSummary | null | undefined
  templates: TemplateSummary[] | undefined
}

export function useThreadReplyComposer({
  isAuthenticated,
  threadId,
  thread,
  templates,
}: UseThreadReplyComposerOptions) {
  const [replyBody, setReplyBody] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [sending, setSending] = useState(false)

  const markRead = useMutation(api.mail.mutations.markThreadRead)
  const sendReply = useAction(api.mail.sendReply.sendReply)

  useEffect(() => {
    if (!isAuthenticated || !thread || thread.unreadCount <= 0) return

    void markRead({ threadId }).catch(() => {
      toast.error('Kunne ikke markere tråden som lest')
    })
  }, [isAuthenticated, markRead, thread, threadId])

  function applyTemplate(templateId: string) {
    setSelectedTemplate(templateId)
    const template = templates?.find((item) => item._id === templateId)
    if (template) setReplyBody(template.content)
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
      setSelectedTemplate('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ukjent feil'
      toast.error(`Feil ved sending: ${message}`)
    } finally {
      setSending(false)
    }
  }

  return {
    replyBody,
    selectedTemplate,
    sending,
    setReplyBody,
    applyTemplate,
    handleSend,
  }
}
