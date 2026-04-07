import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  inquiries: defineTable({
    status: v.string(), // 'Ny' | 'Trenger mer info' | 'Klar for konsultasjon' | 'Tilbud sendt' | 'Venter på depositum' | 'Booket' | 'Fullført' | 'Avslått'
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    instagramHandle: v.optional(v.string()),
    description: v.string(),
    bodyPlacement: v.string(),
    size: v.string(),
    style: v.string(),
    budget: v.optional(v.string()),
    desiredTiming: v.optional(v.string()),
    firstTattoo: v.boolean(),
    coverUp: v.boolean(),
    touchUp: v.boolean(),
    extraNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  referenceImages: defineTable({
    inquiryId: v.id('inquiries'),
    storageId: v.id('_storage'),
    url: v.string(),
    altText: v.optional(v.string()),
    uploadedAt: v.number(),
  }).index('by_inquiry', ['inquiryId']),

  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .searchIndex('search_clients', {
      searchField: 'name',
      filterFields: ['email'],
    }),

  projects: defineTable({
    clientId: v.id('clients'),
    inquiryId: v.optional(v.id('inquiries')),
    status: v.string(),
    estimatedPrice: v.optional(v.number()),
    internalNotes: v.optional(v.string()),
    depositAmount: v.optional(v.number()),
    depositStatus: v.optional(v.string()), // 'pending' | 'received' | 'waived'
    paymentLink: v.optional(v.string()),
    invoiceReference: v.optional(v.string()),
    accountingStatus: v.optional(v.string()),
    paymentNote: v.optional(v.string()),
    aftercareTemplateId: v.optional(v.id('messageTemplates')),
    aftercareSentAt: v.optional(v.number()),
    reviewRequestedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_client', ['clientId'])
    .index('by_status', ['status'])
    .index('by_updatedAt', ['updatedAt']),

  bookings: defineTable({
    projectId: v.id('projects'),
    startAt: v.number(),
    endAt: v.number(),
    status: v.string(), // 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_startAt', ['startAt']),

  messageTemplates: defineTable({
    type: v.string(), // 'received' | 'needs-info' | 'estimate' | 'timeslot' | 'deposit' | 'confirmation' | 'reminder' | 'aftercare' | 'thank-you' | 'review-request'
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_type', ['type']),

  mailAccounts: defineTable({
    emailAddress: v.string(),
    provider: v.string(), // 'imap-smtp'
    username: v.string(),
    encryptedCredentialRef: v.string(),
    isActive: v.boolean(),
    lastSyncAt: v.optional(v.number()),
  }).index('by_emailAddress', ['emailAddress']),

  mailThreads: defineTable({
    externalThreadId: v.string(),
    subject: v.string(),
    participants: v.array(v.string()),
    linkedClientId: v.optional(v.id('clients')),
    linkedProjectId: v.optional(v.id('projects')),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    status: v.string(), // 'active' | 'archived'
  })
    .index('by_lastMessageAt', ['lastMessageAt'])
    .index('by_client', ['linkedClientId'])
    .index('by_project', ['linkedProjectId'])
    .index('by_externalThreadId', ['externalThreadId']),

  mailMessages: defineTable({
    threadId: v.id('mailThreads'),
    direction: v.string(), // 'inbound' | 'outbound'
    from: v.string(),
    to: v.array(v.string()),
    cc: v.optional(v.array(v.string())),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
    isRead: v.boolean(),
    linkedClientId: v.optional(v.id('clients')),
    linkedProjectId: v.optional(v.id('projects')),
  })
    .index('by_thread', ['threadId'])
    .index('by_thread_and_read', ['threadId', 'isRead']),

  notifications: defineTable({
    type: v.string(), // 'new-inquiry' | 'new-reply' | 'deposit-overdue' | 'booking-tomorrow' | 'booking-today' | 'followup-due'
    title: v.string(),
    body: v.string(),
    relatedEntityType: v.optional(v.string()),
    relatedEntityId: v.optional(v.string()),
    priority: v.string(), // 'high' | 'normal'
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_isRead', ['isRead'])
    .index('by_createdAt', ['createdAt']),

  pushSubscriptions: defineTable({
    endpoint: v.string(),
    keys: v.object({ p256dh: v.string(), auth: v.string() }),
    createdAt: v.number(),
  }).index('by_endpoint', ['endpoint']),

  activityLog: defineTable({
    entityType: v.string(), // 'inquiry' | 'project' | 'client' | 'booking'
    entityId: v.string(),
    action: v.string(),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_entity', ['entityType', 'entityId'])
    .index('by_createdAt', ['createdAt']),
})
