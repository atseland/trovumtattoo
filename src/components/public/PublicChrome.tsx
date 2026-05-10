'use client'

import { PublicFooter } from '@/components/public/PublicFooter'
import { PublicHeader } from '@/components/public/PublicHeader'

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-bg'>
      <PublicHeader />
      <main className='flex-1' style={{ animation: 'fade-in 0.4s ease-out both' }}>{children}</main>
      <PublicFooter />
    </div>
  )
}
