import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function RootRedirectPage() {
  const cookieStore = cookies()
  const preferred = cookieStore.get('preferred-locale')?.value
  const locale = preferred === 'en' ? 'en' : 'ar'
  redirect(`/${locale}`)
}
