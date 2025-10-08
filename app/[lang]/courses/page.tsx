'use client'

import { courses } from '@/lib/data'
import { VideoCard, Video, CoursesHero } from '@/components/course'
import { SiteFooter } from '@/components/layout'
import { useMemo, useState } from 'react'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'

const toVideoForLocale = (course: any, locale: 'en' | 'ar'): Video => ({
  id: course.id,
  title: locale === 'ar' ? (course.titleAr || course.title) : course.title,
  description: locale === 'ar' ? (course.descriptionAr || course.description) : (course.description || ''),
  instructor: locale === 'ar' ? (course.instructorAr || course.instructor) : course.instructor,
  thumbnailUrl: course.image,
  totalTime: locale === 'ar' ? (course.durationAr || course.duration) : course.duration,
  totalStudents: course.students || 0,
  rating: course.rating || 4.5,
  tags: [course.category],
  isFeatured: false
})

export default function LangCoursesPage() {
  const { t } = useTranslation()
  const { locale } = useDirection()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All')
  const categories = useMemo(() => {
    const set = new Set<string>()
    courses.forEach(c => set.add(c.category))
    return Array.from(set)
  }, [])
  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = courses.filter((course: any) => {
      const haystack = `${course.title} ${course.instructor} ${course.category}`.toLowerCase()
      return q ? haystack.includes(q) : true
    })
    const byCategory = selectedCategory === 'All' 
      ? base 
      : base.filter((c: any) => c.category === selectedCategory)
    return byCategory
  }, [query, selectedCategory])

  return (
    <div className="min-h-screen bg-neutral-bg">
      <main className="pt-16">
        <CoursesHero
          title={t('courses.allCoursesTitle')}
          subtitle={t('courses.allCoursesSubtitle')}
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => setSelectedCategory(c)}
          locale={locale}
          translatedCategories={{
            all: t('courses.all'),
            ...Object.fromEntries(
              categories.map(cat => [cat.toLowerCase(), t(`courses.categories.${cat.toLowerCase()}`)])
            )
          }}
        />

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <VideoCard
                  key={course.id}
                  video={toVideoForLocale(course, locale)}
                  onCourseClick={(videoId) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/${locale}/courses/${videoId}`
                    }
                  }}
                />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <p className="text-center text-text-secondary mt-8">{t('courses.noCoursesFound')}</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}


