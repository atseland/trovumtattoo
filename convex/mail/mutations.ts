import { mutation, internalMutation } from '../_generated/server'
import { v } from 'convex/values'

function normalizeAddress(value: string) {
  return value.trim().toLowerCase()
}

function normalizeSubject(value: string) {
  return value.replace(/^(re:\s*)+/i, '').trim().toLowerCase()
}

function messageDedupKey(message: {
  direction: string
  from: string
  subject: string
  bodyText?: string
  receivedAt?: number
  sentAt?: number
}) {
  return [
    message.direction,
    normalizeAddress(message.from),
    normalizeSubject(message.subject),
    message.receivedAt ?? '',
    message.sentAt ?? '',
    (message.bodyText ?? '').trim(),
  ].join('::')
}

function threadGroupKey(thread: { subject: string; participants: string[] }) {
  const participants = Array.from(new Set(thread.participants.map(normalizeAddress))).sort().join('|')
  return `${normalizeSubject(thread.subject)}::${participants}`
}

export const upsertThread = internalMutation({
  args: {
    externalThreadId: v.string(),
    subject: v.string(),
    participants: v.array(v.string()),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('mailThreads')
      .withIndex('by_externalThreadId', (q) => q.eq('externalThreadId', args.externalThreadId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        subject: args.subject,
        participants: args.participants,
        lastMessageAt: args.lastMessageAt,
        unreadCount: args.unreadCount,
      })
      return existing._id
    }

    return await ctx.db.insert('mailThreads', {
      externalThreadId: args.externalThreadId,
      subject: args.subject,
      participants: args.participants,
      lastMessageAt: args.lastMessageAt,
      unreadCount: args.unreadCount,
      status: 'active',
    })
  },
})

export const updateThread = internalMutation({
  args: {
    threadId: v.id('mailThreads'),
    subject: v.optional(v.string()),
    participants: v.optional(v.array(v.string())),
    lastMessageAt: v.optional(v.number()),
    unreadCount: v.optional(v.number()),
  },
  handler: async (ctx, { threadId, ...fields }) => {
    const patch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) patch[key] = value
    }
    await ctx.db.patch(threadId, patch)
  },
})

export const upsertMessage = internalMutation({
  args: {
    threadId: v.id('mailThreads'),
    externalId: v.string(),
    direction: v.string(),
    from: v.string(),
    to: v.array(v.string()),
    cc: v.optional(v.array(v.string())),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
    isRead: v.boolean(),
  },
  handler: async (ctx, { externalId, ...args }) => {
    const timestampField = args.receivedAt !== undefined ? 'receivedAt' : 'sentAt'
    const timestampValue = args.receivedAt ?? args.sentAt
    const existing = await ctx.db
      .query('mailMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .filter((q) =>
        q.and(
          q.eq(q.field('direction'), args.direction),
          q.eq(q.field('from'), args.from),
          q.eq(q.field('subject'), args.subject),
          timestampValue === undefined
            ? q.eq(q.field('isRead'), args.isRead)
            : q.eq(q.field(timestampField), timestampValue),
        ),
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        to: args.to,
        cc: args.cc,
        bodyText: args.bodyText,
        bodyHtml: args.bodyHtml,
        sentAt: args.sentAt,
        receivedAt: args.receivedAt,
        isRead: args.isRead,
      })
      return existing._id
    }

    void externalId
    return await ctx.db.insert('mailMessages', args)
  },
})

export const markThreadRead = mutation({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { unreadCount: 0 })

    const messages = await ctx.db
      .query('mailMessages')
      .withIndex('by_thread_and_read', (q) => q.eq('threadId', threadId).eq('isRead', false))
      .collect()

    await Promise.all(messages.map((m) => ctx.db.patch(m._id, { isRead: true })))
  },
})

export const linkThread = mutation({
  args: {
    threadId: v.id('mailThreads'),
    linkedClientId: v.optional(v.id('clients')),
    linkedProjectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, { threadId, linkedClientId, linkedProjectId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { linkedClientId, linkedProjectId })
  },
})

export const archiveThread = mutation({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { status: 'archived', unreadCount: 0 })
  },
})

export const restoreThread = mutation({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { status: 'active' })
  },
})

export const permanentlyDeleteThread = mutation({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const messages = await ctx.db
      .query('mailMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .collect()
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)))

    const notifications = await ctx.db.query('notifications').collect()
    await Promise.all(
      notifications
        .filter((notification) => notification.relatedEntityType === 'mailThread' && notification.relatedEntityId === threadId)
        .map((notification) => ctx.db.delete(notification._id)),
    )

    await ctx.db.delete(threadId)
  },
})

export const cleanupDuplicates = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const allThreads = await ctx.db.query('mailThreads').collect()
    let deletedMessages = 0
    let mergedThreads = 0
    let deletedThreads = 0

    const canonicalThreadIds = new Set(allThreads.map((thread) => thread._id))

    for (const thread of allThreads) {
      if (!canonicalThreadIds.has(thread._id)) continue

      const messages = await ctx.db
        .query('mailMessages')
        .withIndex('by_thread', (q) => q.eq('threadId', thread._id))
        .order('asc')
        .collect()

      const seen = new Map<string, (typeof messages)[number]>()
      for (const message of messages) {
        const key = messageDedupKey(message)
        const existing = seen.get(key)

        if (!existing) {
          seen.set(key, message)
          continue
        }

        const preferred = (existing.bodyText?.length ?? 0) >= (message.bodyText?.length ?? 0) ? existing : message
        const duplicate = preferred._id === existing._id ? message : existing

        await ctx.db.patch(preferred._id, {
          to: preferred.to.length >= duplicate.to.length ? preferred.to : duplicate.to,
          cc: preferred.cc ?? duplicate.cc,
          bodyText: (preferred.bodyText?.length ?? 0) >= (duplicate.bodyText?.length ?? 0)
            ? preferred.bodyText
            : duplicate.bodyText,
          bodyHtml: preferred.bodyHtml ?? duplicate.bodyHtml,
          sentAt: preferred.sentAt ?? duplicate.sentAt,
          receivedAt: preferred.receivedAt ?? duplicate.receivedAt,
          isRead: preferred.isRead && duplicate.isRead,
        })

        await ctx.db.delete(duplicate._id)
        deletedMessages++
        seen.set(key, preferred)
      }
    }

    const refreshedThreads = await ctx.db.query('mailThreads').collect()
    const groupedThreads = new Map<string, typeof refreshedThreads>()

    for (const thread of refreshedThreads) {
      const key = threadGroupKey(thread)
      const group = groupedThreads.get(key) ?? []
      group.push(thread)
      groupedThreads.set(key, group)
    }

    for (const threads of groupedThreads.values()) {
      if (threads.length < 2) continue

      const canonical = [...threads].sort((a, b) => {
        const aStartsWithRe = /^re:/i.test(a.subject)
        const bStartsWithRe = /^re:/i.test(b.subject)
        if (aStartsWithRe !== bStartsWithRe) return aStartsWithRe ? 1 : -1
        return a.lastMessageAt - b.lastMessageAt
      })[0]

      const duplicates = threads.filter((thread) => thread._id !== canonical._id)
      const canonicalMessages = await ctx.db
        .query('mailMessages')
        .withIndex('by_thread', (q) => q.eq('threadId', canonical._id))
        .order('asc')
        .collect()
      const seenMessageKeys = new Set(canonicalMessages.map(messageDedupKey))

      for (const duplicate of duplicates) {
        const duplicateMessages = await ctx.db
          .query('mailMessages')
          .withIndex('by_thread', (q) => q.eq('threadId', duplicate._id))
          .order('asc')
          .collect()

        for (const message of duplicateMessages) {
          const key = messageDedupKey(message)
          if (seenMessageKeys.has(key)) {
            await ctx.db.delete(message._id)
            deletedMessages++
            continue
          }

          await ctx.db.patch(message._id, { threadId: canonical._id })
          seenMessageKeys.add(key)
        }

        await ctx.db.patch(canonical._id, {
          subject: /^re:/i.test(canonical.subject) && !/^re:/i.test(duplicate.subject) ? duplicate.subject : canonical.subject,
          participants: Array.from(
            new Set([...canonical.participants, ...duplicate.participants].map((value) => value.trim()).filter(Boolean)),
          ),
          linkedClientId: canonical.linkedClientId ?? duplicate.linkedClientId,
          linkedProjectId: canonical.linkedProjectId ?? duplicate.linkedProjectId,
          lastMessageAt: Math.max(canonical.lastMessageAt, duplicate.lastMessageAt),
          unreadCount: Math.max(canonical.unreadCount, duplicate.unreadCount),
          status: canonical.status === 'active' || duplicate.status === 'active' ? 'active' : canonical.status,
        })

        await ctx.db.delete(duplicate._id)
        canonicalThreadIds.delete(duplicate._id)
        mergedThreads++
        deletedThreads++
      }
    }

    return {
      deletedMessages,
      deletedThreads,
      mergedThreads,
    }
  },
})
