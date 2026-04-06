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

export default function NotificationsLoading() {
  return (
    <div>
      <Skeleton width="120px" height="28px" style={{ marginBottom: '20px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              padding: '14px 16px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '6px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              opacity: 1 - i * 0.1,
            }}
          >
            <Skeleton width="32px" height="32px" style={{ borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="160px" height="16px" />
                <Skeleton width="60px" height="12px" />
              </div>
              <Skeleton width="90%" height="14px" />
            </div>
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
