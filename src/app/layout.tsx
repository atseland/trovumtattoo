import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
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
    apple: '/icons/icon-192.svg',
  },
  themeColor: '#0d0c0b',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang='no' suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} min-h-screen bg-background text-foreground antialiased`}>
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
