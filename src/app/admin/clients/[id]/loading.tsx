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

export default function ClientDetailLoading() {
  return (
    <div>
      <Skeleton width="80px" height="16px" style={{ marginBottom: '16px' }} />
      <Skeleton width="200px" height="28px" style={{ marginBottom: '24px' }} />

      {/* Info card */}
      <div
        style={{
          padding: '16px',
          background: '#141210',
          border: '1px solid #2a2724',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <Skeleton width="60%" height="16px" />
        <Skeleton width="50%" height="16px" />
        <Skeleton width="40%" height="16px" />
      </div>

      {/* Projects list */}
      <Skeleton width="100px" height="20px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: '14px 16px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 1 - i * 0.15,
            }}
          >
            <Skeleton width="160px" height="16px" />
            <Skeleton width="80px" height="14px" />
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
