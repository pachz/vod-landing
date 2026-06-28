'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'
import {
  type PlanId,
  type SubscriptionPlan,
  formatPlanPrice,
  formatOriginalPrice,
} from '@/lib/subscription/plans'
import SubscriptionBadge, { type SubscriptionBadgeVariant } from './SubscriptionBadge'
import FeatureItem from './FeatureItem'
import FeaturesHeading from './FeaturesHeading'

interface PlanDetailsModalProps {
  plans: SubscriptionPlan[]
  isOpen: boolean
  onClose: () => void
  title: string
  ctaLabel: string
  onCta: () => void
}

function badgeVariant(
  badgeKey: string,
  plan: SubscriptionPlan
): SubscriptionBadgeVariant {
  if (badgeKey.includes('limitedMembers')) {
    return plan.variant === 'vip' ? 'gold' : 'limited'
  }
  if (plan.variant === 'featured') return 'featured'
  if (plan.variant === 'vip') return 'vip'
  return 'default'
}

function PlanDetailsContent({ plan }: { plan: SubscriptionPlan }) {
  const { t } = useTranslation()
  const isFeatured = plan.variant === 'featured'
  const isVip = plan.variant === 'vip'
  const headerLight = isFeatured
  const originalPrice = formatOriginalPrice(plan)

  const planNameKey = `subscriptionPage.plans.${plan.id}.name`
  const intervalKey = `subscriptionPage.plans.${plan.id}.intervalLabel`

  return (
    <>
      <div
        className={cn(
          'px-5 pb-4 pt-5 text-center',
          isFeatured && 'bg-gradient-to-br from-purple-700 to-pink-500 text-white',
          isVip && 'bg-gradient-to-br from-purple-50 to-pink-50',
          !isFeatured && !isVip && 'bg-white'
        )}
      >
        <div className="mb-2.5 flex min-h-[26px] flex-wrap items-center justify-center gap-2">
          {plan.badgeKeys.map((badgeKey) => (
            <SubscriptionBadge key={badgeKey} variant={badgeVariant(badgeKey, plan)}>
              {t(badgeKey)}
            </SubscriptionBadge>
          ))}
        </div>

        <div className="mb-1 flex items-center justify-center gap-2">
          {isVip && <Crown className="h-5 w-5 text-purple-600" aria-hidden />}
          <h3
            className={cn(
              'text-xl font-bold',
              headerLight ? 'text-white' : 'text-purple-900'
            )}
          >
            {t(planNameKey)}
          </h3>
        </div>

        <div className="mt-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex justify-end">
            {originalPrice && (
              <span
                className={cn(
                  'text-sm line-through',
                  headerLight ? 'text-white/55' : 'text-purple-400'
                )}
              >
                {originalPrice}
              </span>
            )}
          </div>
          <span
            className={cn(
              'text-3xl font-bold tracking-tight',
              headerLight ? 'text-white' : 'text-purple-900'
            )}
          >
            {formatPlanPrice(plan)}
          </span>
          <div className="flex justify-start">
            {plan.discountPercent && (
              <span
                className={cn(
                  'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  headerLight
                    ? 'border border-white/30 bg-white/20 text-white'
                    : 'border border-pink-200 bg-pink-100 text-pink-700'
                )}
              >
                {t('subscriptionPage.save')} {plan.discountPercent}%
              </span>
            )}
          </div>
        </div>

        <p
          className={cn(
            'mt-1 text-sm',
            headerLight ? 'text-white/80' : 'text-purple-600'
          )}
        >
          {t(intervalKey)}
          {plan.billingNoteKey && (
            <span className={cn('text-xs', headerLight ? 'text-white/55' : 'text-purple-400')}>
              {' · '}
              {t(plan.billingNoteKey)}
            </span>
          )}
        </p>
      </div>

      <div className="px-5 pb-3">
        <FeaturesHeading plan={plan} className="mt-2" />
        {plan.features.map((feature) => (
          <FeatureItem
            key={feature.titleKey}
            icon={feature.icon}
            title={t(feature.titleKey)}
            description={feature.descriptionKey ? t(feature.descriptionKey) : undefined}
            accent={isVip ? 'vip' : 'default'}
            dense
          />
        ))}
      </div>
    </>
  )
}

export default function PlanDetailsModal({
  plans,
  isOpen,
  onClose,
  title,
  ctaLabel,
  onCta,
}: PlanDetailsModalProps) {
  const { t } = useTranslation()
  const { direction } = useDirection()
  const [activePlanId, setActivePlanId] = useState<PlanId>(plans[0]?.id ?? 'annual')
  const showTabs = plans.length > 1
  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[0]

  useEffect(() => {
    if (!isOpen) return
    setActivePlanId(plans[0]?.id ?? 'annual')
  }, [isOpen, plans])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!activePlan) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          dir={direction}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="relative flex max-h-[92vh] w-full max-w-md flex-col gap-3 rounded-3xl bg-purple-50/80 p-3 shadow-2xl backdrop-blur"
          >
            {/* Island 1 — tab switcher */}
            {showTabs && (
              <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-purple-100/70">
                <div
                  className="relative flex gap-1 rounded-xl bg-purple-50 p-1"
                  role="tablist"
                  aria-label={title}
                >
                  {plans.map((plan) => {
                    const isActive = plan.id === activePlanId
                    const isVipTab = plan.variant === 'vip'
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActivePlanId(plan.id)}
                        className="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors duration-200"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="planTabIndicator"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className="absolute inset-0 z-0 rounded-lg bg-white shadow-sm ring-1 ring-purple-100"
                          />
                        )}
                        <span
                          className={cn(
                            'relative z-10 flex items-center gap-1.5',
                            isActive ? 'text-purple-900' : 'text-purple-400'
                          )}
                        >
                          {isVipTab && <Crown className="h-3.5 w-3.5" aria-hidden />}
                          {t(`subscriptionPage.plans.${plan.id}.name`)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Island 2 — plan details */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-purple-100/70">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePlan.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlanDetailsContent plan={activePlan} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="shrink-0 border-t border-purple-100 p-3">
                <Button
                  size="lg"
                  onClick={onCta}
                  className="w-full bg-[rgb(236,72,153)] py-2.5 text-base font-semibold text-white hover:bg-[rgb(219,39,119)]"
                >
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
