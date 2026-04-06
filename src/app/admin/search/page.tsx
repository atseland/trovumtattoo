'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

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
    (api as any).clients.list,
    isAuthenticated && hasQuery ? { search: debouncedQuery } : 'skip',
  )

  const inquiries = useQuery(
    (api as any).inquiries.list,
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
    <div style={{ maxWidth: '680px' }}>
      <h1 className='text-xl font-medium mb-6' style={{ color: '#c9b99a' }}>
        Søk
      </h1>

      <input
        type='search'
        value={query}
        onChange={handleChange}
        placeholder='Søk etter kunder, forespørsler…'
        autoFocus
        style={{
          width: '100%',
          background: '#1c1916',
          border: '1px solid #2a2724',
          borderRadius: '6px',
          color: '#c9b99a',
          padding: '14px 18px',
          fontSize: '1rem',
          minHeight: '52px',
          outline: 'none',
          marginBottom: '28px',
        }}
      />

      {!hasQuery && (
        <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>
          Skriv minst 2 tegn for å søke.
        </p>
      )}

      {hasQuery && (
        <>
          {/* Clients */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                color: '#7a6e62',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Kunder
            </h2>

            {clients === undefined ? (
              <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Søker…</p>
            ) : (clients as any[]).length === 0 ? (
              <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen kunder funnet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(clients as any[]).map((c) => (
                  <Link
                    key={c._id}
                    href={`/admin/clients/${c._id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '12px 14px',
                      background: '#141210',
                      border: '1px solid #2a2724',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: '#c9b99a', fontWeight: '500', fontSize: '0.9rem' }}>
                      {c.name}
                    </span>
                    <span style={{ color: '#7a6e62', fontSize: '0.8rem' }}>{c.email}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Inquiries */}
          <section>
            <h2
              style={{
                color: '#7a6e62',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Forespørsler
            </h2>

            {inquiries === undefined ? (
              <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Søker…</p>
            ) : filteredInquiries.length === 0 ? (
              <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen forespørsler funnet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredInquiries.map((i: any) => (
                  <Link
                    key={i._id}
                    href={`/admin/inquiries/${i._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 14px',
                      background: '#141210',
                      border: '1px solid #2a2724',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <p style={{ color: '#c9b99a', fontWeight: '500', fontSize: '0.9rem' }}>
                        {i.name}
                      </p>
                      <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>{i.email}</p>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#7a6e62',
                        background: '#1c1916',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {i.status}
                    </span>
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
