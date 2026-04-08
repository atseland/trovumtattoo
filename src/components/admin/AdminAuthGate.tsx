'use client'

import type { ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (!isLoaded || isLoading) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[220px]' />
        <Skeleton className='h-[88px]' />
        <Skeleton className='h-[140px]' />
      </div>
    )
  }

  if (isSignedIn && !isAuthenticated) {
    return (
      <div className='max-w-2xl border border-[rgba(212,130,112,0.35)] bg-[rgba(212,130,112,0.08)] px-5 py-5'>
        <div className='mb-3 flex items-center gap-3 text-paper'>
          <AlertTriangle size={18} strokeWidth={1.8} />
          <h1 className='font-sans text-[16px] font-medium'>Admin-data kunne ikke autentiseres</h1>
        </div>

        <div className='space-y-3 font-sans text-[14px] leading-[1.6] text-body'>
          <p>
            Clerk-sessionen er aktiv, men Convex fikk ikke hentet en gyldig JWT for admin-data.
          </p>
          <p>
            Sjekk at Clerk-instansen har en JWT-template med navnet <code>convex</code>, og at
            <code> CLERK_JWT_ISSUER_DOMAIN</code> matcher issuer-domenet for samme instans.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
