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

export default function ProjectDetailLoading() {
  return (
    <div>
      <Skeleton width="80px" height="16px" style={{ marginBottom: '16px' }} />
      <Skeleton width="240px" height="28px" style={{ marginBottom: '16px' }} />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <Skeleton width="100px" height="36px" style={{ borderRadius: '6px' }} />
        <Skeleton width="100px" height="36px" style={{ borderRadius: '6px' }} />
        <Skeleton width="100px" height="36px" style={{ borderRadius: '6px' }} />
      </div>

      {/* Estimate card */}
      <div
        style={{
          padding: '16px',
          background: '#141210',
          border: '1px solid #2a2724',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <Skeleton width="80px" height="18px" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="120px" height="16px" />
          <Skeleton width="80px" height="16px" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="100px" height="16px" />
          <Skeleton width="60px" height="16px" />
        </div>
      </div>

      {/* Deposit card */}
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
        <Skeleton width="90px" height="18px" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="110px" height="16px" />
          <Skeleton width="70px" height="16px" />
        </div>
      </div>

      {/* Bookings section */}
      <Skeleton width="100px" height="20px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 1 - i * 0.2,
            }}
          >
            <Skeleton width="140px" height="16px" />
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
