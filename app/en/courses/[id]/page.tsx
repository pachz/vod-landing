'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/data'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

// Sample course data with detailed information
const getCourseDetails = (id: string) => {
  const baseCourse = courses.find(course => course.id === id)
  if (!baseCourse) return null

  return {
    ...baseCourse,
    fullDescription: "This comprehensive course is designed to help you build unshakeable confidence from within. Through a series of practical exercises, real-world examples, and proven techniques, you'll learn to embrace your authentic self and develop the inner strength needed to pursue your dreams and goals.",
    learningOutcomes: [
      "Develop a deep understanding of your authentic self",
      "Build unshakeable confidence in any situation",
      "Overcome self-doubt and limiting beliefs",
      "Create a personal confidence action plan",
      "Learn to handle criticism and setbacks with grace",
      "Develop powerful self-talk and affirmation practices"
    ],
    metaData: {
      totalDuration: "2 hours 30 minutes",
      lessonsCount: 12,
      studentsCount: "2,847",
      level: "Beginner",
      language: "English",
      lastUpdated: "December 2024"
    },
    curriculum: [
      {
        section: "Introduction",
        lessons: [
          { title: "Welcome to Your Confidence Journey", duration: "8:45", isPreview: true },
          { title: "Understanding Confidence vs. Arrogance", duration: "12:30", isPreview: false },
          { title: "Your Personal Confidence Assessment", duration: "15:20", isPreview: false }
        ]
      },
      {
        section: "Building Your Foundation",
        lessons: [
          { title: "The Science of Self-Confidence", duration: "18:15", isPreview: false },
          { title: "Identifying Your Strengths and Values", duration: "22:10", isPreview: false },
          { title: "Overcoming Imposter Syndrome", duration: "16:45", isPreview: false }
        ]
      },
      {
        section: "Practical Confidence Building",
        lessons: [
          { title: "Body Language and Presence", duration: "14:30", isPreview: false },
          { title: "Voice and Communication Confidence", duration: "19:25", isPreview: false },
          { title: "Setting and Achieving Personal Goals", duration: "21:15", isPreview: false }
        ]
      },
      {
        section: "Advanced Techniques",
        lessons: [
          { title: "Handling Criticism and Feedback", duration: "17:40", isPreview: false },
          { title: "Building Confidence in Relationships", duration: "20:30", isPreview: false },
          { title: "Creating Your Confidence Maintenance Plan", duration: "13:20", isPreview: false }
        ]
      }
    ],
    instructor: {
      name: "Reham Diva",
      title: "Confidence & Life Coach",
      bio: "Reham is a certified life coach with over 8 years of experience helping women build unshakeable confidence. She has worked with thousands of clients to overcome self-doubt and achieve their personal and professional goals.",
      image: "/images/w1.png",
      rating: 4.9,
      studentsCount: "15,000+"
    }
  }
}

export default function EnglishCourseDetailPage({ params }: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Introduction']))
  
  const course = getCourseDetails(params.id)
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-900 mb-4">Course Not Found</h1>
          <p className="text-purple-700 mb-6">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName)
      } else {
        newSet.add(sectionName)
      }
      return newSet
    })
  }

  const handleEnroll = () => {
    // Handle enrollment logic
    console.log('Enrolling in course:', course.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: window.location.href
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('Course link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/en/courses"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Courses
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-purple-700 leading-relaxed mb-6">
                  {course.fullDescription}
                </p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-4">What you&apos;ll learn</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-purple-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Meta Data */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-t border-b border-purple-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.totalDuration}</div>
                  <div className="text-sm text-purple-600">Total Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.lessonsCount}</div>
                  <div className="text-sm text-purple-600">Lessons</div>
                </div>
                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-2xl font-bold text-purple-900">{course.metaData.studentsCount}</div>
                  <div className="text-sm text-purple-600">Students</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleEnroll}
                  className="bg-pink-500 hover:bg-pink-700 text-white flex-1"
                >
                  Enroll Now - $29
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleShare}
                  className="border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </Button>
              </div>
            </div>

            {/* Right Column - Video Preview */}
            <div className="space-y-6">
              <div className="relative aspect-video bg-purple-100 rounded-xl overflow-hidden">
                {/* Placeholder for Vimeo embed */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-purple-700 font-medium">Course Preview</p>
                    <p className="text-sm text-purple-600">2:30 preview available</p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-white border border-purple-100 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-purple-900">{course.instructor.name}</h4>
                    <p className="text-sm text-purple-600">{course.instructor.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-purple-600">{course.instructor.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-700">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Section */}
      <section className="bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex border-b border-purple-100">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              Curriculum
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Full Description */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">About This Course</h3>
                  <p className="text-purple-700 leading-relaxed">
                    {course.fullDescription}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">Learning Outcomes</h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-purple-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">Course Details</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-600">Level:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Language:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Duration:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.totalDuration}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-purple-600">Lessons:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.lessonsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Students:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.studentsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Updated:</span>
                        <span className="text-purple-900 font-medium">{course.metaData.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-purple-900 mb-6">Course Curriculum</h3>
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-purple-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.section)}
                      className="w-full px-6 py-4 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-between"
                    >
                      <div className="text-left">
                        <h4 className="font-semibold text-purple-900">{section.section}</h4>
                        <p className="text-sm text-purple-600">{section.lessons.length} lessons</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-purple-600 transition-transform ${
                          expandedSections.has(section.section) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedSections.has(section.section) && (
                      <div className="border-t border-purple-100">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="px-6 py-4 flex items-center justify-between hover:bg-purple-25 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                              <div>
                                <h5 className="font-medium text-purple-900">{lesson.title}</h5>
                                {lesson.isPreview && (
                                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-purple-600">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  )
}
