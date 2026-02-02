'use client'

import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
                    <select
                      value={selectedCoach ?? 'All'}
                      onChange={(e) => onSelectCoach(e.target.value)}
                      aria-label={isArabic ? 'تصفية حسب المدربة' : 'Filter by coach'}
                      className={`flex-shrink-0 border-0 py-0 pl-3 pr-8 sm:pl-4 sm:pr-8 text-sm font-medium text-text-primary bg-white cursor-pointer focus:outline-none focus:ring-0 appearance-none bg-no-repeat bg-[length:1rem_1rem] bg-[right_0.5rem_center] max-w-[9rem] sm:max-w-[10rem] ${isArabic ? 'bg-[left_0.5rem_center] pl-8 pr-3 sm:pl-8 sm:pr-4' : ''}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                      }}
                    >
                      <option value="All">{isArabic ? 'كل المدربات' : 'All coaches'}</option>
                      {(coaches ?? []).map((coach) => (
                        <option key={coach} value={coach}>
                          {coach}
                        </option>
                      ))}
                    </select>
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


