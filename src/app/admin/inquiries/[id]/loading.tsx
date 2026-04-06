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

export default function InquiryDetailLoading() {
  return (
    <div>
      <Skeleton width="80px" height="16px" style={{ marginBottom: '16px' }} />

      {/* Header with status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Skeleton width="220px" height="28px" />
        <Skeleton width="70px" height="24px" style={{ borderRadius: '12px' }} />
      </div>

      {/* Detail card with 6 fields */}
      <div
        style={{
          padding: '16px',
          background: '#141210',
          border: '1px solid #2a2724',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="100px" height="12px" />
            <Skeleton width={i % 2 === 0 ? '60%' : '80%'} height="16px" />
          </div>
        ))}
      </div>

      {/* Image grid */}
      <Skeleton width="80px" height="20px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height="120px"
            style={{ borderRadius: '6px', opacity: 1 - i * 0.15 }}
          />
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
