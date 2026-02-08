import CourseDetailClient from '@/components/course/CourseDetailClient'
import { getCourseBySlug } from '@/lib/server/course'
import { notFound } from 'next/navigation'

interface CourseDetailPageProps {
  params: Promise<{ lang: 'en' | 'ar'; id: string }>
}

export default async function LangCourseDetailPage({ params }: CourseDetailPageProps) {
  const { id, lang } = await params
  const course = await getCourseBySlug(id)

  if (!course) {
    notFound()
  }

  const panelUrl = process.env.BACKEND_PANEL_URL

  return (
    <CourseDetailClient
      course={course}
      backHref={`/${lang}/courses`}
      panelUrl={panelUrl}
    />
  )
}
