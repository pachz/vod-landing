'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courses, Course } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/useTranslation'
import { VideoCard, Video } from '@/components/course'

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

  // Carousel logic - only for mobile
  const cardsPerView = isMobile ? 1 : 3 // Desktop shows 3 cards, mobile shows 1
  const totalSlides = Math.ceil(filteredVideos.length / cardsPerView)
  const maxSlide = Math.max(0, totalSlides - 1)

  // Auto-play functionality - only for mobile
  useEffect(() => {
    if (!isMobile || !isAutoPlaying || prefersReducedMotion || filteredVideos.length <= cardsPerView) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides)
    }, 3500) // Change slide every 3.5 seconds

    return () => clearInterval(interval)
  }, [isMobile, isAutoPlaying, prefersReducedMotion, filteredVideos.length, cardsPerView, totalSlides])

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
                  {isMobile ? (
                    /* Mobile Slider */
                    <div className="relative">
                      {/* Navigation Controls (Mobile) will render below the card */}

                      {/* Mobile Carousel Content */}
                      <div 
                        className="relative overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        aria-live="polite"
                        aria-label={`Showing ${currentSlideVideos.length} of ${filteredVideos.length} videos`}
                      >
                        <div 
                          className={cn(
                            "flex transition-transform duration-500 ease-in-out",
                            isTransitioning && "opacity-50"
                          )}
                          style={{
                            transform: `translateX(-${currentSlide * 100}%)`
                          }}
                        >
                          {filteredVideos.map((video, index) => (
                            <div 
                              key={video.id} 
                              className="w-full flex-shrink-0 px-1"
                              style={{ width: '100%', minWidth: 0 }}
                            >
                              <VideoCard 
                                video={video}
                                className="w-full"
                                onCourseClick={onCourseClick}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Centered, grouped controls under the video card (mobile only) */}
                      {hasMoreVideos && totalSlides > 1 && (
                        <div className="mt-3 flex justify-center">
                          <div className="inline-flex items-center gap-3">
                            <button
                              onClick={prevSlide}
                              className="bg-purple-600 text-white shadow-lg rounded-full p-3 active:scale-95 transition-transform hover:bg-purple-700"
                              aria-label="Previous videos"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextSlide}
                              className="bg-purple-600 text-white shadow-lg rounded-full p-3 active:scale-95 transition-transform hover:bg-purple-700"
                              aria-label="Next videos"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Desktop/Tablet Grid Layout */
                    <div 
                      className={cn(
                        "grid gap-4 sm:gap-6 transition-all duration-500 ease-in-out",
                        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                        isTransitioning && "opacity-50 scale-95"
                      )}
                      aria-live="polite"
                      aria-label={`Showing ${Math.min(filteredVideos.length, 4)} of ${filteredVideos.length} videos`}
                    >
                      {filteredVideos.slice(0, 4).map((video) => (
                        <div key={video.id} className="w-full" style={{ width: '100%', minWidth: 0 }}>
                          <VideoCard 
                            video={video}
                            className="w-full"
                            onCourseClick={onCourseClick}
                          />
                        </div>
                      ))}
                    </div>
                  )}

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
