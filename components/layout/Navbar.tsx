'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useDirection } from '@/providers/DirectionProvider'
import { useTranslation } from '@/lib/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'

const navigationItems = [
  { nameKey: 'navbar.home', href: '#home' },
  { nameKey: 'navbar.features', href: '#features' },
  { nameKey: 'navbar.instructors', href: '#instructor' },
  { nameKey: 'navbar.testimonials', href: '#testimonials' },
  { nameKey: 'navbar.faq', href: '#faq' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { direction, locale } = useDirection()
  const { t } = useTranslation()

  // Get translations based on current locale
  const getNavbarText = (key: string) => {
    // Check if we're on an Arabic route
    const isArabicRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar')
    
    if (locale === 'ar' || isArabicRoute) {
      const arTranslations: Record<string, string> = {
        'navbar.home': 'الرئيسية',
        'navbar.features': 'الميزات',
        'navbar.instructors': 'المدربات',
        'navbar.testimonials': 'الشهادات',
        'navbar.faq': 'الأسئلة الشائعة',
        'navbar.getStarted': 'ابدئي الآن',
        'navbar.logoText': 'رهام دیفا'
      }
      return arTranslations[key] || t(key)
    }
    return t(key)
  }

  // Handle scroll effect
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section or redirect to landing page
  const scrollToSection = (href: string) => {
    if (typeof window === 'undefined') return
    
    // Check if we're on the landing page
    const isLandingPage = window.location.pathname === '/' || 
                         window.location.pathname === '/ar' || 
                         window.location.pathname === '/en'
    
    if (isLandingPage) {
      // On landing page, scroll to section
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } else {
      // Not on landing page, redirect to landing page with section
      const baseUrl = locale === 'ar' ? '/ar' : locale === 'en' ? '/en' : '/'
      window.location.href = `${baseUrl}${href}`
    }
    setIsOpen(false) // Close mobile menu after clicking
  }

  // Check if we're on a course page
  const isCoursePage = typeof window !== 'undefined' && window.location.pathname.includes('/courses')
  
  return (
    <nav
      key={`navbar-${locale}`}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isCoursePage
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/10 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('#home')}
              className="flex items-center transition-opacity duration-200 hover:opacity-80"
            >
              <Image 
                src="/images/RehamDivaLogo.png" 
                alt="Reham Diva" 
                width={32}
                height={32}
                className="h-6 sm:h-8 w-auto"
                sizes="(max-width: 640px) 24px, 32px"
              />
              <span className={`text-lg sm:text-2xl font-bold transition-colors duration-200 ${
                direction === 'rtl' ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'
              } ${
                scrolled
                  ? 'text-purple-900'
                  : 'text-purple-900'
              }`}>
                {getNavbarText('navbar.logoText')}
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse' : ''} space-x-4 lg:space-x-6`}>
              {navigationItems.map((item) => (
                <button
                  key={item.nameKey}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-pink-500 ${
                    scrolled
                      ? 'text-purple-800 hover:bg-pink-100'
                      : 'text-purple-800 hover:bg-pink-100'
                  }`}
                >
                  {getNavbarText(item.nameKey)}
                </button>
              ))}
              {/* Language Switcher with consistent spacing */}
              <div className="ml-4 lg:ml-6">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block flex-shrink-0">
            <Button
              onClick={() => scrollToSection('#home')}
              className="bg-pink-500 hover:bg-pink-700 text-white text-sm sm:text-base"
            >
              {getNavbarText('navbar.getStarted')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                scrolled
                  ? 'text-purple-800 hover:bg-pink-100'
                  : 'text-purple-800 hover:bg-pink-100'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200">
            {navigationItems.map((item) => (
              <button
                key={item.nameKey}
                onClick={() => scrollToSection(item.href)}
                className={`block px-3 py-2 rounded-md text-sm sm:text-base font-medium text-purple-800 hover:text-pink-500 hover:bg-pink-100 transition-colors duration-200 w-full ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {getNavbarText(item.nameKey)}
              </button>
            ))}
            <div className="pt-3 sm:pt-4 space-y-3">
              {/* Language Switcher for Mobile */}
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              <Button
                onClick={() => scrollToSection('#home')}
                className="w-full bg-pink-500 hover:bg-pink-700 text-white text-sm sm:text-base"
              >
                {getNavbarText('navbar.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
