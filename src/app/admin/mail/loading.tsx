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

export default function MailLoading() {
  return (
    <div>
      <Skeleton width="80px" height="28px" style={{ marginBottom: '20px' }} />
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
              flexDirection: 'column',
              gap: '8px',
              opacity: 1 - i * 0.1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton width="200px" height="16px" />
              <Skeleton width="70px" height="14px" />
            </div>
            <Skeleton width="80%" height="14px" />
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
