import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ar') // default Arabic

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key
  const isAr = lang === 'ar'

  return (
    <LangContext.Provider value={{ lang, setLang, t, isAr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
