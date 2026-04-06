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

function DayGroup({ opacity }: { opacity: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity }}>
      <Skeleton width="120px" height="20px" />
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#141210',
            border: '1px solid #2a2724',
            borderRadius: '6px',
          }}
        >
          <Skeleton width="60px" height="16px" />
          <Skeleton width="140px" height="16px" />
          <Skeleton width="80px" height="16px" style={{ marginLeft: 'auto' }} />
        </div>
      ))}
    </div>
  )
}

export default function CalendarLoading() {
  return (
    <div>
      <Skeleton width="140px" height="28px" style={{ marginBottom: '20px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DayGroup opacity={1} />
        <DayGroup opacity={0.8} />
        <DayGroup opacity={0.6} />
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
