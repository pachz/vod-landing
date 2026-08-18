'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/lib/useTranslation'
import CoursesPromoVideo from './CoursesPromoVideo'

/**
 * TEMPORARY (Aug 2026): Vimeo sits inside this pink hero to reduce page height.
 *
 * To restore the original centered hero (title/search/categories only, no video here):
 * 1. Set TEMP_INLINE_PROMO_VIDEO to `false` — the original layout is preserved below.
 * 2. Uncomment `<CoursesPromoVideo />` in `app/[lang]/courses/page.tsx`
 *    (and add `CoursesPromoVideo` back to that file's import).
 */
const TEMP_INLINE_PROMO_VIDEO = true

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
  const { t } = useTranslation()
  const isArabic = locale === 'ar'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

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
    ? (isMobile ? t('courses.coachShort') : t('courses.allCoaches'))
    : displayCoach

  const getCategoryDisplayName = (cat: string) => {
    if (cat === 'All') {
      return translatedCategories?.all || (isArabic ? 'الكل' : 'All')
    }
    return translatedCategories?.[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  const searchForm = (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Single bar: coach dropdown + search input + search button — alignment and short labels on mobile */}
      <div
        className={`flex items-center sm:items-stretch rounded-xl bg-white text-text-primary shadow-sm overflow-hidden border border-white/80 focus-within:ring-2 focus-within:ring-pink-700 focus-within:border-pink-700/50 h-12 min-h-12 min-w-0 ${isArabic ? 'sm:flex-row-reverse' : ''}`}
      >
        {onSelectCoach && (
          <>
            <div ref={dropdownRef} className="relative flex-shrink-0 flex items-center sm:items-stretch">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label={t('courses.filterByCoach')}
                className={`flex items-center justify-center sm:justify-start gap-1.5 border-0 py-0 pl-2 pr-7 sm:pl-4 sm:pr-8 text-sm font-medium text-text-primary bg-white cursor-pointer focus:outline-none focus:ring-0 min-h-[2.75rem] sm:min-h-full shrink-0 ${isArabic ? 'flex-row-reverse pl-7 pr-2 sm:pl-8 sm:pr-4' : ''} min-w-[5.5rem] sm:min-w-0 max-w-[8rem] sm:max-w-[10rem]`}
              >
                <span className="truncate min-w-0">{displayCoachLabel}</span>
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
                      {t('courses.allCoaches')}
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
            <span className="flex-shrink-0 w-px self-center sm:self-stretch h-6 sm:h-auto sm:my-2 bg-gray-200" aria-hidden />
          </>
        )}
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={isMobile ? t('courses.searchPlaceholderShort') : t('courses.searchPlaceholder')}
          className={`flex-1 min-w-0 sm:min-w-[220px] w-0 h-full min-h-[2.75rem] sm:min-h-0 border-0 rounded-none bg-white shadow-none placeholder:text-text-secondary focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-3 sm:px-4 text-sm sm:text-base ${isArabic ? 'text-right' : ''}`}
        />
        <Button
          type="submit"
          className="flex-shrink-0 self-center sm:self-stretch justify-center sm:justify-start rounded-none bg-purple-700 hover:bg-purple-800 text-white h-[2.75rem] sm:h-auto min-h-[2.75rem] w-12 sm:w-auto sm:min-w-0 px-0 sm:px-5 text-sm gap-2 font-medium"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">{t('courses.searchButton')}</span>
        </Button>
      </div>
    </form>
  )

  const categoryChips = (justifyClass: string) => (
    <div className={`flex flex-wrap gap-2 ${justifyClass}`}>
      {['All', ...categories].map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 ${
            selectedCategory === category
              ? 'bg-white text-purple-600 shadow-xl border-2 border-white/20'
              : 'bg-white/20 text-white hover:bg-white hover:text-purple-600 border border-white/30 hover:border-white/50 hover:shadow-lg'
          }`}
          aria-pressed={selectedCategory === category}
        >
          {getCategoryDisplayName(category)}
        </button>
      ))}
    </div>
  )

  // ---------------------------------------------------------------------------
  // ORIGINAL centered hero layout.
  // Kept intact so it can be restored by setting TEMP_INLINE_PROMO_VIDEO = false.
  // ---------------------------------------------------------------------------
  if (!TEMP_INLINE_PROMO_VIDEO) {
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
              {searchForm}
            </div>
          </div>

          {/* Category Chips - positioned at bottom */}
          <div className="mt-auto pb-4">
            {categoryChips('justify-center px-2')}
          </div>
        </div>
      </section>
    )
  }

  // TEMPORARY split layout: copy/search/categories + Vimeo in one row.
  // EN: content left, video right. AR (RTL): content right, video left.
  return (
    <section className="relative overflow-hidden bg-pink-500 py-8 sm:py-10">
      {/* Decorative single pattern */}
      <Image
        src="/images/RehamDivaSinglePinkPattern.png"
        alt="Decorative pattern"
        width={600}
        height={600}
        className={`absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] opacity-40 sm:opacity-60 pointer-events-none object-contain hidden sm:block bottom-0 ${isArabic ? 'left-0 object-bottom object-left rotate-90' : 'right-0 object-bottom object-right'}`}
        sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
      />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 text-start">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-6 w-full min-w-0 max-w-xl">
              {searchForm}
            </div>
            <div className="mt-6">
              {categoryChips('justify-start')}
            </div>
          </div>

          <div className="w-full min-w-0">
            <CoursesPromoVideo />
          </div>
        </div>
      </div>
    </section>
  )
}
