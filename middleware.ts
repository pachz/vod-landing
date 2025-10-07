'use server'

import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  let locale: 'en' | 'ar' | undefined

  if (pathname.startsWith('/en')) locale = 'en'
  else if (pathname.startsWith('/ar')) locale = 'ar'

  if (!locale) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const existing = req.cookies.get('preferred-locale')?.value
  if (existing !== locale) {
    res.cookies.set('preferred-locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 180, // 180 days
      sameSite: 'lax',
    })
  }
  return res
}

export const config = {
  matcher: ['/en/:path*', '/ar/:path*'],
}


