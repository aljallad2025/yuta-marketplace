export default function SumuLogo({ size = 40, variant = 'full', className = '' }) {
  if (variant === 'icon') {
    return (
      <img src="/sumu-logo.png" alt="SUMU" width={size} height={size}
        className={`rounded-xl object-cover ${className}`}
        style={{ width: size, height: size }} />
    )
  }
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-0.5 ${className}`}>
        <img src="/sumu-logo.png" alt="SUMU" style={{ width: size, height: size }} className="object-contain drop-shadow-lg" />
        <div className="text-center leading-tight mt-1">
          <p className="font-black text-[#C8A951] tracking-[0.15em]" style={{ fontSize: Math.max(10, size * 0.22) }}>سمو</p>
          <p className="font-black text-white tracking-[0.25em]" style={{ fontSize: Math.max(8, size * 0.16) }}>SUMU</p>
        </div>
      </div>
    )
  }
  // 'full' = logo + text side by side
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/sumu-logo.png" alt="SUMU" style={{ width: size, height: size }}
        className="object-contain drop-shadow-md rounded-xl" />
      <div className="flex flex-col leading-tight">
        <span className="font-black text-[#C8A951] tracking-widest" style={{ fontSize: Math.max(10, size * 0.28) }}>سمو</span>
        <span className="font-black text-[#0F2A47] tracking-[0.25em]" style={{ fontSize: Math.max(8, size * 0.2) }}>SUMU</span>
      </div>
    </div>
  )
}
