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
    return <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen aktivitet ennå.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {entries.map((entry) => (
        <div key={entry._id} style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#c9933a',
              flexShrink: 0,
              marginTop: '5px',
            }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#c9b99a', fontSize: '0.875rem', marginBottom: '2px' }}>
              {actionLabels[entry.action] ?? entry.action}
              {entry.payload?.from && entry.payload?.to && (
                <span style={{ color: '#7a6e62' }}>
                  {': '}
                  <span style={{ textDecoration: 'line-through' }}>{entry.payload.from}</span>
                  {' → '}
                  {entry.payload.to}
                </span>
              )}
            </p>
            {entry.payload?.note && (
              <p style={{ color: '#7a6e62', fontSize: '0.8rem', fontStyle: 'italic' }}>
                {entry.payload.note}
              </p>
            )}
            <p style={{ color: '#7a6e62', fontSize: '0.75rem', marginTop: '2px' }}>
              {formatTs(entry.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
