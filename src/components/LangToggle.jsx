import { useLang } from '../i18n/LangContext'

export default function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C8A951]/40 bg-[#C8A951]/10 hover:bg-[#C8A951]/20 transition-all ${className}`}
    >
      <span className="text-sm">{lang === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
      <span className="text-xs font-bold text-[#C8A951] tracking-wide">
        {lang === 'ar' ? 'EN' : 'ع'}
      </span>
    </button>
  )
}
