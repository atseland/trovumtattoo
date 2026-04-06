'use client'

import dynamic from 'next/dynamic'

const BookPageClient = dynamic(() => import('./BookPageClient'), { ssr: false })

export default function BookPage() {
  return <BookPageClient />
}
