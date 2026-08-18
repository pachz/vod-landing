'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VideoCard, type Video, CoursesHero } from '@/components/course'
// TEMPORARY: CoursesPromoVideo is inside CoursesHero (split layout).
// To restore the standalone video section, add CoursesPromoVideo back to this import.
import { SiteFooter } from '@/components/layout'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'

const DEFAULT_VISIBLE = 12
const LOAD_MORE_STEP = 8

function normalizeCategoryKey(s: string): string {
  return (s ?? '').trim().toLowerCase()
}

/** Normalize category id for comparison (trim + lowerCase) so backend and client match. */
function normalizeCategoryId(id: string): string {
  return (id ?? '').trim().toLowerCase()
}

type AdditionalCategoryResponse = {
  id: string
  name: string
}

type CoursesApiResponse = {
  locale: string
  items: ApiCourseItem[]
  additionalCategories?: AdditionalCategoryResponse[]
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
  additionalCategoryIds?: string[]
  /** Resolved labels for additional categories (from API) */
  additionalCategoryLabels?: string[]
  cheapestPlan?: {
    id: string
    slug: string
    name: string
    priceDisplay: string
    intervalLabel: string
    formattedPrice: string
    billingLabel: string
  }
}

type NormalizedCourse = Video & {
  slug?: string
  categoryKey: string
  additionalCategoryIds: string[]
  additionalCategoryLabels: string[]
  cheapestPlan?: ApiCourseItem['cheapestPlan']
}

export default function LangCoursesPage() {
  const { t } = useTranslation()
  const { locale } = useDirection()
  const loadErrorLabel = t('courses.loadError')
  const retryLabel = t('courses.retry')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All')
  const [selectedCoach, setSelectedCoach] = useState<'All' | string>('All')
  const [courses, setCourses] = useState<NormalizedCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE)
  const [additionalCategories, setAdditionalCategories] = useState<AdditionalCategoryResponse[]>([])
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
      if (requestIdRef.current !== requestId) {
        return
      }
      const payloadAdditionalCats = Array.isArray(payload.additionalCategories) ? payload.additionalCategories : []
      const normalized: NormalizedCourse[] = payload.items.map((item) => {
        const normalizedKey = (item.categoryKey ?? 'general').toLowerCase()
        const additionalIds = Array.isArray(item.additionalCategoryIds) ? item.additionalCategoryIds : []
        const apiLabels = Array.isArray(item.additionalCategoryLabels) ? item.additionalCategoryLabels : []
        const fallbackLabels = additionalIds
          .map((id) => payloadAdditionalCats.find((c) => c.id.trim().toLowerCase() === id.trim().toLowerCase())?.name)
          .filter((name): name is string => Boolean(name))
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
          categoryLabel: item.categoryLabel || item.categoryKey || normalizedKey,
          additionalCategoryIds: additionalIds,
          additionalCategoryLabels: apiLabels.length > 0 ? apiLabels : fallbackLabels,
          ...(item.cheapestPlan ? { cheapestPlan: item.cheapestPlan } : {})
        }
      })
      setCourses(normalized)
      setAdditionalCategories(payloadAdditionalCats)
    } catch (err) {
      console.error('[courses page] Failed to load courses', err)
      if (requestIdRef.current !== requestId) {
        return
      }
      setCourses([])
      setAdditionalCategories([])
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
  }, [query, selectedCategory, selectedCoach])

  // Category list: primary categories + additional categories from API + any label that appears on a card (e.g. cat4)
  // Deduplicated by normalized label so "Mission & Personal Plan" and "Q&A" appear only once
  const categoryEntries = useMemo(() => {
    const map = new Map<string, string>()
    courses.forEach((course) => {
      const key = course.categoryKey || 'general'
      const normalizedKey = normalizeCategoryKey(key)
      if (!map.has(normalizedKey)) {
        map.set(normalizedKey, course.categoryLabel || key)
      } else if (course.categoryLabel) {
        map.set(normalizedKey, course.categoryLabel)
      }
    })
    additionalCategories.forEach((cat) => {
      if (cat.id && !map.has(cat.id)) {
        map.set(cat.id, cat.name || cat.id)
      }
    })
    courses.forEach((course) => {
      ;(course.additionalCategoryLabels ?? []).forEach((label) => {
        const key = normalizeCategoryKey(label)
        if (key && !map.has(key)) {
          map.set(key, label)
        }
      })
    })
    const entries = Array.from(map.entries()).map(([key, label]) => ({
      key,
      label: label || key
    }))
    // Keep first occurrence per normalized label to avoid duplicate filter buttons
    const seenNormalizedLabels = new Set<string>()
    return entries.filter(({ label }) => {
      const norm = normalizeCategoryKey(label)
      if (seenNormalizedLabels.has(norm)) return false
      seenNormalizedLabels.add(norm)
      return true
    })
  }, [courses, additionalCategories])

  const categoryKeys = useMemo(
    () => categoryEntries.map((entry) => entry.key),
    [categoryEntries]
  )

  const coachOptions = useMemo(
    () =>
      Array.from(
        new Set(
          courses
            .map((course) => course.instructor?.trim())
            .filter((name): name is string => Boolean(name))
        )
      ),
    [courses]
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
      const haystack = `${course.title} ${course.instructor} ${course.categoryKey} ${course.categoryLabel || ''}`.toLowerCase()
      const additionalNames = (course.additionalCategoryIds || [])
        .map((id) => additionalCategories.find((c) => c.id === id)?.name ?? '')
        .join(' ')
      const labelNames = (course.additionalCategoryLabels ?? []).join(' ')
      return haystack.includes(q) || additionalNames.toLowerCase().includes(q) || labelNames.toLowerCase().includes(q)
    })
    const coachFiltered =
      selectedCoach === 'All'
        ? base
        : base.filter(
            (course) =>
              course.instructor?.trim().toLowerCase() ===
              selectedCoach.trim().toLowerCase()
          )
    if (selectedCategory === 'All') {
      return coachFiltered
    }
    const selectedLabel = categoryEntries.find((e) => e.key === selectedCategory)?.label ?? selectedCategory
    const selectedNorm = normalizeCategoryKey(selectedLabel)
    const selectedIdNorm = normalizeCategoryId(selectedCategory)
    return coachFiltered.filter((course) => {
      // Match main category (by key or label)
      const mainKeyNorm = (course.categoryKey || 'general').toLowerCase()
      if (mainKeyNorm === selectedCategory || normalizeCategoryKey(course.categoryLabel ?? '') === selectedNorm) {
        return true
      }
      // Match additional categories (by id or label)
      const courseAdditionalIdNorms = (course.additionalCategoryIds || []).map(normalizeCategoryId)
      if (courseAdditionalIdNorms.includes(selectedIdNorm)) {
        return true
      }
      return (course.additionalCategoryLabels ?? []).some((l) => normalizeCategoryKey(l) === selectedNorm)
    })
  }, [courses, query, selectedCategory, selectedCoach, additionalCategories, categoryEntries])

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
          coaches={coachOptions}
          selectedCoach={selectedCoach}
          onSelectCoach={(coach) => setSelectedCoach(coach)}
          locale={locale}
          translatedCategories={{
            all: t('courses.all'),
            ...Object.fromEntries(
              categoryEntries.map(({ key, label }) => [key.toLowerCase(), label])
            )
          }}
        />

        {/*
          TEMPORARY: promo Vimeo is inside CoursesHero to reduce page height.
          To restore the original centered pink hero + this standalone video section:
          1. In components/course/CoursesHero.tsx set TEMP_INLINE_PROMO_VIDEO to false
          2. Add CoursesPromoVideo back to the import above
          3. Uncomment the line below
        */}
        {/* <CoursesPromoVideo /> */}

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
                      video={{ ...course, additionalCategoryLabels: course.additionalCategoryLabels }}
                      cheapestPlan={course.cheapestPlan}
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
                      className="px-8 py-3 rounded-full bg-[rgb(236,72,153)] text-white font-semibold text-sm hover:bg-[rgb(219,39,119)] transition-colors"
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

