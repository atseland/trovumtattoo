const statusColors: Record<string, { bg: string; color: string }> = {
  Ny: { bg: 'var(--color-status-ny-bg)', color: 'var(--color-status-ny)' },
  'Trenger mer info': { bg: 'var(--color-status-info-bg)', color: 'var(--color-status-info)' },
  'Klar for konsultasjon': { bg: 'var(--color-status-konsultasjon-bg)', color: 'var(--color-status-konsultasjon)' },
  'Tilbud sendt': { bg: 'var(--color-status-tilbud-bg)', color: 'var(--color-status-tilbud)' },
  'Venter på depositum': { bg: 'var(--color-status-depositum-bg)', color: 'var(--color-status-depositum)' },
  Booket: { bg: 'var(--color-status-booket-bg)', color: 'var(--color-status-booket)' },
  Fullført: { bg: 'var(--color-status-fullfort-bg)', color: 'var(--color-status-fullfort)' },
  Avslått: { bg: 'var(--color-status-avslatt-bg)', color: 'var(--color-status-avslatt)' },
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
