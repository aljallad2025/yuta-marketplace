export default function YutaLogo({ size = 40, variant = 'full', className = '' }) {
  if (variant === 'icon') {
    return (
      <img src="/yuta-logo.png" alt="YUTA" width={size} height={size}
        className={`rounded-xl object-cover ${className}`}
        style={{ width: size, height: size }} />
    )
  }
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-0.5 ${className}`}>
        <img src="/yuta-logo.png" alt="YUTA" style={{ width: size, height: size }} className="object-contain drop-shadow-lg" />
        <div className="text-center leading-tight mt-1">
          <p className="font-black text-[#00C9A7] tracking-[0.15em]" style={{ fontSize: Math.max(10, size * 0.22) }}>يوتا</p>
          <p className="font-black text-white tracking-[0.25em]" style={{ fontSize: Math.max(8, size * 0.16) }}>YUTA</p>
        </div>
      </div>
    )
  }
  // 'full' = logo + text side by side
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/yuta-logo.png" alt="YUTA" style={{ width: size, height: size }}
        className="object-contain drop-shadow-md rounded-xl" />
      <div className="flex flex-col leading-tight">
        <span className="font-black text-[#00C9A7] tracking-widest" style={{ fontSize: Math.max(10, size * 0.28) }}>يوتا</span>
        <span className="font-black text-[#0D1B4B] tracking-[0.25em]" style={{ fontSize: Math.max(8, size * 0.2) }}>YUTA</span>
      </div>
    </div>
  )
}
