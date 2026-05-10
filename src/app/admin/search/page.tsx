'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { fieldInputClasses } from '@/components/ui/FormField'

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString('nb-NO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SearchPage() {
  const { isAuthenticated } = useConvexAuth()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 250)
    return () => window.clearTimeout(timeout)
  }, [query])

  const hasQuery = debouncedQuery.trim().length >= 2

  const clients = useQuery(
    api.clients.list,
    isAuthenticated && hasQuery ? { searchQuery: debouncedQuery } : 'skip',
  )

  const inquiries = useQuery(
    api.inquiries.search,
    isAuthenticated && hasQuery ? { searchQuery: debouncedQuery } : 'skip',
  )

  const projects = useQuery(
    api.projects.searchWithClient,
    isAuthenticated && hasQuery ? { searchQuery: debouncedQuery } : 'skip',
  )

  const bookings = useQuery(
    api.bookings.searchWithDetails,
    isAuthenticated && hasQuery ? { searchQuery: debouncedQuery } : 'skip',
  )

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Søk</h1>

      <input
        type='search'
        value={query}
        onChange={handleChange}
        placeholder='Søk etter kunder, forespørsler, prosjekter og bookinger...'
        autoFocus
        className={`${fieldInputClasses} px-5 min-h-[52px] mb-7`}
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
            ) : clients.length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen kunder funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {clients.map((c) => (
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
          <section className='mb-8'>
            <h2 className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>Forespørsler</h2>

            {inquiries === undefined ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[52px]' />
                <Skeleton className='h-[52px]' />
              </div>
            ) : inquiries.length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen forespørsler funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {inquiries.map((i) => (
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

          <section className='mb-8'>
            <h2 className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>Prosjekter</h2>

            {projects === undefined ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[60px]' />
                <Skeleton className='h-[60px]' />
              </div>
            ) : projects.length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen prosjekter funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/admin/projects/${project._id}`}
                    className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[60px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
                  >
                    <div className='min-w-0'>
                      <p className='font-sans font-medium text-[14px] text-paper'>
                        {project.client?.name ?? 'Ukjent kunde'}
                      </p>
                      <p className='font-sans text-[12px] text-mast-left truncate'>
                        {project.client?.email ?? 'Ingen e-post'}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>Bookinger</h2>

            {bookings === undefined ? (
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-[60px]' />
                <Skeleton className='h-[60px]' />
              </div>
            ) : bookings.length === 0 ? (
              <p className='font-sans text-[13px] text-mast-left'>Ingen bookinger funnet.</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    href={`/admin/projects/${booking.projectId}`}
                    className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[60px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
                  >
                    <div className='min-w-0'>
                      <p className='font-sans font-medium text-[14px] text-paper'>
                        {booking.client?.name ?? 'Ukjent kunde'}
                      </p>
                      <p className='font-sans text-[12px] text-mast-left'>
                        {formatDateTime(booking.startAt)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
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
