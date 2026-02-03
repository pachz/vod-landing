'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export interface CoursesHeroProps {
  title: string
  subtitle: string
  query: string
  onQueryChange: (value: string) => void
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  // Optional coach filter dropdown
  coaches?: string[]
  selectedCoach?: string
  onSelectCoach?: (coach: string) => void
  locale?: string
  translatedCategories?: { [key: string]: string }
}

export default function CoursesHero({
  title,
  subtitle,
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onSelectCategory,
  // coach filter props
  coaches,
  selectedCoach,
  onSelectCoach,
  locale,
  translatedCategories
}: CoursesHeroProps) {
  const isArabic = locale === 'ar'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (dropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: isArabic ? undefined : rect.left,
        right: isArabic ? window.innerWidth - rect.right : undefined,
      })
    } else {
      setDropdownPosition(null)
    }
  }, [dropdownOpen, isArabic])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (dropdownRef.current?.contains(target) || triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setDropdownOpen(false)
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const displayCoach = selectedCoach ?? 'All'
  const displayCoachLabel = displayCoach === 'All'
    ? (isArabic ? 'كل المدربات' : 'All coaches')
    : displayCoach

  return (
    <section className="relative overflow-hidden bg-pink-500 py-12">
      {/* Decorative single pattern */}
      <Image 
        src="/images/RehamDivaSinglePinkPattern.png"
        alt="Decorative pattern"
        width={600}
        height={600}
        className={`absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] opacity-40 sm:opacity-60 pointer-events-none object-contain hidden sm:block bottom-0 ${isArabic ? 'left-0 object-bottom object-left rotate-90' : 'right-0 object-bottom object-right'}`}
        sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
      />
      <div className="relative max-w-7xl mx-auto px-4 flex flex-col h-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {subtitle}
          </p>

          {/* Search + Coach filter (inline) */}
          <div className="mt-6 w-full max-w-2xl mx-auto min-w-0">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Single bar: coach dropdown + search input + search button */}
              <div
                className={`flex items-stretch rounded-xl bg-white text-text-primary shadow-sm overflow-hidden border border-white/80 focus-within:ring-2 focus-within:ring-pink-700 focus-within:border-pink-700/50 h-12 min-w-0 ${isArabic ? 'sm:flex-row-reverse' : ''}`}
              >
                {onSelectCoach && (
                  <>
                    <div ref={dropdownRef} className="relative flex-shrink-0 flex items-stretch">
                      <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                        aria-label={isArabic ? 'تصفية حسب المدربة' : 'Filter by coach'}
                        className={`flex items-center gap-1.5 border-0 py-0 pl-3 pr-8 sm:pl-4 sm:pr-8 text-sm font-medium text-text-primary bg-white cursor-pointer focus:outline-none focus:ring-0 max-w-[9rem] sm:max-w-[10rem] min-h-full ${isArabic ? 'flex-row-reverse pl-8 pr-3 sm:pl-8 sm:pr-4' : ''}`}
                      >
                        <span className="truncate">{displayCoachLabel}</span>
                        <ChevronDown
                          className={`flex-shrink-0 w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </button>
                      {dropdownOpen && dropdownPosition && typeof document !== 'undefined' && createPortal(
                        <ul
                          ref={menuRef}
                          role="listbox"
                          className={`fixed z-[100] min-w-[10rem] max-h-[16rem] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 ${isArabic ? 'right-0' : 'left-0'}`}
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            right: dropdownPosition.right,
                          }}
                        >
                          <li role="option" aria-selected={displayCoach === 'All'}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectCoach('All')
                                setDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${isArabic ? 'text-right' : 'text-left'} ${
                                displayCoach === 'All'
                                  ? 'bg-pink-100 text-pink-800'
                                  : 'text-text-primary hover:bg-gray-100'
                              }`}
                            >
                              {isArabic ? 'كل المدربات' : 'All coaches'}
                            </button>
                          </li>
                          {(coaches ?? []).map((coach) => (
                            <li key={coach} role="option" aria-selected={displayCoach === coach}>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectCoach(coach)
                                  setDropdownOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${isArabic ? 'text-right' : 'text-left'} ${
                                  displayCoach === coach
                                    ? 'bg-pink-100 text-pink-800'
                                    : 'text-text-primary hover:bg-gray-100'
                                }`}
                              >
                                {coach}
                              </button>
                            </li>
                          ))}
                        </ul>,
                        document.body
                      )}
                    </div>
                    <span className="flex-shrink-0 w-px self-stretch bg-gray-200 my-2" aria-hidden />
                  </>
                )}
                <Input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={isArabic ? 'ابحثي عن الدورات أو التصنيفات' : 'Search courses or categories'}
                  className={`flex-1 min-w-[180px] sm:min-w-[220px] w-0 h-full border-0 rounded-none bg-white shadow-none placeholder:text-text-secondary focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-4 text-sm sm:text-base ${isArabic ? 'text-right' : ''}`}
                />
                <Button
                  type="submit"
                  className="flex-shrink-0 self-stretch rounded-none bg-purple-700 hover:bg-purple-800 text-white h-auto px-4 sm:px-5 text-sm gap-2 font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">{isArabic ? 'بحث' : 'Search'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Category Chips - positioned at bottom */}
        <div className="mt-auto pb-4">
          <div className="flex flex-wrap justify-center gap-2 px-2">
            {['All', ...categories].map((category) => {
              const getCategoryDisplayName = (cat: string) => {
                if (cat === 'All') {
                  return translatedCategories?.all || (isArabic ? 'الكل' : 'All')
                }
                return translatedCategories?.[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1)
              }
              
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 ${
                    selectedCategory === category
                      ? 'bg-white text-purple-600 shadow-xl border-2 border-white/20'
                      : 'bg-white/20 text-white hover:bg-white hover:text-purple-600 border border-white/30 hover:border-white/50 hover:shadow-lg'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {getCategoryDisplayName(category)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


