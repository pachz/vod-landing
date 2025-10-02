'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { setLocale as setI18nLocale, type Locale } from '@/lib/i18n'

type Direction = 'ltr' | 'rtl'

interface DirectionContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
  locale: Locale
  setLocale: (locale: Locale) => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ 
  children, 
  initialLocale = 'en' 
}: { 
  children: React.ReactNode
  initialLocale?: Locale 
}) {
  const [direction, setDirection] = useState<Direction>(initialLocale === 'ar' ? 'rtl' : 'ltr')
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Initialize i18n with the initial locale
  useEffect(() => {
    setI18nLocale(initialLocale)
  }, [initialLocale])

  // Auto-detect locale on mount (only for client-side detection)
  useEffect(() => {
    const detectLocale = () => {
      const path = window.location.pathname
      let detectedLocale: Locale = initialLocale

      if (path.startsWith('/ar') || path.includes('/ar/')) {
        detectedLocale = 'ar'
      } else if (path.startsWith('/en') || path.includes('/en/')) {
        detectedLocale = 'en'
      } else {
        // Check for query parameter as fallback
        const urlParams = new URLSearchParams(window.location.search)
        const localeParam = urlParams.get('locale')
        if (localeParam === 'ar') {
          detectedLocale = 'ar'
        }
      }
      if (detectedLocale !== initialLocale) {
        setLocale(detectedLocale)
        setI18nLocale(detectedLocale)
      }
    }

    detectLocale()
  }, [initialLocale])

  useEffect(() => {
    // Set the HTML dir and lang attributes
    document.documentElement.dir = direction
    document.documentElement.lang = locale
  }, [direction, locale])

  useEffect(() => {
    // Update direction based on locale
    setDirection(locale === 'ar' ? 'rtl' : 'ltr')
  }, [locale])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setI18nLocale(newLocale)
  }

  return (
    <DirectionContext.Provider value={{ direction, setDirection, locale, setLocale: handleSetLocale }}>
      {children}
    </DirectionContext.Provider>
  )
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}
