export default function ClientsLoading() {
  return (
    <div>
      <div
        style={{
          height: '28px',
          width: '100px',
          background: '#141210',
          borderRadius: '4px',
          marginBottom: '20px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '44px',
          background: '#141210',
          borderRadius: '4px',
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
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
