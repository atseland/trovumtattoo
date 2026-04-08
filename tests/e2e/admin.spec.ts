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

if (!convexUrl) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL must be available to run admin e2e tests')
}

if (!adminEmail) {
  throw new Error('E2E_CLERK_USER_EMAIL must be set to run admin e2e tests')
}

const convex = new ConvexHttpClient(convexUrl, { logger: false })

async function createInquiry() {
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

test.beforeAll(async () => {
  await clerkSetup()
})

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

test('admin can create client and project from a public inquiry', async ({ page }) => {
  const inquiry = await createInquiry()

  await page.goto('/')
  await clerk.loaded({ page })
  await clerk.signIn({ page, emailAddress: adminEmail })

  const convexTemplate = await getConvexTemplateStatus(page)
  test.skip(
    !convexTemplate.ok,
    `Clerk JWT template "convex" mangler eller er feil konfigurert: ${convexTemplate.reason}`,
  )

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
})
