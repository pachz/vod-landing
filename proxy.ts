import { NextRequest, NextResponse } from 'next/server'

const HOMEPAGE_CACHE = 'public, s-maxage=60, stale-while-revalidate=300'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  let locale: 'en' | 'ar' | undefined

  if (pathname.startsWith('/en')) locale = 'en'
  else if (pathname.startsWith('/ar')) locale = 'ar'

  const requestHeaders = new Headers(req.headers)
  if (locale) {
    requestHeaders.set('x-next-locale', locale)
  }
  const res = NextResponse.next({ request: { headers: requestHeaders } })

  if (locale) {
    const existing = req.cookies.get('preferred-locale')?.value
    if (existing !== locale) {
      res.cookies.set('preferred-locale', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 180, // 180 days
        sameSite: 'lax',
      })
    }
    // Cache homepage HTML at CDN for 1 min, serve stale up to 5 min while revalidating
    if (pathname === '/en' || pathname === '/ar') {
      res.headers.set('Cache-Control', HOMEPAGE_CACHE)
    }
  }

  return res
}

export const config = {
  matcher: ['/en/:path*', '/ar/:path*'],
}
