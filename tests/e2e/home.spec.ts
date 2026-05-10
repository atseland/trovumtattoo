import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Bookingforespørsel' }).first()).toHaveAttribute('href', '/book')
  await expect(page.getByRole('link', { name: 'Send melding' })).toHaveAttribute('href', '/kontakt')
})

test('home page keeps images and layout intact on desktop and mobile', async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    await expect.poll(async () => {
      return page.locator('img').evaluateAll((images) =>
        images.filter((image) => {
          const img = image as HTMLImageElement
          return img.complete && img.naturalWidth > 0
        }).length
      )
    }).toBeGreaterThanOrEqual(7)

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    expect(hasHorizontalOverflow).toBe(false)
  }
})

test('contact and booking entrypoints render expected actions', async ({ page }) => {
  await page.goto('/kontakt')
  await expect(page.getByRole('heading', { name: 'Send melding' })).toBeVisible()
  await expect(page.getByText('kontakt@trovumtattoo.no')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send e-post' })).toHaveAttribute('href', 'mailto:kontakt@trovumtattoo.no')
  await expect(page.getByRole('button', { name: 'Kopier e-postadresse' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send melding på Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/m/trovumtattoo/')

  await page.goto('/book')
  await expect(page.getByText('Dette er en ny tatovering')).toBeVisible()
  const sizeSelect = page.getByLabel('Størrelse *')
  await expect(sizeSelect).toBeVisible()
  await expect(sizeSelect).toHaveCSS('color-scheme', 'dark')
})
