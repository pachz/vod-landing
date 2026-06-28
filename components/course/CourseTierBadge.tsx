'use client'

import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/useTranslation'
import type { PlanId } from '@/lib/subscription/plans'

const planStyles: Record<PlanId, string> = {
  monthly: 'bg-purple-100 text-purple-800 border border-purple-200',
  annual: 'bg-pink-500 text-white border border-pink-500',
  vip: 'bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 border border-amber-400',
}

interface CoursePlanBadgeProps {
  planId: PlanId
  className?: string
}

export default function CoursePlanBadge({ planId, className }: CoursePlanBadgeProps) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold',
        planStyles[planId],
        className
      )}
    >
      {planId === 'vip' && <Crown className="w-3.5 h-3.5" aria-hidden />}
      {t(`subscriptionPage.plans.${planId}.name`)}
    </span>
  )
}
