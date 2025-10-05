'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courses, Course } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/useTranslation'

// Video interface matching the requirements
export interface Video {
  id: string
  title: string
  instructor: string
  thumbnailUrl: string
  duration: string
  tags: string[]
  price: string
  isFeatured: boolean
}

// Component props interface
export interface ExploreMarqueeProps {
  videos: Video[]
  categories: string[]
  initialCategory?: string
  onCategoryChange?: (category: string) => void
  onViewAllClick?: () => void
  viewAllRoute?: string
  marqueeSpeed?: number
  reduceMotionFallback?: boolean
  viewCourseLabel?: string
  onCourseClick?: (videoId: string) => void
}

interface CourseCardProps {
  course: Course
  className?: string
}

const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={cn(
        "relative w-64 sm:w-72 lg:w-80 h-36 sm:h-40 lg:h-48 overflow-hidden cursor-pointer transition-all duration-300 ease-out group",
        "hover:scale-105 hover:shadow-xl hover:shadow-black/20",
        isHovered && "scale-105 shadow-xl shadow-black/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-xs bg-pink-500/20 text-pink-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-pink-500/30">
              {course.category}
            </span>
            <span className="text-xs text-white/70">{course.duration}</span>
          </div>
          <h3 className="font-semibold text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-white/80 line-clamp-1">
            by {course.instructor}
          </p>
        </div>
      </div>
    </Card>
  )
}

// Video card component for the preview area
interface VideoCardProps {
  video: Video
  className?: string
  viewCourseLabel?: string
  onCourseClick?: (videoId: string) => void
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  className, 
  viewCourseLabel = "View Course",
  onCourseClick 
}) => {
  const { t, locale } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleCourseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onCourseClick) {
      onCourseClick(video.id)
    } else {
      // Default navigation to course page
      if (typeof window !== 'undefined') {
        window.location.href = `/courses/${video.id}`
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCourseClick(e as any)
    }
  }

  return (
    <Card 
      className={cn(
        "relative w-full h-72 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden transition-all duration-300 ease-out group flex flex-col",
        "hover:scale-[1.03] hover:shadow-xl hover:shadow-black/20",
        "focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2",
        isHovered && "scale-[1.03] shadow-xl shadow-black/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="article"
      aria-label={`Course: ${video.title} by ${video.instructor}`}
      style={{ 
        width: '100%',
        minWidth: 0,
        maxWidth: '100%'
      }}
    >
      {/* Top Section - Thumbnail */}
      <div className="relative h-28 sm:h-32 md:h-36 lg:h-40 overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={`Thumbnail for ${video.title} course by ${video.instructor}`}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            !prefersReducedMotion && "group-hover:scale-110"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {video.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Middle Section - Meta */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between min-h-0 w-full">
        <div className="flex-1 flex flex-col w-full min-w-0">
          {/* Category Tag */}
          <div className="mb-1.5 sm:mb-2 w-full">
            <span className="text-xs bg-pink-500/20 text-pink-700 px-2 py-1 rounded-full border border-pink-500/30 inline-block">
              {video.tags[0] || 'Course'}
            </span>
          </div>

          {/* Title - Fixed height container */}
          <div className="h-8 sm:h-10 md:h-12 mb-1.5 sm:mb-2 w-full min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base leading-tight line-clamp-2 text-gray-900 break-words w-full">
              {video.title}
            </h3>
          </div>

          {/* Instructor - Fixed height container */}
          <div className="h-4 sm:h-5 mb-1.5 sm:mb-2 w-full min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 break-words w-full">
              {t('explore.by')} {video.instructor}
            </p>
          </div>

          {/* Duration and Price - Fixed height container */}
          <div className="h-4 sm:h-5 w-full min-w-0">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 w-full min-w-0">
              <span className="truncate flex-1">{video.duration}</span>
              <span className="font-medium text-gray-900 truncate ml-1 sm:ml-2 flex-shrink-0">{video.price}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - CTA */}
        <div className="mt-auto w-full">
          <button
            onClick={handleCourseClick}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg",
              "hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              "transition-colors duration-200",
              !prefersReducedMotion && "hover:shadow-md"
            )}
            aria-label={`View course: ${video.title}`}
            tabIndex={0}
            style={{ width: '100%', minWidth: 0 }}
          >
            {viewCourseLabel}
          </button>
        </div>
      </div>
    </Card>
  )
}

interface MarqueeRowProps {
  courses: Course[]
  direction: 'left' | 'right'
  speed: number
  isHovered: boolean
  onHover: (hovered: boolean) => void
  reduceMotion?: boolean
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ 
  courses, 
  direction, 
  speed, 
  isHovered, 
  onHover,
  reduceMotion = false
}) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const handleMouseEnter = () => {
      setIsPaused(true)
      onHover(true)
    }

    const handleMouseLeave = () => {
      setIsPaused(false)
      onHover(false)
    }

    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
      setIsPaused(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return
      
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > 50
      const isRightSwipe = distance < -50

      if (isLeftSwipe || isRightSwipe) {
        // Resume animation after a brief pause
        setTimeout(() => {
          setIsPaused(false)
        }, 1000)
      } else {
        setIsPaused(false)
      }
    }

    row.addEventListener('mouseenter', handleMouseEnter)
    row.addEventListener('mouseleave', handleMouseLeave)
    row.addEventListener('touchstart', handleTouchStart, { passive: true })
    row.addEventListener('touchmove', handleTouchMove, { passive: true })
    row.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      row.removeEventListener('mouseenter', handleMouseEnter)
      row.removeEventListener('mouseleave', handleMouseLeave)
      row.removeEventListener('touchstart', handleTouchStart)
      row.removeEventListener('touchmove', handleTouchMove)
      row.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onHover, touchStart, touchEnd])

  const currentSpeed = isHovered ? speed * 0.1 : speed // Slow down by 90% on hover

  return (
    <div 
      ref={rowRef}
      className={cn(
        "flex gap-6 will-change-transform",
        !reduceMotion && (direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right')
      )}
      style={{
        animationDuration: reduceMotion ? '0s' : `${currentSpeed}s`,
        animationPlayState: isPaused || reduceMotion ? 'paused' : 'running'
      }}
    >
      {/* Duplicate courses for seamless loop */}
      {[...courses, ...courses].map((course, index) => (
        <CourseCard 
          key={`${course.id}-${index}`} 
          course={course}
          className="flex-shrink-0"
        />
      ))}
    </div>
  )
}

const ExploreMarquee: React.FC<ExploreMarqueeProps> = ({
  videos = [],
  categories = [],
  initialCategory = "All",
  onCategoryChange,
  onViewAllClick,
  viewAllRoute = "/videos",
  marqueeSpeed = 30,
  reduceMotionFallback = false,
  viewCourseLabel,
  onCourseClick
}) => {
  const { t, locale } = useTranslation()
  const [hoveredRow, setHoveredRow] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Ensure videos is always an array to prevent runtime errors
  const safeVideos = videos || []

  // Filter videos based on selected category
  const filteredVideos = selectedCategory === "All" 
    ? safeVideos 
    : safeVideos.filter(video => video.tags.includes(selectedCategory))

  // Carousel logic
  const cardsPerView = isMobile ? 1 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? 2 : 3
  const totalSlides = Math.ceil(filteredVideos.length / cardsPerView)
  const maxSlide = Math.max(0, totalSlides - 1)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion || filteredVideos.length <= cardsPerView) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, prefersReducedMotion, filteredVideos.length, cardsPerView, totalSlides])

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [selectedCategory])

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  // Get current slide videos
  const getCurrentSlideVideos = () => {
    const startIndex = currentSlide * cardsPerView
    return filteredVideos.slice(startIndex, startIndex + cardsPerView)
  }

  const currentSlideVideos = getCurrentSlideVideos()
  const hasMoreVideos = filteredVideos.length > cardsPerView

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Handle category change with smooth transition
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return
    
    setIsTransitioning(true)
    setSelectedCategory(category)
    onCategoryChange?.(category)
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  // Handle View All click
  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick()
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = viewAllRoute
      }
    }
  }

  // Keyboard navigation for category chips
  const handleKeyDown = (e: React.KeyboardEvent, category: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCategoryChange(category)
    }
  }

  // Single row of courses for marquee
  const singleRowCourses = courses
  const baseSpeed = isMobile ? 40 : marqueeSpeed
  const shouldReduceMotion = prefersReducedMotion || reduceMotionFallback

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neutral-bg to-white overflow-hidden">
      {/* TODO: Background Marquee - Single Row - Commented out for now, can be restored later */}
      {/* 
      <div className="absolute inset-0 flex items-center py-12 sm:py-20">
        <MarqueeRow
          courses={singleRowCourses}
          direction="left"
          speed={baseSpeed}
          isHovered={hoveredRow}
          onHover={(hovered) => setHoveredRow(hovered)}
          reduceMotion={shouldReduceMotion}
        />
      </div>
      */}

      {/* Center Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-2 sm:px-4 py-6 sm:py-8 md:py-0">
        <div className="text-center max-w-6xl mx-auto w-full">
          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-white/20">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              {t('explore.title')}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              {t('explore.subtitle')}
            </p>

            {/* Category Chips */}
            <div 
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8 px-2"
              role="tablist"
              aria-label="Video categories"
            >
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  onKeyDown={(e) => handleKeyDown(e, category)}
                  className={cn(
                    "px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                    selectedCategory === category
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-purple-800/10 text-purple-800 hover:bg-pink-500 hover:text-white"
                  )}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  aria-label={`Filter videos by ${category} category`}
                  tabIndex={0}
                >
                  {category === "All" ? (locale === 'ar' ? 'الكل' : 'All') : t(`explore.categories.${category}`)}
                </button>
              ))}
            </div>

            {/* Video Preview Grid */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-base sm:text-lg text-gray-600 mb-4 px-4">{t('explore.noVideosFound')}</p>
                  {hasMoreVideos && (
                    <Button
                      onClick={handleViewAllClick}
                      size="lg"
                      className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      aria-label="View all videos"
                    >
                      {t('explore.viewAll')}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Carousel Container */}
                  <div className="relative">
                    {/* Navigation Arrows */}
                    {hasMoreVideos && totalSlides > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                          aria-label="Previous videos"
                        >
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                          aria-label="Next videos"
                        >
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Carousel Content */}
                    <div 
                      className={cn(
                        "grid gap-3 sm:gap-4 transition-all duration-500 ease-in-out",
                        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`,
                        isTransitioning && "opacity-50 scale-95"
                      )}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      aria-live="polite"
                      aria-label={`Showing ${currentSlideVideos.length} of ${filteredVideos.length} videos`}
                    >
                      {currentSlideVideos.map((video) => (
                        <div key={video.id} className="w-full" style={{ width: '100%', minWidth: 0 }}>
                          <VideoCard 
                            video={video}
                            className="w-full"
                            viewCourseLabel={viewCourseLabel || t('explore.viewCourse')}
                            onCourseClick={onCourseClick}
                          />
                        </div>
                      ))}
                    </div>


                  </div>

                  
                  {/* View All CTA */}
                  {hasMoreVideos && (
                    <div className="mt-4 sm:mt-6 text-center">
                      <Button
                        onClick={handleViewAllClick}
                        size="lg"
                        className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        aria-label={`View all ${filteredVideos.length} videos in ${selectedCategory} category`}
                      >
                        {t('explore.viewAll')} ({filteredVideos.length} {locale === 'ar' ? 'فيديو' : 'videos'})
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExploreMarquee
