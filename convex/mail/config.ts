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

export interface MailConfigSummary {
  emailAddress: string
  fromName: string
  hostImap: string
  portImap: number
  hostSmtp: string
  portSmtp: number
}

function parseFromName(from: string, fallbackEmail: string) {
  const match = from.match(/^(.*)<[^>]+>$/)
  const name = match?.[1]?.trim()
  return name && name.length > 0 ? name.replace(/^"|"$/g, '') : fallbackEmail
}

function getFixedHosts() {
  return {
    hostImap: process.env.MAIL_HOST_IMAP ?? 'imap.one.com',
    portImap: parseInt(process.env.MAIL_PORT_IMAP ?? '993', 10),
    hostSmtp: process.env.MAIL_HOST_SMTP ?? 'send.one.com',
    portSmtp: parseInt(process.env.MAIL_PORT_SMTP ?? '465', 10),
  }
}

export function hasMailConfig() {
  return Boolean(process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD)
}

export function getMailConfigSummary(): MailConfigSummary {
  const emailAddress = requireEnv('MAIL_USERNAME')
  const from = process.env.MAIL_FROM ?? emailAddress
  const fixed = getFixedHosts()

  return {
    emailAddress,
    fromName: parseFromName(from, emailAddress),
    hostImap: fixed.hostImap,
    portImap: fixed.portImap,
    hostSmtp: fixed.hostSmtp,
    portSmtp: fixed.portSmtp,
  }
}

export function getMailConfig(): MailConfig {
  const username = requireEnv('MAIL_USERNAME')
  const password = requireEnv('MAIL_PASSWORD')
  const from = process.env.MAIL_FROM ?? username
  const fixed = getFixedHosts()

  return {
    imap: {
      host: fixed.hostImap,
      port: fixed.portImap,
      secure: true,
      auth: { user: username, pass: password },
    },
    smtp: {
      host: fixed.hostSmtp,
      port: fixed.portSmtp,
      secure: true,
      auth: { user: username, pass: password },
    },
    from,
  }
}
