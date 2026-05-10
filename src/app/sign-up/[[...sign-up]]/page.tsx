import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Opprett konto | Trovum Tattoo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpPage() {
  notFound()
}
