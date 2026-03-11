import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { USE_COURSES_AS_HOME } from '@/lib/featureFlags'

export default async function RootRedirectPage() {
  const cookieStore = await cookies()
  const preferred = cookieStore.get('preferred-locale')?.value
  const locale = preferred === 'en' ? 'en' : 'ar'

  if (USE_COURSES_AS_HOME) {
    redirect(`/${locale}/courses`)
  }
  redirect(`/${locale}`)
}
