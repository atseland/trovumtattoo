function Skeleton({ width, height, style }: { width?: string; height?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: '#1c1916',
        borderRadius: '4px',
        width: width ?? '100%',
        height: height ?? '16px',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export default function SettingsLoading() {
  return (
    <div>
      <Skeleton width="130px" height="28px" style={{ marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {['Push-varsler', 'E-post', 'Conta'].map((_, i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              opacity: 1 - i * 0.15,
            }}
          >
            <Skeleton width="120px" height="20px" />
            <Skeleton width="80%" height="14px" />
            <Skeleton width="60%" height="14px" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
