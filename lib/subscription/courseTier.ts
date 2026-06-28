import {
  SUBSCRIPTION_PLANS,
  type PlanId,
  type SubscriptionPlan,
} from './plans'

export type { PlanId as CoursePlanId }

export const PLAN_LABEL: Record<PlanId, string> = {
  monthly: 'Monthly',
  annual: 'Annual',
  vip: 'VIP',
}

const PLAN_ORDER: PlanId[] = ['monthly', 'annual', 'vip']

/** TEMPORARY: every course is included in Annual + VIP until the backend provides plan access. */
export function getCourseIncludedPlans(): PlanId[] {
  return ['annual', 'vip']
}

export function getSubscriptionPlan(planId: PlanId): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ?? SUBSCRIPTION_PLANS[0]
}

/** Lowest-tier included plan — used for primary CTA pricing. */
export function getPrimarySubscribePlan(includedPlans: PlanId[]): SubscriptionPlan {
  const primaryId =
    PLAN_ORDER.find((id) => includedPlans.includes(id)) ?? 'annual'
  return getSubscriptionPlan(primaryId)
}

export function formatPlanList(labels: string[], locale: 'en' | 'ar'): string {
  if (labels.length === 0) return ''
  if (locale === 'ar') return labels.join(' و ')
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}
