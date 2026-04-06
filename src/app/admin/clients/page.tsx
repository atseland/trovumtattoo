'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ClientsPage() {
  const { isAuthenticated } = useConvexAuth()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const clients = useQuery(
    api.clients.list,
    isAuthenticated ? { searchQuery: debouncedSearch || undefined } : 'skip'
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className='text-xl font-medium' style={{ color: '#c9b99a' }}>Kunder</h1>
        <button
          style={{
            padding: '8px 16px',
            background: '#c9933a',
            color: '#0d0c0b',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            minHeight: '40px',
          }}
        >
          Ny kunde
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Søk på navn…'
          style={{
            width: '100%',
            maxWidth: '400px',
            background: '#1c1916',
            border: '1px solid #2a2724',
            borderRadius: '4px',
            color: '#c9b99a',
            padding: '10px 14px',
            fontSize: '0.9rem',
            minHeight: '44px',
            outline: 'none',
          }}
        />
      </div>

      {/* List */}
      {clients === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : clients.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ color: '#7a6e62' }}>
            {search ? 'Ingen kunder matcher søket.' : 'Ingen kunder ennå. Kunder opprettes fra forespørsler.'}
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {(clients as any[]).map((client) => (
            <Link
              key={client._id}
              href={`/admin/clients/${client._id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: '#1c1916',
                border: '1px solid #2a2724',
                borderRadius: '6px',
                textDecoration: 'none',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#c9b99a', fontWeight: '500', fontSize: '0.95rem', marginBottom: '2px' }}>
                  {client.name}
                </p>
                <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>
                  {client.email}
                  {client.instagramHandle && ` · ${client.instagramHandle}`}
                </p>
              </div>
              <span style={{ color: '#7a6e62', fontSize: '0.75rem', flexShrink: 0 }}>
                {formatDate(client.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
