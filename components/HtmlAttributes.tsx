'use client'

import { useEffect } from 'react'

export default function HtmlAttributes() {
  useEffect(() => {
    const path = window.location.pathname
    
    if (path.startsWith('/ar')) {
      document.documentElement.lang = 'ar'
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }, [])

  return null
}
