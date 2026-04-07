const actionLabels: Record<string, string> = {
  created: 'Forespørsel opprettet',
  status_changed: 'Status endret',
  note_added: 'Notat lagt til',
}

function formatTs(ts: number) {
  return new Date(ts).toLocaleString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface LogEntry {
  _id: string
  action: string
  payload?: { from?: string; to?: string; note?: string } | null
  createdAt: number
}

export function ActivityLogTimeline({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return <p className='font-sans text-[13px] text-mast-left'>Ingen aktivitet ennå.</p>
  }

  return (
    <div className='flex flex-col gap-4'>
      {entries.map((entry) => (
        <div key={entry._id} className='flex gap-3'>
          <div
            className='w-[8px] h-[8px] shrink-0 mt-[5px]'
            style={{ background: 'var(--accent)', borderRadius: '50%' }}
          />
          <div className='flex-1'>
            <p className='font-sans text-[13px] text-paper mb-[2px]'>
              {actionLabels[entry.action] ?? entry.action}
              {entry.payload?.from && entry.payload?.to && (
                <span className='text-mast-left'>
                  {': '}
                  <span className='line-through'>{entry.payload.from}</span>
                  {' → '}
                  {entry.payload.to}
                </span>
              )}
            </p>
            {entry.payload?.note && (
              <p className='font-sans text-[12px] text-mast-left italic'>{entry.payload.note}</p>
            )}
            <p className='font-sans text-[11px] text-mast-left mt-[2px]'>{formatTs(entry.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
