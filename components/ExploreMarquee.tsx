'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courses, Course } from '@/lib/data'
import { cn } from '@/lib/utils'

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
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ 
  courses, 
  direction, 
  speed, 
  isHovered, 
  onHover 
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
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
      )}
      style={{
        animationDuration: `${currentSpeed}s`,
        animationPlayState: isPaused ? 'paused' : 'running'
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

const ExploreMarquee: React.FC = () => {
  const [hoveredRow, setHoveredRow] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Single row of courses
  const singleRowCourses = courses

  const baseSpeed = isMobile ? 40 : 30 // Much slower base speed

  const categories = [
    { name: 'Confidence', slug: 'confidence' },
    { name: 'Career', slug: 'career' },
    { name: 'Wellness', slug: 'wellness' },
    { name: 'Finance', slug: 'finance' },
    { name: 'Creativity', slug: 'creativity' }
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neutral-bg to-white overflow-hidden">
      {/* Background Marquee - Single Row */}
      <div className="absolute inset-0 flex items-center py-12 sm:py-20">
        <MarqueeRow
          courses={singleRowCourses}
          direction="left"
          speed={baseSpeed}
          isHovered={hoveredRow}
          onHover={(hovered) => setHoveredRow(hovered)}
        />
      </div>

      {/* Center Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:py-0">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-purple-900 mb-4 sm:mb-6 leading-tight">
              Discover courses that inspire your next step
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              From confidence to career — find your path in short, motivational courses.
            </p>

            {/* Category Chips */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/courses?category=${category.slug}`}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/10 text-purple-800 rounded-full text-xs sm:text-sm font-medium hover:bg-pink-500 hover:text-white transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* CTA Button - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:block">
              <Link href="/courses">
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  View All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA - Sticky Bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <Link href="/courses" className="block">
            <Button 
              size="lg" 
              className="w-full text-base py-3 h-auto font-semibold"
            >
              View All Courses
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default ExploreMarquee
