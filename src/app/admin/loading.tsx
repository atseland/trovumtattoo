export default function AdminLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: '72px',
            background: '#141210',
            border: '1px solid #2a2724',
            borderRadius: '6px',
            animation: 'pulse 1.5s ease-in-out infinite',
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
