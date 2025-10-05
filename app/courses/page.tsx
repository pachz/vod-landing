'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/data'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'

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
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-purple-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-purple-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-purple-500 mb-4">
                      <span>{course.instructor}</span>
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pink-500">$29</span>
                      <Button size="sm" className="bg-pink-500 hover:bg-pink-700 text-white">
                        View Course
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}
