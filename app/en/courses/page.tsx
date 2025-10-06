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

export default function EnglishCoursesPage() {
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
    <div className="min-h-screen bg-neutral-bg">
      <Navbar />
      
      <main className="pt-16">
        <CoursesHero
          title="All Courses"
          subtitle="Discover our comprehensive collection of courses designed to help you grow, learn, and achieve your goals."
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
                  viewCourseLabel="View Course"
                  onCourseClick={(videoId) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/en/courses/${videoId}`
                    }
                  }}
                />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <p className="text-center text-text-secondary mt-8">No courses found.</p>
            )}
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}
