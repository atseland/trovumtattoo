const statusConfig: Record<string, { bg: string; color: string }> = {
  Ny: { bg: 'var(--status-new)', color: 'var(--status-new-text)' },
  'Trenger mer info': { bg: 'var(--status-info)', color: 'var(--status-info-text)' },
  'Klar for konsultasjon': { bg: 'var(--status-info)', color: 'var(--status-info-text)' },
  'Tilbud sendt': { bg: 'var(--status-offer)', color: 'var(--status-offer-text)' },
  'Venter på depositum': { bg: 'var(--status-deposit)', color: 'var(--status-deposit-text)' },
  Booket: { bg: 'var(--status-booked)', color: 'var(--status-booked-text)' },
  Fullført: { bg: 'var(--status-done)', color: 'var(--status-done-text)' },
  Avslått: { bg: 'var(--status-rejected)', color: 'var(--status-rejected-text)' },
}

const defaultConfig = { bg: 'var(--status-new)', color: 'var(--status-new-text)' }

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? defaultConfig
  return (
    <span
      className='inline-flex items-center font-sans text-[9px] tracking-[0.12em] uppercase whitespace-nowrap'
      style={{
        background: config.bg,
        color: config.color,
        padding: '4px 10px',
        borderRadius: '2px',
      }}
    >
      {status}
    </span>
  )
}
