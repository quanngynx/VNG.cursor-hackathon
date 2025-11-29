'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Language, translations } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.vi
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_KEY = 'nutrichat_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_KEY) as Language
      if (stored && (stored === 'vi' || stored === 'en')) {
        return stored
      }
    }
    return 'vi' // Default to Vietnamese
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, language)
      // Update HTML lang attribute
      document.documentElement.lang = language
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

