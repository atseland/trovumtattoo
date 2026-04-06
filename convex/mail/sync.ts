import { action } from '../_generated/server'
import { api } from '../_generated/api'
import { getMailConfig } from './config'

/**
 * syncMail — Convex action som henter e-post fra IMAP og lagrer i Convex.
 * Krever at MAIL_* miljøvariabler er satt (se convex/mail/config.ts).
 *
 * TODO: Installer imapflow via convex package.json eller npm-knytning.
 * npx convex env set MAIL_USERNAME xxx
 */
export const syncMail = action({
  args: {},
  handler: async (ctx) => {
    let config: ReturnType<typeof getMailConfig>
    try {
      config = getMailConfig()
    } catch (e) {
      console.error('[syncMail] Manglende mail-konfigurasjon:', (e as Error).message)
      return { synced: 0, error: (e as Error).message }
    }

    // TODO: Installer imapflow og aktiver koden nedenfor etter `npx convex env set`
    // import { ImapFlow } from 'imapflow'
    // const client = new ImapFlow({ host: config.imap.host, port: config.imap.port, secure: config.imap.secure, auth: config.imap.auth, logger: false })
    // try {
    //   await client.connect()
    //   const lock = await client.getMailboxLock('INBOX')
    //   try {
    //     const messages = []
    //     for await (const msg of client.fetch('1:50', { envelope: true, source: true, flags: true })) {
    //       messages.push(msg)
    //     }
    //     for (const msg of messages) {
    //       const externalId = msg.envelope?.messageId ?? String(msg.seq)
    //       const threadId = await ctx.runMutation(api.mail.mutations.upsertThread, { ... })
    //       await ctx.runMutation(api.mail.mutations.upsertMessage, { ... })
    //     }
    //   } finally { lock.release() }
    //   await client.logout()
    // } catch (e) { console.error('[syncMail]', e) }

    console.log('[syncMail] Placeholder — aktiver imapflow-kode etter konfigurasjon')
    return { synced: 0 }
  },
})
