'use client'

import { courses } from '@/lib/data'
import { VideoCard, Video } from '@/components/course'
import { Navbar, SiteFooter } from '@/components/layout'

// Helper function to convert Course to Video format
const convertCourseToVideo = (course: any): Video => ({
  id: course.id,
  title: course.title,
  instructor: course.instructor,
  thumbnailUrl: course.image,
  duration: course.duration,
  tags: [course.category],
  price: '$29',
  isFeatured: false
})

export default function ArabicCoursesPage() {
  return (
    <div className="min-h-screen bg-neutral-bg" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 mb-4">
                جميع الدورات
              </h1>
              <p className="text-xl text-purple-700 max-w-3xl mx-auto">
                اكتشفي مجموعتنا الشاملة من الدورات المصممة لمساعدتك على النمو والتعلم وتحقيق أهدافك.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
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
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}
