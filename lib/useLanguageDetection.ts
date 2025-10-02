'use client'

import { useEffect } from 'react'
import { useDirection } from '@/providers/DirectionProvider'
import { setLocale, getLocale, type Locale } from '@/lib/i18n'

export function useLanguageDetection() {
  const { setLocale: setDirectionLocale } = useDirection()

  useEffect(() => {
    // Check for stored locale preference, default to Arabic
    const storedLocale = localStorage.getItem('preferred-locale') as Locale
    const detectedLocale: Locale = storedLocale && (storedLocale === 'ar' || storedLocale === 'en') 
      ? storedLocale 
      : 'ar' // Default to Arabic

    // Update the locale in the i18n system
    setLocale(detectedLocale)
    setDirectionLocale(detectedLocale)
  }, [setDirectionLocale])

  return null
}
