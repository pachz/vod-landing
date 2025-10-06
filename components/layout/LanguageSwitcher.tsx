'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDirection } from '@/providers/DirectionProvider'
import { Globe } from 'lucide-react'

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇰🇼'
  }
]

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale, setLocale } = useDirection()
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    const newLocale = languageCode as 'en' | 'ar'
    
    // Update the locale state
    setLocale(newLocale)
    
    // Navigate to the appropriate URL with language prefix
    let newPath = pathname
    
    if (newLocale === 'ar') {
      // Navigate to Arabic version
      if (pathname === '/' || !pathname.startsWith('/ar') && !pathname.startsWith('/en')) {
        // Root path or no language prefix - add /ar
        newPath = pathname === '/' ? '/ar' : `/ar${pathname}`
      } else if (pathname.startsWith('/en')) {
        // Replace /en with /ar
        newPath = pathname.replace('/en', '/ar')
      }
    } else {
      // Navigate to English version
      if (pathname === '/' || !pathname.startsWith('/ar') && !pathname.startsWith('/en')) {
        // Root path or no language prefix - add /en
        newPath = pathname === '/' ? '/en' : `/en${pathname}`
      } else if (pathname.startsWith('/ar')) {
        // Replace /ar with /en
        newPath = pathname.replace('/ar', '/en')
      }
    }
    
    // Navigate to the new path
    router.push(newPath)
    setIsOpen(false)
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-105"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-purple-800" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                language.code === locale ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg mr-3">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {language.code === locale && (
                <span className="ml-auto text-purple-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
