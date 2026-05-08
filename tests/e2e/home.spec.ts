import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Bookingforespørsel' }).first()).toHaveAttribute('href', '/book')
  await expect(page.getByRole('link', { name: 'Send melding' })).toHaveAttribute('href', '/kontakt')
})

test('contact and booking entrypoints render expected actions', async ({ page }) => {
  await page.goto('/kontakt')
  await expect(page.getByRole('heading', { name: 'Send melding' })).toBeVisible()
  await expect(page.getByText('kontakt@trovumtattoo.no')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send e-post' })).toHaveAttribute('href', 'mailto:kontakt@trovumtattoo.no')
  await expect(page.getByRole('button', { name: 'Kopier e-postadresse' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send melding på Instagram' })).toHaveAttribute('href', 'https://instagram.com/trovumtattoo')

  await page.goto('/book')
  await expect(page.getByText('Dette er en ny tatovering')).toBeVisible()
  const sizeSelect = page.getByLabel('Størrelse *')
  await expect(sizeSelect).toBeVisible()
  await expect(sizeSelect).toHaveCSS('color-scheme', 'dark')
})
