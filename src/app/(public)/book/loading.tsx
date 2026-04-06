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

export default function BookLoading() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Form header */}
      <Skeleton width="200px" height="28px" style={{ marginBottom: '8px' }} />
      <Skeleton width="300px" height="16px" style={{ marginBottom: '32px' }} />

      {/* 8 form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="100px" height="14px" />
            <Skeleton height="40px" style={{ borderRadius: '6px' }} />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <Skeleton height="44px" style={{ borderRadius: '6px' }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
