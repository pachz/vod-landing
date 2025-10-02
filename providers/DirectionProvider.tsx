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
  initialLocale = 'ar' 
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

  // Check URL for language prefix and stored locale preference on mount
  useEffect(() => {
    const detectLocaleFromURL = () => {
      const path = window.location.pathname
      let detectedLocale: Locale = 'ar' // Default to Arabic
      
      // Check URL for language prefix
      if (path.startsWith('/ar/') || path === '/ar') {
        detectedLocale = 'ar'
      } else if (path.startsWith('/en/') || path === '/en') {
        detectedLocale = 'en'
      } else {
        // No language prefix in URL, check localStorage
        const storedLocale = localStorage.getItem('preferred-locale') as Locale
        if (storedLocale && (storedLocale === 'ar' || storedLocale === 'en')) {
          detectedLocale = storedLocale
        }
      }
      
      setLocale(detectedLocale)
      setI18nLocale(detectedLocale)
    }

    detectLocaleFromURL()
  }, [])

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
    // Store the preference in localStorage
    localStorage.setItem('preferred-locale', newLocale)
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
