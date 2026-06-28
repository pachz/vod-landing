import type { LucideIcon } from 'lucide-react'
import {
  Users,
  MessageCircle,
  Gift,
  Sparkles,
  Crown,
  Video,
  Heart,
  Calendar,
  GraduationCap,
  Award,
  Percent,
} from 'lucide-react'

export type PlanId = 'monthly' | 'annual' | 'vip'
export type PlanVariant = 'default' | 'featured' | 'vip'

export interface PlanFeature {
  icon: LucideIcon
  titleKey: string
  /** Optional secondary line, e.g. the hours/courses/lessons stats. */
  descriptionKey?: string
}

export interface SubscriptionPlan {
  id: PlanId
  variant: PlanVariant
  price: number
  /** Pre-discount price, shown struck-through when present. */
  originalPrice?: number
  /** Whole-number discount percentage, e.g. 18. */
  discountPercent?: number
  currency: 'USD'
  interval: 'month' | 'year'
  /** Optional small note under the interval, e.g. "12 + 2 months". */
  billingNoteKey?: string
  /** Heading that introduces the feature list. Monthly uses a single key; Annual/VIP use prefix/highlight/suffix keys. */
  featuresHeadingKey?: string
  badgeKeys: string[]
  features: PlanFeature[]
  ctaKey: string
  isVip?: boolean
  maxMembers?: number
  /** Mobile sort order (lower = higher on page). */
  mobileOrder: number
  /** Desktop grid order. */
  desktopOrder: number
}

const monthlyFeatures: PlanFeature[] = [
  {
    icon: GraduationCap,
    titleKey: 'subscriptionPage.plans.monthly.features.access.title',
    descriptionKey: 'subscriptionPage.plans.monthly.features.access.description',
  },
  {
    icon: MessageCircle,
    titleKey: 'subscriptionPage.plans.monthly.features.club.title',
    descriptionKey: 'subscriptionPage.plans.monthly.features.club.description',
  },
  {
    icon: Users,
    titleKey: 'subscriptionPage.plans.monthly.features.whatsapp.title',
  },
]

const annualFeatures: PlanFeature[] = [
  {
    icon: GraduationCap,
    titleKey: 'subscriptionPage.plans.annual.features.access.title',
    descriptionKey: 'subscriptionPage.plans.annual.features.access.description',
  },
  {
    icon: Gift,
    titleKey: 'subscriptionPage.plans.annual.features.bonus.title',
    descriptionKey: 'subscriptionPage.plans.annual.features.bonus.description',
  },
  {
    icon: MessageCircle,
    titleKey: 'subscriptionPage.plans.annual.features.clubQuestions.title',
  },
  {
    icon: Sparkles,
    titleKey: 'subscriptionPage.plans.annual.features.program.title',
    descriptionKey: 'subscriptionPage.plans.annual.features.program.description',
  },
  {
    icon: Calendar,
    titleKey: 'subscriptionPage.plans.annual.features.followUp.title',
    descriptionKey: 'subscriptionPage.plans.annual.features.followUp.description',
  },
  {
    icon: Percent,
    titleKey: 'subscriptionPage.plans.annual.features.renewal.title',
    descriptionKey: 'subscriptionPage.plans.annual.features.renewal.description',
  },
  {
    icon: Award,
    titleKey: 'subscriptionPage.plans.annual.features.certification.title',
  },
]

const vipFeatures: PlanFeature[] = [
  {
    icon: GraduationCap,
    titleKey: 'subscriptionPage.plans.vip.features.access.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.access.description',
  },
  {
    icon: MessageCircle,
    titleKey: 'subscriptionPage.plans.vip.features.clubPriority.title',
  },
  {
    icon: Calendar,
    titleKey: 'subscriptionPage.plans.vip.features.followUp.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.followUp.description',
  },
  {
    icon: Percent,
    titleKey: 'subscriptionPage.plans.vip.features.renewal.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.renewal.description',
  },
  {
    icon: Heart,
    titleKey: 'subscriptionPage.plans.vip.features.healing1hr.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.healing1hr.description',
  },
  {
    icon: Crown,
    titleKey: 'subscriptionPage.plans.vip.features.healing3hr.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.healing3hr.description',
  },
  {
    icon: Video,
    titleKey: 'subscriptionPage.plans.vip.features.goldenGroup.title',
    descriptionKey: 'subscriptionPage.plans.vip.features.goldenGroup.description',
  },
]

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    variant: 'default',
    price: 54,
    currency: 'USD',
    interval: 'month',
    featuresHeadingKey: 'subscriptionPage.plans.monthly.featuresHeading',
    badgeKeys: ['subscriptionPage.badges.startHere'],
    features: monthlyFeatures,
    ctaKey: 'subscriptionPage.plans.monthly.cta',
    mobileOrder: 2,
    desktopOrder: 1,
  },
  {
    id: 'annual',
    variant: 'featured',
    price: 540,
    originalPrice: 750,
    discountPercent: 30,
    currency: 'USD',
    interval: 'year',
    billingNoteKey: 'subscriptionPage.plans.annual.billingNote',
    badgeKeys: ['subscriptionPage.badges.bestValue'],
    features: annualFeatures,
    ctaKey: 'subscriptionPage.plans.annual.cta',
    mobileOrder: 1,
    desktopOrder: 2,
  },
  {
    id: 'vip',
    variant: 'vip',
    price: 740,
    currency: 'USD',
    interval: 'year',
    billingNoteKey: 'subscriptionPage.plans.vip.billingNote',
    badgeKeys: ['subscriptionPage.badges.limitedMembers'],
    features: vipFeatures,
    ctaKey: 'subscriptionPage.plans.vip.cta',
    isVip: true,
    maxMembers: 50,
    mobileOrder: 3,
    desktopOrder: 3,
  },
]

export function getSubscriptionPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS
}

export function formatPlanPrice(plan: SubscriptionPlan): string {
  return `$${plan.price}`
}

export function formatOriginalPrice(plan: SubscriptionPlan): string | null {
  return plan.originalPrice ? `$${plan.originalPrice}` : null
}
