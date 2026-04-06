const statusColors: Record<string, { bg: string; color: string }> = {
  Ny: { bg: '#1a2a4a', color: '#6b9dd4' },
  'Trenger mer info': { bg: '#2a2a1a', color: '#c9b93a' },
  'Klar for konsultasjon': { bg: '#1a2a2a', color: '#4ab9b9' },
  'Tilbud sendt': { bg: '#2a1a3a', color: '#9b7bc9' },
  'Venter på depositum': { bg: '#2a1e0d', color: '#c9933a' },
  Booket: { bg: '#0d2a1a', color: '#4ab97a' },
  Fullført: { bg: '#1a2a1a', color: '#7ab94a' },
  Avslått: { bg: '#2a1010', color: '#c96b6b' },
}

const defaultColors = { bg: '#1c1916', color: '#7a6e62' }

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] ?? defaultColors
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
        fontSize: '0.75rem',
        fontWeight: '500',
        padding: '3px 10px',
        borderRadius: '999px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
