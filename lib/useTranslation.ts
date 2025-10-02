'use client'

import { useDirection } from '@/providers/DirectionProvider'
import { t, setLocale } from './i18n'
import { useEffect } from 'react'

export function useTranslation() {
  const { locale } = useDirection()
  
  // Ensure i18n locale is synced with context locale
  useEffect(() => {
    setLocale(locale)
  }, [locale])
  
  const translate = (key: string) => {
    return t(key)
  }
  
  return { t: translate, locale }
}
