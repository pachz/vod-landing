'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (!POSTHOG_KEY) return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // handled manually for Next.js App Router
    })
  }, [])

  useEffect(() => {
    if (!POSTHOG_KEY || !isClient) return

    const search = searchParams?.toString()
    const url = pathname + (search ? `?${search}` : '')
    // Use manual pageview capture to keep parity with router navigation
    posthog.capture('$pageview', { $current_url: window.location.origin + url })
  }, [pathname, searchParams, isClient])

  if (!POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

