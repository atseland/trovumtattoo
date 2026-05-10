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

test('home page portfolio opens fullscreen preview with keyboard close', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Åpne Blomster i fullscreen' })
  await trigger.focus()
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Blomster' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Realistisk black and grey blomster innrammet med dekor.')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Lukk fullscreen' })).toBeFocused()

  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Neste bilde' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Lukk fullscreen' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('home page mobile menu exposes informational copy for review', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Åpne meny' }).click()
  const menu = page.getByRole('navigation', { name: 'Mobilmeny' })
  await expect(menu).toBeVisible()
  await expect(menu.getByText('Informasjon til gjennomgang')).toBeVisible()
  await expect(menu.getByText('Kort oversikt over booking, FAQ og etterpleie før publisering.')).toBeVisible()
  await expect(menu.getByRole('link', { name: /Etterpleie/ })).toBeVisible()
})

test('contact and booking entrypoints render expected actions', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    })
  })

  await page.goto('/kontakt')
  await expect(page.getByRole('heading', { name: 'Send melding' })).toBeVisible()
  await expect(page.getByRole('main').getByText('kontakt@trovumtattoo.no')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send e-post' })).toHaveAttribute('href', 'mailto:kontakt@trovumtattoo.no')
  const copyButton = page.getByRole('button', { name: 'Kopier e-postadresse' })
  await expect(copyButton).toBeVisible()
  await copyButton.click()
  await expect(page.getByRole('button', { name: 'E-post er kopiert' })).toBeVisible()
  await expect(page.getByText('E-postadressen er kopiert.')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Kopier e-postadresse' })).toBeVisible({ timeout: 6000 })
  await expect(page.getByRole('link', { name: 'Send melding på Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/m/trovumtattoo/')

  await page.goto('/book')
  await expect(page.getByText('Dette er en ny tatovering')).toBeVisible()
  const sizeSelect = page.getByLabel('Størrelse *')
  await expect(sizeSelect).toBeVisible()
  await expect(sizeSelect).toHaveCSS('color-scheme', 'dark')
})
