"use node"

import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { v } from 'convex/values'
import nodemailer from 'nodemailer'
import { getMailConfig, type MailConfig } from './config'

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export const sendInquiryConfirmation = action({
  args: { inquiryId: v.id('inquiries') },
  handler: async (ctx, { inquiryId }) => {
    const inquiry = await ctx.runQuery(internal.inquiries.getForConfirmation, { id: inquiryId })
    if (!inquiry) throw new Error('Inquiry not found')

    const now = Date.now()
    const attempt = await ctx.runMutation(internal.inquiries.beginConfirmationEmailAttempt, {
      id: inquiryId,
      now,
    })

    if (attempt.status === 'already_sent') {
      return { sent: false, reason: 'already_sent' as const }
    }
    if (attempt.status === 'rate_limited') {
      return { sent: false, reason: 'rate_limited' as const }
    }

    let config: MailConfig
    try {
      const dbConfig = await ctx.runQuery(internal.mail.account.getConfig, {})
      config = dbConfig ?? getMailConfig()
    } catch (error) {
      const message = errorMessage(error)
      await ctx.runMutation(internal.activityLogMutations.insert, {
        entityType: 'inquiry',
        entityId: inquiryId,
        action: 'confirmation_email_failed',
        payload: { message },
      })
      throw new Error(message)
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    })

    const body = [
      `Hei ${inquiry.name},`,
      '',
      'Vi har mottatt bookingforespørselen din hos Trovum Tattoo.',
      'Du får normalt svar innen 2 virkedager.',
      '',
      'Dette er ikke en bekreftet booking ennå. Tidspunkt og depositum avtales før timen er endelig booket.',
      '',
      'Vennlig hilsen',
      'Trovum Tattoo',
    ].join('\n')

    try {
      await transporter.sendMail({
        from: config.from,
        to: inquiry.email,
        subject: 'Vi har mottatt bookingforespørselen din - Trovum Tattoo',
        text: body,
      })
      await ctx.runMutation(internal.activityLogMutations.insert, {
        entityType: 'inquiry',
        entityId: inquiryId,
        action: 'confirmation_email_sent',
      })
      await ctx.runMutation(internal.inquiries.markConfirmationEmailSent, {
        id: inquiryId,
        now: Date.now(),
      })
      return { sent: true }
    } catch (error) {
      const message = errorMessage(error)
      await ctx.runMutation(internal.activityLogMutations.insert, {
        entityType: 'inquiry',
        entityId: inquiryId,
        action: 'confirmation_email_failed',
        payload: { message },
      })
      throw new Error(message)
    }
  },
})
