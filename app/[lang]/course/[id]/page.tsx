import CourseDetailClient from '@/components/course/CourseDetailClient'
import { getCourseBySlug } from '@/lib/server/course'
import { notFound } from 'next/navigation'

interface CourseDetailPageProps {
  params: { lang: 'en' | 'ar'; id: string }
}

export default async function LangCourseDetailPage({ params }: CourseDetailPageProps) {
  const course = await getCourseBySlug(params.id)

  if (!course) {
    notFound()
  }

  return (
    <CourseDetailClient
      course={course}
      backHref={`/${params.lang}/courses`}
    />
  )
}
