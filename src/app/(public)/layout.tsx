import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col' style={{ background: '#0d0c0b' }}>
      <PublicHeader />
      <main className='flex-1'>{children}</main>
      <PublicFooter />
    </div>
  )
}
