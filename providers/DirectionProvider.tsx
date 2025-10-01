'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Direction = 'ltr' | 'rtl'
type Locale = 'en' | 'ar'

interface DirectionContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
  locale: Locale
  setLocale: (locale: Locale) => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>('ltr')
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // Set the HTML dir attribute
    document.documentElement.dir = direction
  }, [direction])

  useEffect(() => {
    // Update direction based on locale
    setDirection(locale === 'ar' ? 'rtl' : 'ltr')
  }, [locale])

  return (
    <DirectionContext.Provider value={{ direction, setDirection, locale, setLocale }}>
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
