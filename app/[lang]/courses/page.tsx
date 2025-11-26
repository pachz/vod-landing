'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VideoCard, type Video, CoursesHero } from '@/components/course'
import { SiteFooter } from '@/components/layout'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'

const DEFAULT_VISIBLE = 12
const LOAD_MORE_STEP = 8

type CoursesApiResponse = {
  locale: string
  items: ApiCourseItem[]
}

type ApiCourseItem = {
  id: string
  slug?: string
  title: string
  shortDescription?: string
  instructor?: string
  thumbnailUrl: string
  durationMinutes: number
  durationLabel: string
  studentsCount: number
  rating: number
  categoryKey: string
  categoryLabel?: string
  tags: string[]
}

type NormalizedCourse = Video & {
  slug?: string
  categoryKey: string
}

type SubscriptionPlan = {
  productId: string
  priceId?: string
  name: string
  amountCents: number
  amount: number
  currency: string
  interval: string
  intervalLabel: string
  priceDisplay: string
}

type SubscriptionApiResponse = {
  locale: string
  plan: SubscriptionPlan
  cachedAt: number
  ttlMs: number
}

export default function LangCoursesPage() {
  const { t } = useTranslation()
  const { locale } = useDirection()
  const loadErrorLabel = t('courses.loadError')
  const retryLabel = t('courses.retry')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All')
  const [courses, setCourses] = useState<NormalizedCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE)
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null)
  const requestIdRef = useRef(0)

  const fetchCourses = useCallback(async () => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/courses?locale=${locale}`, {
        cache: 'no-store'
      })
      if (!response.ok) {
        throw new Error('Failed to load courses')
      }
      const payload = (await response.json()) as CoursesApiResponse
      let planPayload: SubscriptionPlan | null = null
      try {
        const subscriptionResponse = await fetch(`/api/subscription?locale=${locale}`, {
          cache: 'no-store'
        })
        if (subscriptionResponse.ok) {
          const subscriptionJson = (await subscriptionResponse.json()) as SubscriptionApiResponse
          planPayload = subscriptionJson.plan
        } else {
          console.warn('[courses page] Subscription API returned non-ok status', subscriptionResponse.status)
        }
      } catch (subscriptionError) {
        console.warn('[courses page] Failed to fetch subscription plan', subscriptionError)
      }
      if (requestIdRef.current !== requestId) {
        return
      }
      const normalized: NormalizedCourse[] = payload.items.map((item) => {
        const normalizedKey = (item.categoryKey ?? 'general').toLowerCase()
        return {
          id: item.slug || item.id,
          slug: item.slug,
          title: item.title,
          description: item.shortDescription || '',
          instructor: item.instructor || '',
          thumbnailUrl: item.thumbnailUrl || '/images/placeholder.svg',
          totalTime: item.durationLabel,
          totalStudents: item.studentsCount ?? 0,
          rating: item.rating ?? 0,
          tags: item.tags?.length ? item.tags : [normalizedKey],
          isFeatured: false,
          categoryKey: normalizedKey,
          categoryLabel: item.categoryLabel || item.categoryKey || normalizedKey
        }
      })
      setCourses(normalized)
      setSubscriptionPlan(planPayload)
    } catch (err) {
      console.error('[courses page] Failed to load courses', err)
      if (requestIdRef.current !== requestId) {
        return
      }
      setCourses([])
      setSubscriptionPlan(null)
      setError(loadErrorLabel)
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false)
        setVisibleCount(DEFAULT_VISIBLE)
      }
    }
  }, [locale, loadErrorLabel])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    setVisibleCount(DEFAULT_VISIBLE)
  }, [query, selectedCategory])

  const categoryEntries = useMemo(() => {
    const map = new Map<string, string>()
    courses.forEach((course) => {
      const key = course.categoryKey || 'general'
      const normalizedKey = key.toLowerCase()
      if (!map.has(normalizedKey) || !map.get(normalizedKey)) {
        map.set(normalizedKey, course.categoryLabel || key)
      }
    })
    return Array.from(map.entries()).map(([key, label]) => ({
      key,
      label: label || key
    }))
  }, [courses])

  const categoryKeys = useMemo(
    () => categoryEntries.map((entry) => entry.key),
    [categoryEntries]
  )

  useEffect(() => {
    if (selectedCategory !== 'All' && !categoryKeys.includes(selectedCategory)) {
      setSelectedCategory('All')
    }
  }, [categoryKeys, selectedCategory])

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = courses.filter((course) => {
      if (!q) return true
      const haystack = `${course.title} ${course.instructor} ${course.categoryKey}`.toLowerCase()
      return haystack.includes(q)
    })
    if (selectedCategory === 'All') {
      return base
    }
    return base.filter((course) => course.categoryKey === selectedCategory)
  }, [courses, query, selectedCategory])

  const visibleCourses = useMemo(
    () => filteredCourses.slice(0, visibleCount),
    [filteredCourses, visibleCount]
  )

  const showSkeleton = loading && courses.length === 0
  const noResults = !loading && filteredCourses.length === 0 && !error

  return (
    <div className="min-h-screen bg-neutral-bg">
      <main className="pt-16">
        <CoursesHero
          title={t('courses.allCoursesTitle')}
          subtitle={t('courses.allCoursesSubtitle')}
          query={query}
          onQueryChange={setQuery}
          categories={categoryKeys}
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => setSelectedCategory(c)}
          locale={locale}
          translatedCategories={{
            all: t('courses.all'),
            ...Object.fromEntries(
              categoryEntries.map(({ key, label }) => [key.toLowerCase(), label])
            )
          }}
        />

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {error && (
              <div className="text-center mb-10">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
                >
                  {retryLabel}
                </button>
              </div>
            )}

            {showSkeleton && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`course-skeleton-${index}`}
                    className="h-[420px] rounded-2xl bg-white/60 border border-purple-100 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!showSkeleton && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleCourses.map((course) => (
                    <VideoCard
                      key={course.id}
                      video={course}
                      subscriptionPlan={
                        subscriptionPlan
                          ? {
                              name: subscriptionPlan.name,
                              intervalLabel: subscriptionPlan.intervalLabel,
                              priceDisplay: subscriptionPlan.priceDisplay
                            }
                          : undefined
                      }
                      onCourseClick={(videoId) => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `/${locale}/course/${videoId}`
                        }
                      }}
                    />
                  ))}
                </div>

                {noResults && (
                  <p className="text-center text-text-secondary mt-8">
                    {t('courses.noCoursesFound')}
                  </p>
                )}

                {!noResults && filteredCourses.length > visibleCount && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                      className="px-8 py-3 rounded-full bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition-colors"
                    >
                      {t('courses.loadMore')}
                    </button>
                    <p className="text-sm text-text-secondary mt-3">
                      {`${t('courses.showing')} ${Math.min(visibleCount, filteredCourses.length)} ${t('courses.of')} ${filteredCourses.length}`}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

