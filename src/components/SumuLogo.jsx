export default function SumuLogo({ size = 40, variant = 'full' }) {
  return (
    <div className="flex items-center gap-2">
      {/* Eagle emblem SVG */}
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#C8A951"/>
        {/* Crown */}
        <path d="M24 14 L32 10 L40 14 L38 18 H26 Z" fill="#0F2A47"/>
        <circle cx="27" cy="13" r="2" fill="#0F2A47"/>
        <circle cx="32" cy="10" r="2" fill="#0F2A47"/>
        <circle cx="37" cy="13" r="2" fill="#0F2A47"/>
        {/* Eagle body */}
        <ellipse cx="32" cy="28" rx="6" ry="8" fill="white"/>
        {/* Eagle head */}
        <circle cx="32" cy="20" r="4" fill="white"/>
        <circle cx="33" cy="19" r="1" fill="#C8A951"/>
        {/* Wings */}
        <path d="M26 24 C20 20, 12 22, 10 28 C14 26, 20 26, 26 28 Z" fill="white"/>
        <path d="M38 24 C44 20, 52 22, 54 28 C50 26, 44 26, 38 28 Z" fill="white"/>
        {/* Crossed swords */}
        <line x1="18" y1="38" x2="46" y2="50" stroke="#0F2A47" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="46" y1="38" x2="18" y2="50" stroke="#0F2A47" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Tail */}
        <path d="M27 34 C27 40, 28 44, 32 44 C36 44, 37 40, 37 34 Z" fill="white"/>
      </svg>
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[#C8A951] tracking-widest text-sm">سمو</span>
          <span className="font-bold text-[#0F2A47] tracking-[0.2em] text-xs">SUMU</span>
        </div>
      )}
    </div>
  )
}
