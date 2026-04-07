import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { EB_Garamond, IBM_Plex_Sans, Jost } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

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
  metadataBase: new URL('https://trovumtattoo.no'),
  title: 'Trovum Tattoo',
  description: 'Book din tatovering hos Trovum',
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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0b09',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang='no' suppressHydrationWarning>
        <body className={`${ebGaramond.variable} ${ibmPlexSans.variable} ${jost.variable} min-h-screen antialiased`}>
          <ThemeProvider>
            <ConvexClientProvider>
              {children}
              <Toaster richColors />
              <ServiceWorkerRegistration />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
