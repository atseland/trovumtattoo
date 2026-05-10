export const siteUrl = 'https://trovumtattoo.no'
export const siteName = 'Trovum Tattoo'
export const businessEmail = 'kontakt@trovumtattoo.no'
export const instagramProfileUrl = 'https://instagram.com/trovumtattoo'
export const instagramMessageUrl = 'https://www.instagram.com/m/trovumtattoo/'

export const businessAddress = {
  streetAddress: 'Elias Smiths vei 27',
  postalCode: '1337',
  addressLocality: 'Sandvika',
  addressCountry: 'NO',
}

export const coreServices = [
  'Dark art tattoo',
  'Blackwork tattoo',
  'Black and grey tattoo',
  'Semi realistic tattoo',
  'Custom tattoo design',
]

export const coreServiceLabels = [
  'Dark art',
  'Blackwork',
  'Black and grey',
  'Semi realism',
]

export const publicRoutes = [
  {
    path: '/',
    title: 'Trovum Tattoo | Dark art, blackwork og black and grey i Sandvika',
    description:
      'Trovum Tattoo lager custom dark art, blackwork, black and grey og semi realistic tatoveringer hos Tigr Tattoo i Sandvika.',
    priority: 1,
  },
  {
    path: '/book',
    title: 'Book tatovering | Trovum Tattoo i Sandvika',
    description:
      'Send bookingforespørsel til Trovum Tattoo i Sandvika med motividé, plassering, størrelse og referansebilder.',
    priority: 0.9,
  },
  {
    path: '/booking-info',
    title: 'Bookinginfo | Trovum Tattoo',
    description:
      'Les hvordan booking, prisestimat, depositum og forberedelser fungerer for tatoveringsprosjekter hos Trovum Tattoo.',
    priority: 0.75,
  },
  {
    path: '/faq',
    title: 'Vanlige spørsmål | Trovum Tattoo',
    description:
      'Svar på vanlige spørsmål om booking, priser, depositum, alder, forberedelser og etterbehandling hos Trovum Tattoo.',
    priority: 0.7,
  },
  {
    path: '/aftercare',
    title: 'Etterbehandling av tatovering | Trovum Tattoo',
    description:
      'Konservativ etterbehandlingsguide for ny tatovering med vask, fukt, heling og hva du bør unngå de første ukene.',
    priority: 0.7,
  },
  {
    path: '/kontakt',
    title: 'Kontakt | Trovum Tattoo Sandvika',
    description:
      'Kontakt Trovum Tattoo i Sandvika på e-post eller Instagram, eller send bookingforespørsel for nye tatoveringsprosjekter.',
    priority: 0.8,
  },
  {
    path: '/privacy',
    title: 'Personvernerklæring | Trovum Tattoo',
    description:
      'Personvernerklæring for Trovum Tattoo og behandling av opplysninger i bookingforespørsler.',
    priority: 0.3,
  },
] as const

export function absoluteUrl(path = '/') {
  if (path === '/') return siteUrl
  return `${siteUrl}${path}`
}

export function getPublicRoute(path: (typeof publicRoutes)[number]['path']) {
  return publicRoutes.find((route) => route.path === path)
}

export function createLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TattooParlor'],
    '@id': `${siteUrl}/#localbusiness`,
    name: siteName,
    url: siteUrl,
    image: absoluteUrl('/og-image.jpg'),
    logo: absoluteUrl('/logo.png'),
    email: businessEmail,
    sameAs: [instagramProfileUrl],
    address: {
      '@type': 'PostalAddress',
      ...businessAddress,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Sandvika',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Bærum',
      },
      {
        '@type': 'City',
        name: 'Oslo',
      },
    ],
    knowsAbout: coreServices,
    makesOffer: coreServices.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    })),
    priceRange: '$$',
    description:
      'Trovum Tattoo lager custom tatoveringer innen dark art, blackwork, black and grey og semi realism hos Tigr Tattoo i Sandvika.',
  }
}
