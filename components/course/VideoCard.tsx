'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useDirection } from '@/providers/DirectionProvider'
import { useTranslation } from '@/lib/useTranslation'
 

export interface Video {
  id: string
  title: string
  description: string
  instructor: string
  thumbnailUrl: string
  totalTime: string
  totalStudents: number
  rating: number
  tags: string[]
  isFeatured: boolean
  isMostPopular?: boolean
}

export interface VideoCardProps {
  video: Video
  className?: string
  onCourseClick?: (videoId: string) => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  className, 
  onCourseClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { locale } = useDirection()
  const { t } = useTranslation()
  
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

  // Use provided values directly; only minimal fallbacks
  const displayTitle = video.title || ''
  const displayDescription = video.description || ''
  const displayTime = video.totalTime || ''
  const displayStudents = (video.totalStudents ?? 0)
  const displayTag = (video.tags && video.tags[0]) || ''

  const handleCourseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onCourseClick) {
      onCourseClick(video.id)
    } else if (typeof window !== 'undefined') {
      window.location.href = `/courses/${video.id}`
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
        'relative w-full h-full min-h-[420px] sm:min-h-[440px] md:min-h-[480px] overflow-hidden transition-all duration-300 ease-out group flex flex-col',
        'hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10',
        'focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2',
        isHovered && 'scale-[1.02] shadow-xl shadow-black/10',
        'bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 shadow-sm',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="article"
      aria-label={`Course: ${displayTitle}`}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}
    >
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={`Thumbnail for ${displayTitle} course`}
          fill
          className={cn(
            'object-cover transition-transform duration-300',
            !prefersReducedMotion && 'group-hover:scale-105'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Hover Play Overlay */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="bg-white/70 dark:bg-white/60 backdrop-blur-md rounded-xl p-2 shadow-lg">
            <svg
              className="w-6 h-6 text-gray-900"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          </div>
        </div>
        {video.isMostPopular && (
          <div className="absolute top-3 left-3">
            <span className="text-xs bg-pink-500 text-white px-3 py-1 rounded-full font-semibold">
              {locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
            </span>
          </div>
        )}
        {video.isFeatured && !video.isMostPopular && (
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-amber-400 text-amber-900 px-3 py-1 rounded-full font-semibold">
              {locale === 'ar' ? 'مميز' : 'Featured'}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col text-start">
        {/* Ensure text aligns with document direction (LTR/RTL) and not inherited center */}
        <div className="sr-only"></div>
        {/* Category Tag */}
        <div className="mb-3">
          <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full font-semibold">
            {displayTag ? t(`explore.categories.${displayTag}`) : ''}
          </span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h3 className="font-bold text-lg leading-tight text-gray-900 h-10 flex items-center">
            <span className="line-clamp-2">{displayTitle}</span>
          </h3>
        </div>

        {/* Description */}
        <div className="mb-4 h-10 flex items-center">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {displayTime}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 8v1h-6v4a3 3 0 01-3 3z" />
            </svg>
            {displayStudents.toLocaleString()} {locale === 'ar' ? 'طالبة' : 'students'}
          </span>
        </div>

        {/* Separator */}
        <div className="border-t border-pink-200 mb-4"></div>

        {/* Subscription and CTA */}
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-purple-600 font-medium">{locale === 'ar' ? 'ضمن الاشتراك' : 'Included in subscription'}</div>
            <div className="text-sm text-purple-700 font-semibold">{locale === 'ar' ? '8.5 د.ك/شهريًا • جميع الدورات' : '8.5 KWD/month • All courses'}</div>
          </div>
          <button
            onClick={handleCourseClick}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full px-6 py-2 bg-pink-500 text-white text-sm font-semibold rounded-lg text-center',
              'hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
              'transition-colors duration-200',
              !prefersReducedMotion && 'hover:shadow-md'
            )}
            aria-label={`View course: ${displayTitle}`}
            tabIndex={0}
          >
            {t('explore.viewCourse')}
          </button>
        </div>
      </div>
    </Card>
  )
}

export default VideoCard
