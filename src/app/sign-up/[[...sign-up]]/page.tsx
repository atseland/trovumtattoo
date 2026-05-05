import type { Metadata } from 'next'
import { ClerkProvider, SignUp } from '@clerk/nextjs'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Opprett konto | Trovum Tattoo',
}

export default function SignUpPage() {
  return (
    <ClerkProvider>
      <main className='flex min-h-screen items-center justify-center bg-bg px-4 py-10'>
        <div className='flex w-full max-w-[420px] flex-col items-center gap-8'>
          <Logo context='nav' />
          <SignUp
            routing='path'
            path='/sign-up'
            signInUrl='/sign-in'
            fallbackRedirectUrl='/admin'
            appearance={{
              variables: {
                colorPrimary: '#ede9e6',
                colorBackground: '#14110f',
                colorText: '#ede9e6',
                colorTextSecondary: '#a89f97',
                colorInputBackground: '#191512',
                colorInputText: '#ede9e6',
                borderRadius: '2px',
              },
            }}
          />
        </div>
      </main>
    </ClerkProvider>
  )
}
