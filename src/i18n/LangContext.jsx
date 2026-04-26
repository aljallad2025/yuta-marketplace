import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LangContext = createContext()

const RTL_LANGS = ['ar']
const LANG_LABELS = {
  en: 'EN',
  th: 'ไทย',
  lo: 'ລາວ',
  vi: 'VI',
  ar: 'ع',
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => (['en','th','lo','vi'].includes(localStorage.getItem('yuta_lang')) ? localStorage.getItem('yuta_lang') : 'th'))

  useEffect(() => {
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    localStorage.setItem('yuta_lang', lang)
  }, [lang])

  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key
  const isAr = lang === 'ar'
  const isRtl = RTL_LANGS.includes(lang)

  return (
    <LangContext.Provider value={{ lang, setLang, t, isAr, isRtl, LANG_LABELS }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
