import ConvexClientProvider from '@/components/ConvexClientProvider'
import { PublicChrome } from '@/components/public/PublicChrome'
import { createLocalBusinessJsonLd } from '@/lib/seo'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createLocalBusinessJsonLd()) }}
      />
      <ConvexClientProvider>
        <PublicChrome>{children}</PublicChrome>
      </ConvexClientProvider>
    </>
  )
}
