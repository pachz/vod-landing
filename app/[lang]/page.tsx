'use client'

import { Hero, Features, ExploreMarquee, InstructorsSlider, Testimonials, FAQ } from '@/components/home'
import { SiteFooter } from '@/components/layout'
import { useDirection } from '@/providers/DirectionProvider'
import { courses } from '@/lib/data'

const sampleCategories = ['confidence', 'career', 'wellness', 'finance']

export default function LangHomePage() {
  const { locale } = useDirection()
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ExploreMarquee 
        videos={courses.map(c => ({
          id: c.id,
          title: locale === 'ar' ? (c.titleAr || c.title) : c.title,
          description: locale === 'ar' ? (c.descriptionAr || c.description) : c.description,
          instructor: locale === 'ar' ? (c.instructorAr || c.instructor) : c.instructor,
          thumbnailUrl: c.image,
          totalTime: locale === 'ar' ? (c.durationAr || c.duration) : c.duration,
          totalStudents: 0,
          rating: 0,
          tags: [c.category],
          isFeatured: false,
        }))}
        categories={sampleCategories}
        initialCategory="All"
        viewAllRoute={`/${locale}/courses`}
        marqueeSpeed={30}
        onCourseClick={(videoId) => {
          if (typeof window !== 'undefined') {
            window.location.href = `/${locale}/courses/${videoId}`
          }
        }}
      />
      <InstructorsSlider />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </main>
  )
}


