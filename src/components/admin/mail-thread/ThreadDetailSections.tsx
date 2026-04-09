'use client'

import { SelectField, TextareaField } from '@/components/ui/FormField'
import { Skeleton } from '@/components/ui/Skeleton'
import { Btn } from '@/components/ui/Btn'

function decodeQuotedPrintable(input: string) {
  const normalized = input.replace(/=\r?\n/g, '')
  const bytes: number[] = []

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]
    if (char === '=' && i + 2 < normalized.length) {
      const hex = normalized.slice(i + 1, i + 3)
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(Number.parseInt(hex, 16))
        i += 2
        continue
      }
    }

    bytes.push(char.charCodeAt(0))
  }

  return new TextDecoder().decode(Uint8Array.from(bytes))
}

function extractDisplayBody(bodyText?: string) {
  if (!bodyText) return ''

  const separatorMatch = bodyText.match(/\r?\n\r?\n/)
  if (!separatorMatch || separatorMatch.index === undefined) return bodyText.trim()

  const headerBlock = bodyText.slice(0, separatorMatch.index)
  if (!/^Return-Path:/mi.test(headerBlock) && !/^Content-Type:/mi.test(headerBlock)) {
    return bodyText.trim()
  }

  const plainTextMatch = bodyText.match(
    /Content-Type:\s*text\/plain[\s\S]*?Content-Transfer-Encoding:\s*quoted-printable[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|$)/i,
  )
  if (plainTextMatch?.[1]) {
    return decodeQuotedPrintable(plainTextMatch[1]).trim()
  }

  const body = bodyText.slice(separatorMatch.index + separatorMatch[0].length).trim()
  return body || bodyText.trim()
}

function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface ThreadMessage {
  _id: string
  bodyText?: string
  direction: string
  from: string
  sentAt?: number | null
  receivedAt?: number | null
}

interface ThreadMessagesSectionProps {
  messages: ThreadMessage[] | undefined
}

export function ThreadMessagesSection({ messages }: ThreadMessagesSectionProps) {
  return (
    <div className='flex flex-col gap-3 mb-7'>
      {messages === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2].map((i) => <Skeleton key={i} className='h-[80px]' />)}
        </div>
      ) : messages.map((message) => {
        const displayBody = extractDisplayBody(message.bodyText)

        return (
          <div
            key={message._id}
            className='px-4 py-4 border'
            style={{
              background: message.direction === 'outbound'
                ? 'rgba(160,148,136,0.05)'
                : 'rgba(237,233,230,0.02)',
              borderColor: message.direction === 'outbound'
                ? 'rgba(160,148,136,0.18)'
                : 'rgba(237,233,230,0.065)',
              alignSelf: message.direction === 'outbound' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
            }}
          >
            <div className='flex justify-between gap-3 mb-2 flex-wrap'>
              <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-nav'>
                {message.direction === 'outbound' ? 'Du' : message.from}
              </span>
              <span className='font-sans text-[11px] text-mast-left'>
                {formatDateTime(message.sentAt ?? message.receivedAt ?? 0)}
              </span>
            </div>
            <p className='font-sans text-[13px] text-body leading-[1.7] whitespace-pre-wrap'>
              {displayBody}
            </p>
          </div>
        )
      })}
    </div>
  )
}

interface TemplateSummary {
  _id: string
  title: string
}

interface ThreadReplyComposerProps {
  templates: TemplateSummary[] | undefined
  selectedTemplate: string
  replyBody: string
  sending: boolean
  onTemplateChange: (templateId: string) => void
  onReplyBodyChange: (value: string) => void
  onSend: () => void
}

export function ThreadReplyComposer({
  templates,
  selectedTemplate,
  replyBody,
  sending,
  onTemplateChange,
  onReplyBodyChange,
  onSend,
}: ThreadReplyComposerProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5'>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Svar</h2>

      {templates && templates.length > 0 && (
        <SelectField
          wrapperClassName='mb-3'
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
        >
          <option value=''>Velg mal…</option>
          {templates.map((template) => (
            <option key={template._id} value={template._id}>
              {template.title}
            </option>
          ))}
        </SelectField>
      )}

      <TextareaField
        value={replyBody}
        onChange={(e) => onReplyBodyChange(e.target.value)}
        placeholder='Skriv svar…'
        rows={4}
        className='mb-3 min-h-[120px]'
      />

      <Btn
        variant='action-primary'
        onClick={onSend}
        disabled={sending || !replyBody.trim()}
      >
        {sending ? 'Sender…' : 'Send svar'}
      </Btn>
    </div>
  )
}
