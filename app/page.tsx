import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootRedirectPage() {
  const cookieStore = await cookies()
  const preferred = cookieStore.get('preferred-locale')?.value
  const locale = preferred === 'en' ? 'en' : 'ar'
  redirect(`/${locale}`)
}
