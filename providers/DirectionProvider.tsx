'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
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

  // Ensure i18n locale is set before first render to avoid flash of wrong language
  const initializedRef = useRef(false)
  if (!initializedRef.current) {
    setI18nLocale(initialLocale)
    initializedRef.current = true
  }

  // Keep i18n in sync if initialLocale prop changes (rare)
  useEffect(() => {
    setI18nLocale(initialLocale)
  }, [initialLocale])

  // Check URL for language prefix and stored locale preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const detectLocaleFromURL = () => {
      const path = window.location.pathname
      let detectedLocale: Locale = 'ar' // Default to Arabic
      
      // Check URL for language prefix
      if (path.startsWith('/ar/') || path === '/ar') {
        detectedLocale = 'ar'
      } else if (path.startsWith('/en/') || path === '/en') {
        detectedLocale = 'en'
      } else {
        // No language prefix in URL, check cookie then localStorage
        const cookieMatch = document.cookie.match(/(?:^|; )preferred-locale=(en|ar)/)
        const cookieLocale = (cookieMatch ? cookieMatch[1] : undefined) as Locale | undefined
        const storedLocale = localStorage.getItem('preferred-locale') as Locale
        detectedLocale = cookieLocale ?? (storedLocale === 'ar' || storedLocale === 'en' ? storedLocale : 'ar')
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
    // Store the preference in localStorage and cookie for SSR usage
    localStorage.setItem('preferred-locale', newLocale)
    // Cookie: 180 days, path=/
    const maxAgeDays = 180
    const maxAge = maxAgeDays * 24 * 60 * 60
    document.cookie = `preferred-locale=${newLocale}; max-age=${maxAge}; path=/; samesite=lax`
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
