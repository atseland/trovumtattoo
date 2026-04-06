import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className='flex min-h-screen' style={{ background: '#0d0c0b' }}>
      <AdminNav />

      <div className='flex flex-1 flex-col md:overflow-hidden'>
        {/* Sticky header */}
        <header
          className='sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3'
          style={{ background: '#141210', borderColor: '#2a2724', minHeight: '56px' }}
        >
          <span className='text-sm font-medium' style={{ color: '#c9b99a' }}>
            Admin
          </span>
          <UserButton appearance={{ variables: { colorPrimary: '#c9933a' } }} />
        </header>

        {/* Main content — add bottom padding on mobile for nav bar */}
        <main className='flex-1 overflow-auto p-4 pb-20 md:pb-4'>{children}</main>
      </div>
    </div>
  )
}
