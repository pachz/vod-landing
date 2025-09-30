'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Direction = 'ltr' | 'rtl'

interface DirectionContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>('ltr')

  useEffect(() => {
    // Set the HTML dir attribute
    document.documentElement.dir = direction
  }, [direction])

  return (
    <DirectionContext.Provider value={{ direction, setDirection }}>
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
