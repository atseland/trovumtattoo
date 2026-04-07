'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/admin/StatusBadge'

const ghostInput: React.CSSProperties = {
  background: 'rgba(237,233,230,0.03)',
  border: '1px solid rgba(237,233,230,0.14)',
}

export default function SearchPage() {
  const { isAuthenticated } = useConvexAuth()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    startTransition(() => {
      setDebouncedQuery(val)
    })
  }

  const hasQuery = debouncedQuery.trim().length >= 2

  const clients = useQuery(
    api.clients.list,
    isAuthenticated && hasQuery ? { searchQuery: debouncedQuery } : 'skip',
  )

  const inquiries = useQuery(
    api.inquiries.list,
    isAuthenticated && hasQuery ? {} : 'skip',
  )

  const filteredInquiries =
    hasQuery && Array.isArray(inquiries)
      ? (inquiries as any[]).filter(
          (i) =>
            i.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            i.email.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : []

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Søk</h1>

      <input
        type='search'
        value={query}
        onChange={handleChange}
        placeholder='Søk etter kunder, forespørsler…'
        autoFocus
        className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-5 min-h-[52px] outline-none transition-colors duration-[200ms] mb-7'
        style={ghostInput}
        onFocus={e => {
          e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
          e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
          e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
        }}
      />

      {!hasQuery && (
        <p className='font-sans text-[13px] text-mast-left'>Skriv minst 2 tegn for å søke.</p>
      )}

      {hasQuery && (
        <>
          {/* Clients */}
          <section className='mb-8'>
            <h2 className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>Kunder</h2>

            {clients === undefined ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[52px]' />
                <Skeleton className='h-[52px]' />
              </div>
            ) : (clients as any[]).length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen kunder funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {(clients as any[]).map((c) => (
                  <Link
                    key={c._id}
                    href={`/admin/clients/${c._id}`}
                    className='flex flex-col gap-[2px] px-4 py-[14px] bg-panel border border-rule min-h-[52px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline'
                  >
                    <span className='font-sans font-medium text-[14px] text-paper'>{c.name}</span>
                    <span className='font-sans text-[12px] text-mast-left'>{c.email}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Inquiries */}
          <section>
            <h2 className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>Forespørsler</h2>

            {inquiries === undefined ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[52px]' />
                <Skeleton className='h-[52px]' />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen forespørsler funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {filteredInquiries.map((i: any) => (
                  <Link
                    key={i._id}
                    href={`/admin/inquiries/${i._id}`}
                    className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[52px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
                  >
                    <div>
                      <p className='font-sans font-medium text-[14px] text-paper'>{i.name}</p>
                      <p className='font-sans text-[12px] text-mast-left'>{i.email}</p>
                    </div>
                    <StatusBadge status={i.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
