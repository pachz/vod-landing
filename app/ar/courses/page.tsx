'use client'

import { courses } from '@/lib/data'
import { VideoCard, Video, CoursesHero } from '@/components/course'
import { Navbar, SiteFooter } from '@/components/layout'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/useTranslation'

// Helper function to convert Course to Video format
const convertCourseToVideo = (course: any): Video => ({
  id: course.id,
  title: course.title,
  description: course.description || '',
  instructor: course.instructor,
  thumbnailUrl: course.image,
  totalTime: course.duration,
  totalStudents: course.students || 0,
  rating: course.rating || 4.5,
  tags: [course.category],
  isFeatured: false
})

export default function ArabicCoursesPage() {
  const { locale } = useTranslation()
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
    <div className="min-h-screen bg-neutral-bg" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        <CoursesHero
          title="جميع الدورات"
          subtitle="اكتشفي مجموعتنا الشاملة من الدورات المصممة لمساعدتك على النمو والتعلم وتحقيق أهدافك."
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => setSelectedCategory(c)}
          locale={locale}
        />

        {/* Courses Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <VideoCard
                  key={course.id}
                  video={convertCourseToVideo(course)}
                  viewCourseLabel="عرض الدورة"
                  onCourseClick={(videoId) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/ar/courses/${videoId}`
                    }
                  }}
                />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <p className="text-center text-text-secondary mt-8">لا توجد نتائج.</p>
            )}
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}
