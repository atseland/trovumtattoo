import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { EB_Garamond, IBM_Plex_Sans, Jost } from 'next/font/google'
import type { CSSProperties } from 'react'
import { Toaster } from 'sonner'
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

type ThemeVars = CSSProperties & Record<`--${string}`, string>

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

const themeVars: ThemeVars = {
  '--bg': '#0d0b09',
  '--panel': '#161412',
  '--paper': '#ede9e6',
  '--body': '#b8b0a8',
  '--nav': '#9a948e',
  '--mast-left': '#8a8078',
  '--mast-right': '#7a7068',
  '--index-num': '#6a6058',
  '--footer-label': '#685850',
  '--accent': '#a09488',
  '--rule': 'rgba(237,233,230,0.065)',
  '--rule-heavy': 'rgba(237,233,230,0.08)',
  '--rule-light': 'rgba(237,233,230,0.04)',
  '--rule-inner': 'rgba(237,233,230,0.07)',
  '--status-new': 'rgba(200, 185, 160, 0.15)',
  '--status-new-text': '#c8b9a0',
  '--status-info': 'rgba(170, 165, 190, 0.12)',
  '--status-info-text': '#aaa5be',
  '--status-offer': 'rgba(180, 170, 140, 0.12)',
  '--status-offer-text': '#b4aa8c',
  '--status-deposit': 'rgba(190, 165, 130, 0.14)',
  '--status-deposit-text': '#bea582',
  '--status-booked': 'rgba(140, 175, 155, 0.12)',
  '--status-booked-text': '#8caf9b',
  '--status-done': 'rgba(130, 165, 145, 0.14)',
  '--status-done-text': '#82a591',
  '--status-rejected': 'rgba(175, 140, 135, 0.12)',
  '--status-rejected-text': '#af8c87',
}

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
        <body
          style={themeVars}
          className={`${ebGaramond.variable} ${ibmPlexSans.variable} ${jost.variable} min-h-screen bg-bg font-sans text-paper antialiased`}
        >
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
