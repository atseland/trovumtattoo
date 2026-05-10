import type { Metadata, Viewport } from 'next'
import { EB_Garamond, IBM_Plex_Sans, Jost } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { absoluteUrl, siteName, siteUrl } from '@/lib/seo'

const ebGaramond = EB_Garamond({
  variable: '--font-garamond',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-plex',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Dark art tattoo i Sandvika`,
    template: `%s`,
  },
  description:
    'Custom dark art, blackwork, black and grey og semi realistic tatoveringer hos Trovum Tattoo ved Tigr Tattoo i Sandvika.',
  applicationName: siteName,
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Trovum',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: { url: '/logo.png', type: 'image/png' },
    apple: '/icons/icon-192.svg',
  },
  openGraph: {
    title: `${siteName} | Dark art tattoo i Sandvika`,
    description:
      'Custom dark art, blackwork, black and grey og semi realistic tatoveringer hos Trovum Tattoo ved Tigr Tattoo i Sandvika.',
    url: siteUrl,
    siteName,
    locale: 'nb_NO',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Dark art tattoo i Sandvika`,
    description:
      'Custom dark art, blackwork, black and grey og semi realistic tatoveringer hos Trovum Tattoo ved Tigr Tattoo i Sandvika.',
    images: [absoluteUrl('/og-image.jpg')],
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0b09',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='no' suppressHydrationWarning>
      <body className={`${ebGaramond.variable} ${ibmPlexSans.variable} ${jost.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster richColors />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  )
}
