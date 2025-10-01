'use client'

import { useEffect } from 'react'
import { useDirection } from '@/providers/DirectionProvider'
import { setLocale, getLocale, type Locale } from '@/lib/i18n'

export function useLanguageDetection() {
  const { setLocale: setDirectionLocale } = useDirection()

  useEffect(() => {
    // Check URL path for language
    const path = window.location.pathname
    let detectedLocale: Locale = 'en'

    // Check if we're in the Arabic route
    if (path.startsWith('/ar') || path.includes('/ar/')) {
      detectedLocale = 'ar'
    } else if (path.startsWith('/en') || path.includes('/en/')) {
      detectedLocale = 'en'
    } else {
      // Default to English for root path
      detectedLocale = 'en'
    }

    // Update the locale in the i18n system
    setLocale(detectedLocale)
    setDirectionLocale(detectedLocale)
  }, [setDirectionLocale])

  return null
}
