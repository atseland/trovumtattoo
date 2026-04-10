export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  name: 'Trovum Tattoo',
  description: 'Custom tatovering i Sandvika. Dark art, blackwork, dark fantasy, black and grey, realisme og semi-realism.',
  url: 'https://trovumtattoo.no',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Elias Smithsvei 27',
    addressLocality: 'Sandvika',
    postalCode: '1337',
    addressCountry: 'NO',
  },
  sameAs: [
    'https://www.instagram.com/trovumtattoo/',
    'https://www.tiktok.com/@ellenkristinetrovum',
  ],
  priceRange: 'Fra 1000 NOK',
}

export const homeArtworks = [
  '/artworks/Art1.png',
  '/artworks/Art2.png',
  '/artworks/Art3.png',
  '/artworks/Art4.png',
  '/artworks/Art5.png',
  '/artworks/Art6.png',
  '/artworks/Art7.png',
]

export const homeSteps = [
  {
    num: '01',
    title: 'Send forespørsel',
    body: 'Fyll ut bookingskjemaet med ideen din, størrelse, plassering og referansebilder.',
  },
  {
    num: '02',
    title: 'Konsultasjon og estimat',
    body: 'Vi gjennomgår forespørselen din og sender et prisestimat og mulige tidspunkter.',
  },
  {
    num: '03',
    title: 'Book og betal depositum',
    body: 'Bekreft time og betal depositum for å sikre plassen din.',
  },
]

export const homeStyles = [
  'Dark art',
  'Blackwork',
  'Realism',
  'Custom design',
  'Dark fantasy',
  'Black & grey',
]
