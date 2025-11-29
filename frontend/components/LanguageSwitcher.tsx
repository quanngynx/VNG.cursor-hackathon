'use client'

import { Languages } from 'lucide-react'
import { Button } from './ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/translations'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLang: Language = language === 'vi' ? 'en' : 'vi'
    setLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      className="relative"
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
        {language === 'vi' ? 'VI' : 'EN'}
      </span>
    </Button>
  )
}

