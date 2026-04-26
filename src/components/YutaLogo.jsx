export default function YutaLogo({ size = 40, variant = 'default' }) {
  return (
    <div style={{
      width: size, height: size,
      background: 'linear-gradient(135deg, #00C9A7 0%, #0A3D8F 100%)',
      borderRadius: size * 0.22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60" fill="none">
        {/* Y shape with speed lines */}
        <path d="M10 8 L30 32 L50 8" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M30 32 L30 54" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Speed lines */}
        <path d="M4 30 L18 30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <path d="M2 36 L14 36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M4 42 L16 42" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      </svg>
    </div>
  )
}
