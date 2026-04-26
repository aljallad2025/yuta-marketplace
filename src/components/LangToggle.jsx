import { useState, useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'
import { useLang } from '../i18n/LangContext'

const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'th', flag: '🇹🇭', label: 'ภาษาไทย' },
  { code: 'lo', flag: '🇱🇦', label: 'ພາສາລາວ' },
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
]

export default function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGS.find(l => l.code === lang) || LANGS[0]

  return (
    <div ref={ref} style={{ position: 'relative' }} className={className}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#00C9A7]/40 bg-[#00C9A7]/10 hover:bg-[#00C9A7]/20 transition-all">
        <Globe size={13} className="text-[#00C9A7]" />
        <span className="text-sm">{current.flag}</span>
        <span className="text-xs font-bold text-[#00C9A7] tracking-wide">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 38, right: 0, background: '#0D1B4B', border: '1px solid rgba(0,201,167,0.25)', borderRadius: 12, minWidth: 150, zIndex: 999, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
          {LANGS.map(({ code, flag, label }) => (
            <button key={code} onClick={() => { setLang(code); setOpen(false) }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: lang === code ? 'rgba(0,201,167,0.12)' : 'transparent', border: 'none', cursor: 'pointer', color: lang === code ? '#00C9A7' : '#ccc', fontWeight: 700, fontSize: 13, textAlign: 'start' }}>
              <span style={{ fontSize: 18 }}>{flag}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
