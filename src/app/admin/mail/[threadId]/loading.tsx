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

export default function ThreadLoading() {
  return (
    <div>
      <Skeleton width="80px" height="16px" style={{ marginBottom: '16px' }} />
      <Skeleton width="260px" height="24px" style={{ marginBottom: '8px' }} />
      <Skeleton width="160px" height="14px" style={{ marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              opacity: 1 - i * 0.15,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton width="140px" height="14px" />
              <Skeleton width="60px" height="12px" />
            </div>
            <Skeleton width="100%" height="14px" />
            <Skeleton width="70%" height="14px" />
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
