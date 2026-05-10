import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Bookingforespørsel' }).first()).toHaveAttribute('href', '/book')
  await expect(page.getByRole('link', { name: 'Kontakt' }).first()).toHaveAttribute('href', '/kontakt')
  await expect(page.getByRole('link', { name: 'Se Trovum Tattoo på Instagram' })).toHaveAttribute(
    'href',
    'https://instagram.com/trovumtattoo',
  )
  await expect(page.getByRole('link', { name: 'Send melding på Facebook' }).first()).toHaveAttribute(
    'href',
    'https://www.facebook.com/profile.php?id=100090196337976',
  )
  await expect(page.getByRole('link', { name: 'Se Trovum Tattoo på TikTok' })).toHaveAttribute(
    'href',
    'https://www.tiktok.com/@ellenkristinetrovum',
  )
  await expect(page.getByRole('link', { name: 'Send SMS til Trovum Tattoo' })).toHaveAttribute('href', 'sms:97090414')
})

test('public SEO metadata and structured data render', async ({ page, request }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Trovum Tattoo | Dark art, blackwork og black and grey i Sandvika')
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(0)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /custom dark art, blackwork, black and grey og semi realistic tatoveringer/i,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://trovumtattoo.no')

  const localBusinessJson = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(localBusinessJson).toBeTruthy()
  const localBusiness = JSON.parse(localBusinessJson ?? '{}') as {
    '@type': string[]
    name: string
    address: { addressLocality: string }
    geo: { latitude: number; longitude: number }
    containedInPlace: { name: string; hasMap: string }
    makesOffer: unknown[]
  }
  expect(localBusiness['@type']).toContain('LocalBusiness')
  expect(localBusiness['@type']).toContain('TattooParlor')
  expect(localBusiness.name).toBe('Trovum Tattoo')
  expect(localBusiness.address.addressLocality).toBe('Sandvika')
  expect(localBusiness.geo.latitude).toBe(59.8916408)
  expect(localBusiness.geo.longitude).toBe(10.515356)
  expect(localBusiness.containedInPlace.name).toBe('Tigr Tattoo')
  expect(localBusiness.containedInPlace.hasMap).toContain('google.com/maps/place/Tigr+Tattoo')
  expect(localBusiness.makesOffer.length).toBeGreaterThanOrEqual(4)

  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: https://trovumtattoo.no/sitemap.xml')

  const rootManifest = await request.get('/manifest.json')
  expect(rootManifest.status()).toBe(404)

  const sitemap = await request.get('/sitemap.xml')
  const sitemapXml = await sitemap.text()
  expect(sitemapXml).toContain('<loc>https://trovumtattoo.no</loc>')
  expect(sitemapXml).toContain('<loc>https://trovumtattoo.no/book</loc>')
  expect(sitemapXml).toContain('<loc>https://trovumtattoo.no/kontakt</loc>')
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

test('mobile hero keeps work anchor pinned at bottom of first viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const workAnchor = page.getByRole('link', { name: /se arbeider/i })
  await expect(workAnchor).toBeVisible()

  const box = await workAnchor.boundingBox()
  expect(box).toBeTruthy()
  expect(box!.y + box!.height).toBeLessThanOrEqual(844 - 12)
  expect(box!.y).toBeGreaterThan(844 - 96)
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
  await expect(dialog.getByRole('link', { name: 'Se på instagram' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Lukk fullscreen' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('mobile portfolio preview opens as a body-level fullscreen modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.locator('#arbeider').scrollIntoViewIfNeeded()
  const trigger = page.getByRole('button', { name: 'Åpne Blomster i fullscreen' })
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Blomster' })
  await expect(dialog).toBeVisible()

  await expect
    .poll(async () => {
      return dialog.evaluate((node) => node.parentElement === document.body)
    })
    .toBe(true)

  const box = await dialog.boundingBox()
  expect(box).toBeTruthy()
  expect(box!.x).toBe(0)
  expect(box!.y).toBe(0)
  expect(box!.width).toBe(390)
  expect(box!.height).toBeGreaterThanOrEqual(844)
})

test('home page mobile menu exposes informational copy for review', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Åpne meny' }).click()
  const menu = page.getByRole('navigation', { name: 'Mobilmeny' })
  await expect(menu).toBeVisible()
  await expect(menu.getByText('Informasjon til gjennomgang')).toBeVisible()
  await expect(menu.getByText('Kort oversikt over booking, FAQ og etterbehandling før publisering.')).toBeVisible()
  await expect(menu.getByRole('link', { name: /Etterbehandling/ })).toBeVisible()
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
  await expect(page.getByText('Velg kanalen som passer best.')).not.toBeVisible()
  await expect(page.getByRole('main').getByText('kontakt@trovumtattoo.no')).toBeVisible()
  await expect(page.getByRole('main').getByText('+47 970 90 414')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send e-post' })).toHaveAttribute('href', 'mailto:kontakt@trovumtattoo.no')
  const copyButton = page.getByRole('button', { name: 'Kopier e-postadresse' })
  await expect(copyButton).toBeVisible()
  await copyButton.click()
  await expect(page.getByRole('button', { name: 'E-post er kopiert' })).toBeVisible()
  await expect(page.getByText('E-postadressen er kopiert.')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Kopier e-postadresse' })).toBeVisible({ timeout: 6000 })
  await expect(page.getByRole('link', { name: 'Send melding på Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/m/trovumtattoo/')
  await expect(page.getByRole('link', { name: 'Send melding på Facebook' })).toHaveAttribute(
    'href',
    'https://www.facebook.com/profile.php?id=100090196337976',
  )
  await expect(page.getByRole('link', { name: 'Send SMS' })).toHaveAttribute('href', 'sms:97090414')

  await page.goto('/book')
  await expect(page.getByText('Fyll ut skjemaet, så tar jeg kontakt så fort jeg kan (innen 3 virkedager).')).toBeVisible()
  await expect(page.getByText('Dette er en ny tatovering')).toBeVisible()
  await expect(page.getByPlaceholder('000 00 000')).toBeVisible()
  const sizeSelect = page.getByLabel('Størrelse *')
  await expect(sizeSelect).toBeVisible()
  await expect(sizeSelect).toHaveCSS('color-scheme', 'dark')
  await expect(sizeSelect.locator('option').first()).toHaveText('Velg omtrentlig størrelse')
  await expect(page.getByPlaceholder('F.eks. ca 2500 kr')).toBeVisible()
  await expect(page.getByPlaceholder('F.eks. innen 15. juni eller uke 28')).toBeVisible()
  await expect(page.getByText('Last opp bilder her hvis du har referanser.')).toBeVisible()
})

test('booking info page points users to the booking form before price details', async ({ page }) => {
  await page.goto('/booking-info')

  await expect(page.getByRole('heading', { name: 'Slik fungerer bookingen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Booking skjer via bookingforespørsel' })).toBeVisible()
  await expect(page.getByText('For nye prosjekter bruker jeg bookingforespørselen.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send bookingforespørsel' })).toHaveAttribute('href', '/book')
  await expect(page.getByRole('heading', { name: 'Slik estimeres prisen' })).toBeVisible()
  await expect(page.getByText('Type prosjekt: ny tatovering, cover-up eller touch-up.')).toBeVisible()
  await expect(page.getByText('Depositumet trekkes fra totalprisen og er ikke et tillegg.')).toBeVisible()
  await expect(page.getByText('Depositum refunderes ikke ved avlysning.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hva skjer etter at du har sendt inn forespørsel?' })).toBeVisible()
  await expect(page.getByText('Om prosjektet passer, sender jeg et estimat og forslag til datoer.')).toHaveCount(0)
  await expect(page.getByText('Vi diskuterer designet.')).toBeVisible()
  await expect(page.getByText('Vi blir enige og bookingen bekreftes ved innbetaling av depositum.')).toBeVisible()
  await expect(page.getByText('Etter timen får du med et etterbehandlingsskjema som hjelper deg gjennom helningsprosessen.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hva slags prosjekter passer?' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Hva kunden bør sende inn' })).toHaveCount(0)
})

test('faq and aftercare copy use updated contact wording', async ({ page }) => {
  await page.goto('/faq')
  await page.getByRole('button', { name: 'Hvordan booker jeg en tatovering?' }).click()
  await expect(page.getByText('1-3 virkedager')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/m/trovumtattoo/',
  )
  await expect(page.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
    'href',
    'https://www.facebook.com/profile.php?id=100090196337976',
  )
  await expect(page.getByRole('link', { name: '+47 970 90 414' })).toHaveAttribute('href', 'sms:97090414')
  await expect(page.getByRole('link', { name: 'Send melding' })).toHaveAttribute('href', '/kontakt')

  await page.goto('/aftercare')
  await expect(page.getByRole('heading', { name: 'Etterbehandling' })).toBeVisible()
  await expect(page.getByText('Du får med et eget etterbehandlingsskjema etter timen.')).toBeVisible()
  await expect(page.getByText('Dag 1')).not.toBeVisible()
  await expect(page.getByText('Unngå dette under heling')).not.toBeVisible()
  await expect(page.getByRole('link', { name: 'Send melding' })).toHaveAttribute('href', '/kontakt')
})

test('portfolio cards include exact Instagram post links', async ({ page }) => {
  await page.goto('/')

  const expectedUrls = [
    'https://www.instagram.com/reel/DWTdi71jF0x/?igsh=MTZseGpha3B5ZWx4MQ==',
    'https://www.instagram.com/p/DRb3JCEjJ61/?img_index=1&igsh=bGhxb2hnNTZuYzhw',
    'https://www.instagram.com/p/DFFxarVInQG/?igsh=dG1zZW5ydGR6ZTBi',
    'https://www.instagram.com/p/DLW4jpgI8TM/?igsh=MXhsNDYzMTZoYjAzaQ==',
    'https://www.instagram.com/p/DPvsGMLjIKq/?igsh=MWFzYnRjb3B5czFvaA==',
    'https://www.instagram.com/p/DByI9Q0oFCJ/?img_index=1&igsh=MXdybjMyNXQzczNxYQ==',
    'https://www.instagram.com/p/DU2p7I5DF35/?igsh=YnVicTRrYnQxZTJr',
  ]

  const portfolioLinks = page.getByRole('link', { name: 'Se på instagram' })
  await expect(portfolioLinks).toHaveCount(7)
  for (const [index, expectedUrl] of expectedUrls.entries()) {
    await expect(portfolioLinks.nth(index)).toHaveAttribute('href', expectedUrl)
  }
})
