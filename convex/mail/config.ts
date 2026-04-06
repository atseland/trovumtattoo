/**
 * Mail-konfigurasjon for Trovum Tattoo OS
 *
 * Sett miljøvariabler med:
 *   npx convex env set MAIL_HOST_IMAP imap.one.com
 *   npx convex env set MAIL_PORT_IMAP 993
 *   npx convex env set MAIL_HOST_SMTP send.one.com
 *   npx convex env set MAIL_PORT_SMTP 465
 *   npx convex env set MAIL_USERNAME din@epost.no
 *   npx convex env set MAIL_PASSWORD ditt_passord
 *   npx convex env set MAIL_FROM "Trovum Tattoo <din@epost.no>"
 */

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Manglende miljøvariabel: ${key}. Kjør: npx convex env set ${key} <verdi>`)
  return value
}

export interface MailConfig {
  imap: {
    host: string
    port: number
    secure: boolean
    auth: { user: string; pass: string }
  }
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: { user: string; pass: string }
  }
  from: string
}

export function getMailConfig(): MailConfig {
  const username = requireEnv('MAIL_USERNAME')
  const password = requireEnv('MAIL_PASSWORD')

  return {
    imap: {
      host: process.env.MAIL_HOST_IMAP ?? 'imap.one.com',
      port: parseInt(process.env.MAIL_PORT_IMAP ?? '993', 10),
      secure: true,
      auth: { user: username, pass: password },
    },
    smtp: {
      host: process.env.MAIL_HOST_SMTP ?? 'send.one.com',
      port: parseInt(process.env.MAIL_PORT_SMTP ?? '465', 10),
      secure: true,
      auth: { user: username, pass: password },
    },
    from: requireEnv('MAIL_FROM'),
  }
}
