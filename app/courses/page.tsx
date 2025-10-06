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

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-neutral-bg">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 mb-4">
                All Courses
              </h1>
              <p className="text-xl text-purple-700 max-w-3xl mx-auto">
                Discover our comprehensive collection of courses designed to help you grow, learn, and achieve your goals.
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
                  viewCourseLabel="View Course"
                  onCourseClick={(videoId) => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/courses/${videoId}`
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
