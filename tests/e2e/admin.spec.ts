import fs from 'node:fs'
import path from 'node:path'
import { clerk, clerkSetup } from '@clerk/testing/playwright'
import { ConvexHttpClient } from 'convex/browser'
import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { api } from '../../convex/_generated/api'

function loadLocalEnv() {
  const envFiles = ['.env.local', '.env']
  const loaded: Record<string, string> = {}

  for (const filename of envFiles) {
    const fullPath = path.resolve(process.cwd(), filename)
    if (!fs.existsSync(fullPath)) continue

    for (const line of fs.readFileSync(fullPath, 'utf8').split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue
      const separatorIndex = line.indexOf('=')
      if (separatorIndex === -1) continue

      const key = line.slice(0, separatorIndex)
      const value = line.slice(separatorIndex + 1)
      if (!(key in loaded)) loaded[key] = value
    }
  }

  return loaded
}

const localEnv = loadLocalEnv()
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? localEnv.NEXT_PUBLIC_CONVEX_URL
const adminEmail = process.env.E2E_CLERK_USER_EMAIL ?? localEnv.E2E_CLERK_USER_EMAIL
const canRunAdminE2E = Boolean(convexUrl && adminEmail)

const convex = convexUrl ? new ConvexHttpClient(convexUrl, { logger: false }) : null

async function createInquiry() {
  if (!convex) throw new Error('NEXT_PUBLIC_CONVEX_URL must be available to create e2e inquiries')

  const unique = `Audit ${Date.now()}`
  const email = `aleks+${Date.now()}@example.com`

  const id = await convex.mutation(api.inquiries.create, {
    name: unique,
    email,
    phone: '12345678',
    description: 'Opprettet av Playwright admin-test',
    bodyPlacement: 'Arm',
    size: 'Medium',
    style: 'Fineline',
    budget: '3000-5000',
    desiredTiming: 'Neste måned',
    firstTattoo: true,
    coverUp: false,
    touchUp: false,
    extraNotes: 'Verifiserer inquiry -> client -> project-flyt',
  })

  return { id, name: unique, email }
}

function formatDatetimeLocal(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

async function expectOneVisible(locators: ReturnType<Page['locator']>[]) {
  for (const locator of locators) {
    if (await locator.count()) {
      await expect(locator.first()).toBeVisible()
      return
    }
  }

  throw new Error('Fant ingen forventet runtime-state')
}

test.beforeAll(async () => {
  await clerkSetup()
})

test.skip(
  !canRunAdminE2E,
  'Admin e2e requires NEXT_PUBLIC_CONVEX_URL and E2E_CLERK_USER_EMAIL.',
)

async function getConvexTemplateStatus(page: Page) {
  return await page.evaluate(async () => {
    try {
      const token = await window.Clerk.session?.getToken({ template: 'convex', skipCache: true })
      return { ok: Boolean(token), reason: token ? null : 'Clerk returnerte ingen token for template convex.' }
    } catch (error) {
      const clerkErrors =
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown[] }).errors)
          ? (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors
          : []

      const reason =
        clerkErrors[0]?.longMessage ??
        clerkErrors[0]?.message ??
        (error instanceof Error ? error.message : String(error))

      return { ok: false, reason }
    }
  })
}

async function signInAsAdmin(page: Page) {
  await page.goto('/')
  await clerk.loaded({ page })
  await clerk.signIn({ page, emailAddress: adminEmail })

  const convexTemplate = await getConvexTemplateStatus(page)
  test.skip(
    !convexTemplate.ok,
    `Clerk JWT template "convex" mangler eller er feil konfigurert: ${convexTemplate.reason}`,
  )
}

test('admin can create client and project from a public inquiry', async ({ page }) => {
  const inquiry = await createInquiry()
  const bookingStart = new Date(Date.now() + 48 * 60 * 60 * 1000)
  bookingStart.setMinutes(0, 0, 0)
  const bookingEnd = new Date(bookingStart.getTime() + 2 * 60 * 60 * 1000)

  await signInAsAdmin(page)

  await page.goto(`/admin/inquiries/${inquiry.id}`)
  await expect(page.getByRole('heading', { name: inquiry.name })).toBeVisible()
  await expect(page.getByText(inquiry.email)).toBeVisible()

  await page.getByRole('button', { name: 'Opprett klient' }).click()
  await page.getByRole('button', { name: 'Opprett klient og prosjekt' }).click()

  await expect(page).toHaveURL(/\/admin\/clients\/.+/)
  await expect(page.getByRole('heading', { name: inquiry.name })).toBeVisible()
  await expect(page.getByText(inquiry.email)).toBeVisible()

  const projectLink = page.locator('a[href*="/admin/projects/"]').first()
  await expect(projectLink).toBeVisible()
  await projectLink.click()

  await expect(page).toHaveURL(/\/admin\/projects\/.+/)
  await expect(page.getByRole('link', { name: inquiry.name })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Vis forespørsel →' })).toBeVisible()
  await expect(page.getByText('Ingen bookinger ennå.')).toBeVisible()

  await page.getByRole('button', { name: 'Opprett booking' }).click()
  const bookingDialog = page.getByRole('dialog', { name: 'Ny booking' })
  await expect(bookingDialog.getByRole('heading', { name: 'Ny booking' })).toBeVisible()

  await bookingDialog.locator('input[type="datetime-local"]').first().fill(formatDatetimeLocal(bookingStart))
  await bookingDialog.locator('input[type="datetime-local"]').nth(1).fill(formatDatetimeLocal(bookingEnd))
  await bookingDialog.getByPlaceholder('Valgfrie notater…').fill('Playwright opprettet booking fra prosjektflyt')
  await bookingDialog.getByRole('button', { name: 'Ny booking' }).click()

  await expect(page.getByText('Booking opprettet')).toBeVisible()
  await expect(bookingDialog).not.toBeVisible()
  await expect(page.getByText('Ingen bookinger ennå.')).not.toBeVisible()
  await expect(page.getByText('scheduled')).toBeVisible()

  await page.goto('/admin/mail')
  await expect(page.getByRole('heading', { name: 'Innboks' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Alle' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Uleste' })).toBeVisible()
  await expectOneVisible([
    page.getByText('Ingen e-poster ennå'),
    page.locator('a[href*="/admin/mail/"]'),
  ])

  await page.goto('/admin/notifications')
  await expect(page.getByRole('heading', { name: 'Varsler' })).toBeVisible()
  await expectOneVisible([
    page.getByText('Ingen varsler'),
    page.getByRole('button', { name: 'Merk alle som lest' }),
    page.locator('main > div button').filter({ hasText: /.+/ }),
  ])

  await page.goto('/admin/settings')
  await expect(page.getByRole('heading', { name: 'Innstillinger' })).toBeVisible()
  await expect(page.getByText('Push-varsler', { exact: true })).toBeVisible()
  await expect(page.getByText('Mail-konto', { exact: true })).toBeVisible()
  await expect(page.getByText('Conta', { exact: true })).toBeVisible()
  await expectOneVisible([
    page.getByText('Push-varsler er aktivert'),
    page.getByText('Push-varsler er ikke aktivert'),
  ])
  await expectOneVisible([
    page.getByText('Mail er ikke konfigurert i servermiljoet.'),
    page.getByText('Mailkontoen er laast til serverkonfigurasjon og styres ikke fra admin-UI.'),
  ])
})

test('admin can create edit and delete a message template', async ({ page }) => {
  const unique = `Playwright template ${Date.now()}`
  const updatedTitle = `${unique} oppdatert`
  const initialContent = 'Første versjon av template-innhold.'
  const updatedContent = 'Oppdatert template-innhold fra Playwright.'

  await signInAsAdmin(page)

  await page.goto('/admin/templates')
  await expect(page.getByRole('heading', { name: 'Meldingsmaler' })).toBeVisible()

  await page.getByRole('button', { name: 'Ny mal' }).click()
  await expect(page.getByRole('heading', { name: 'Ny mal' })).toBeVisible()

  await page.getByRole('combobox').selectOption('estimate')
  await page.getByPlaceholder('Mal-tittel').fill(unique)
  await page.getByPlaceholder('Meldingsinnhold…').fill(initialContent)
  await page.getByRole('button', { name: 'Lagre' }).click()

  await expect(page.getByText('Mal opprettet')).toBeVisible()
  const createdCard = page.locator('div.bg-panel').filter({ hasText: unique }).first()
  await expect(createdCard).toBeVisible()
  await expect(createdCard.getByText('Prisestimat')).toBeVisible()
  await expect(createdCard.getByText(initialContent)).toBeVisible()

  await createdCard.getByRole('button', { name: 'Rediger' }).click()
  await expect(page.getByRole('heading', { name: 'Rediger mal' })).toBeVisible()

  await page.getByPlaceholder('Mal-tittel').fill(updatedTitle)
  await page.getByPlaceholder('Meldingsinnhold…').fill(updatedContent)
  await page.getByRole('button', { name: 'Lagre' }).click()

  await expect(page.getByText('Mal oppdatert')).toBeVisible()
  const updatedCard = page.locator('div.bg-panel').filter({ hasText: updatedTitle }).first()
  await expect(updatedCard).toBeVisible()
  await expect(updatedCard.getByText(updatedContent)).toBeVisible()

  await updatedCard.getByRole('button', { name: 'Slett' }).click()
  await expect(page.getByText('Mal slettet')).toBeVisible()
  await expect(updatedCard).not.toBeVisible()
})
