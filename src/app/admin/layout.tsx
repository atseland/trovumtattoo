import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { AdminNotificationButton } from '@/components/admin/AdminNotificationButton'
import { AdminServiceWorkerRegistration } from '@/components/admin/AdminServiceWorkerRegistration'
import { AuthenticatedConvexClientProvider } from '@/components/ConvexClientProvider'
import { ADMIN_PWA_MANIFEST_PATH } from '@/lib/admin/pwa'

export const metadata: Metadata = {
  title: 'Admin | Trovum Tattoo',
  applicationName: 'Trovum Tattoo Admin',
  manifest: ADMIN_PWA_MANIFEST_PATH,
  appleWebApp: {
    capable: true,
    title: 'Trovum Admin',
    statusBarStyle: 'black-translucent',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <ClerkProvider>
      <AuthenticatedConvexClientProvider>
        <div className='flex min-h-screen bg-bg'>
          <AdminNav />

          <div className='flex flex-1 flex-col md:overflow-hidden'>
            {/* Sticky header */}
            <header className='sticky top-0 z-40 flex items-center justify-between border-b border-rule bg-panel px-4 py-3 min-h-[56px]'>
              <span className='font-sans text-sm font-medium text-paper'>Admin</span>
              <div className='flex items-center gap-3'>
                <AdminNotificationButton />
                <UserButton appearance={{ variables: { colorPrimary: 'var(--accent)' } }} />
              </div>
            </header>

            {/* Main content - add bottom padding on mobile for nav bar */}
            <main className='flex-1 overflow-auto p-4 pb-20 md:pb-4' style={{ animation: 'fade-in 0.4s ease-out both' }}>
              <AdminAuthGate>{children}</AdminAuthGate>
            </main>
          </div>
        </div>
        <AdminServiceWorkerRegistration />
      </AuthenticatedConvexClientProvider>
    </ClerkProvider>
  )
}
