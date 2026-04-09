'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

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
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
        <h1 className='font-sans font-medium text-[18px] text-paper'>Kunder</h1>
      </div>

      {/* Search */}
      <div className='mb-5'>
        <input
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Søk på navn…'
          className='w-full max-w-[400px] font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
          style={{
            background: 'rgba(237,233,230,0.03)',
            border: '1px solid rgba(237,233,230,0.14)',
          }}
          onFocus={e => {
            e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
            e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
          }}
          onBlur={e => {
            e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
            e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
          }}
        />
      </div>

      {/* List */}
      {clients === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-[60px]' />)}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users size={48} strokeWidth={1.5} />}
          title='Ingen kunder ennå'
          text={search ? 'Ingen kunder matcher søket.' : 'Kunder opprettes fra forespørsler.'}
          action={search ? { label: 'Nullstill søk', onClick: () => setSearch('') } : undefined}
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {clients.map((client) => (
            <Link
              key={client._id}
              href={`/admin/clients/${client._id}`}
              className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[60px] transition-colors duration-[200ms] hover:bg-[rgba(237,233,230,0.02)] flex-wrap no-underline'
            >
              <div className='flex-1 min-w-0'>
                <p className='font-sans font-medium text-[14px] text-paper mb-[2px]'>{client.name}</p>
                <p className='font-sans text-[13px] text-body'>
                  {client.email}
                  {client.instagramHandle && ` · ${client.instagramHandle}`}
                </p>
              </div>
              <span className='font-sans text-[12px] text-mast-left shrink-0'>{formatDate(client.updatedAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
