import { ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/useTranslation'
import type { SubscriptionPlan } from '@/lib/subscription/plans'

interface FeaturesHeadingProps {
  plan: SubscriptionPlan
  locked?: boolean
  className?: string
}

export default function FeaturesHeading({
  plan,
  locked = false,
  className,
}: FeaturesHeadingProps) {
  const { t } = useTranslation()
  const isMonthly = plan.id === 'monthly'

  const label = isMonthly
    ? t(plan.featuresHeadingKey ?? 'subscriptionPage.plans.monthly.featuresHeading')
    : `${t(`subscriptionPage.plans.${plan.id}.featuresHeadingPrefix`)} ${t(`subscriptionPage.plans.${plan.id}.featuresHeadingHighlight`)}${t(`subscriptionPage.plans.${plan.id}.featuresHeadingSuffix`)}`

  return (
    <div
      className={cn(
        'mt-3 mb-1 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 px-3 py-2.5',
        locked && 'opacity-60',
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-300/10 text-pink-500">
        <ListChecks className="h-4 w-4" aria-hidden />
      </div>
      <p className="min-w-0 text-sm font-semibold leading-snug text-black">
        {label}
      </p>
    </div>
  )
}
