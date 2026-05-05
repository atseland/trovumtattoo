import ConvexClientProvider from '@/components/ConvexClientProvider'
import { PublicChrome } from '@/components/public/PublicChrome'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <PublicChrome>{children}</PublicChrome>
    </ConvexClientProvider>
  )
}
