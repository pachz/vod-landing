'use client'

import { useEffect } from 'react'
import { useDirection } from '@/providers/DirectionProvider'

export default function HtmlAttributes() {
  const { locale, direction } = useDirection()

  useEffect(() => {
    // Update HTML attributes based on current locale and direction
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [locale, direction])

  return null
}
