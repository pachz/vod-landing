import { Suspense } from 'react'
import { SubscriptionPage } from '@/components/subscription'

function SubscriptionPageFallback() {
  return (
    <div className="min-h-screen bg-neutral-bg pt-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function LangSubscriptionPage() {
  return (
    <Suspense fallback={<SubscriptionPageFallback />}>
      <SubscriptionPage />
    </Suspense>
  )
}
