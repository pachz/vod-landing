'use client'

import { useDirection } from '@/providers/DirectionProvider'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useDirection()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    setLocale(newLocale)
    
    // Navigate to the appropriate route
    if (newLocale === 'ar') {
      window.location.href = '/ar'
    } else {
      window.location.href = '/en'
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
      <span className="sm:hidden">
        {locale === 'en' ? 'ع' : 'EN'}
      </span>
    </Button>
  )
}
