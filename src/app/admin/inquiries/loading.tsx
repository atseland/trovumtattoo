export default function InquiriesLoading() {
  return (
    <div>
      <div
        style={{
          height: '28px',
          width: '160px',
          background: '#141210',
          borderRadius: '4px',
          marginBottom: '24px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[80, 60, 120, 100].map((w, i) => (
          <div
            key={i}
            style={{
              height: '36px',
              width: `${w}px`,
              background: '#141210',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: '64px',
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite',
              opacity: 1 - i * 0.1,
            }}
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
