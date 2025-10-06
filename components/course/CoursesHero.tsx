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
  locale?: string
}

export default function CoursesHero({
  title,
  subtitle,
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onSelectCategory,
  locale
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

          {/* Search */}
          <div className="mt-6 max-w-2xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={isArabic ? 'ابحثي عن الدورات أو التصنيفات' : 'Search courses or categories'}
                className={`${isArabic ? 'pl-20 sm:pl-24' : 'pr-20 sm:pr-24'} bg-white/95 text-text-primary placeholder:text-text-secondary shadow-sm focus-visible:ring-pink-700 h-12`}
              />
              {/* Inline button on >=sm */}
              <Button
                type="submit"
                className={`hidden sm:inline-flex absolute ${isArabic ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white h-10 px-4 text-sm gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {isArabic ? 'بحث' : 'Search'}
              </Button>
              {/* Stacked button on small screens */}
              <div className="sm:hidden mt-3">
                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white h-10 gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {isArabic ? 'بحث' : 'Search'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Category Chips - positioned at bottom */}
        <div className="mt-auto pb-4">
          <div className="flex flex-wrap justify-center gap-2 px-2">
            {['All', ...categories.slice(0, 4)].map((category) => (
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
                {category === 'All' ? (isArabic ? 'الكل' : 'All') : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


