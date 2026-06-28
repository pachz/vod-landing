'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  type SubscriptionPlan,
  formatPlanPrice,
  formatOriginalPrice,
} from '@/lib/subscription/plans'
import { useTranslation } from '@/lib/useTranslation'
import SubscriptionBadge from './SubscriptionBadge'
import FeatureItem from './FeatureItem'
import FeaturesHeading from './FeaturesHeading'

interface SubscriptionCardProps {
  plan: SubscriptionPlan
  isLocked?: boolean
  index: number
  onSelect?: (planId: string) => void
}

function getBadgeVariant(
  badgeKey: string,
  planVariant: SubscriptionPlan['variant'],
  isLocked: boolean
): 'default' | 'featured' | 'vip' | 'locked' | 'limited' | 'gold' {
  if (badgeKey.includes('membershipFull')) return 'locked'
  if (badgeKey.includes('limitedMembers')) {
    return !isLocked && planVariant === 'vip' ? 'gold' : 'limited'
  }
  if (planVariant === 'featured') return 'featured'
  if (planVariant === 'vip') return 'vip'
  return 'default'
}

export default function SubscriptionCard({
  plan,
  isLocked = false,
  index,
  onSelect,
}: SubscriptionCardProps) {
  const { t, locale } = useTranslation()
  const isAr = locale === 'ar'
  const isFeatured = plan.variant === 'featured'
  const isVip = plan.variant === 'vip'
  const locked = isVip && isLocked

  const planNameKey = `subscriptionPage.plans.${plan.id}.name`
  const intervalKey = `subscriptionPage.plans.${plan.id}.intervalLabel`
  const originalPrice = formatOriginalPrice(plan)

  const displayBadges = locked
    ? [
        'subscriptionPage.badges.membershipFull',
        'subscriptionPage.badges.limitedMembers',
      ]
    : plan.badgeKeys

  const handleSelect = () => {
    if (locked) return
    onSelect?.(plan.id)
  }

  const orderClasses =
    plan.id === 'monthly'
      ? 'order-2 lg:order-1'
      : plan.id === 'annual'
        ? 'order-1 lg:order-2'
        : 'order-3 lg:order-3'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'flex flex-col h-full',
        orderClasses,
        plan.id === 'vip' && 'md:col-span-2 md:max-w-md md:justify-self-center lg:col-span-1'
      )}
    >
      <div
        className={cn(
          'relative flex flex-col flex-1 bg-white rounded-2xl border overflow-hidden transition-all duration-300',
          isFeatured && !locked && 'border-2 border-pink-500 shadow-2xl shadow-pink-500/20 ring-1 ring-pink-200 hover:scale-[1.02] hover:shadow-pink-500/30',
          !isFeatured && !isVip && 'border-purple-200 shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10',
          isVip && !locked && 'border-2 border-purple-300 shadow-lg shadow-purple-200/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/30',
          isVip && locked && 'border-gray-200 shadow-sm'
        )}
      >
        {/* VIP locked overlay */}
        {locked && (
          <div
            className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none"
            aria-hidden
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Lock className="w-7 h-7 text-gray-400" />
            </div>
          </div>
        )}

        {/* Featured corner ribbon (diagonal label clipped to the top corner) */}
        {isFeatured && !locked && (
          <div
            className={cn(
              'absolute top-0 z-20 h-[116px] w-[116px] overflow-hidden pointer-events-none',
              isAr ? 'left-0' : 'right-0'
            )}
          >
            <div
              className={cn(
                'absolute top-[26px] w-[170px] py-1 text-center text-[10px] font-bold tracking-wider uppercase text-purple-800 bg-white shadow-md',
                isAr ? 'left-[-43px] -rotate-45' : 'right-[-43px] rotate-45'
              )}
            >
              {t('subscriptionPage.ribbon.recommended')}
            </div>
          </div>
        )}

        {/* Card header */}
        <div
          className={cn(
            'px-5 sm:px-6 pt-5 sm:pt-6 pb-4 text-center',
            isFeatured && !locked && 'bg-gradient-to-br from-purple-700 to-pink-500 text-white',
            isVip && !locked && 'bg-gradient-to-br from-purple-50 to-pink-50',
            locked && 'opacity-75 grayscale-[30%]'
          )}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 min-h-[28px]">
            {displayBadges.map((badgeKey) => (
              <SubscriptionBadge
                key={badgeKey}
                variant={getBadgeVariant(badgeKey, plan.variant, locked)}
              >
                {t(badgeKey)}
              </SubscriptionBadge>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            {isVip && (
              <Crown
                className={cn(
                  'w-5 h-5',
                  locked ? 'text-gray-400' : 'text-purple-600'
                )}
                aria-hidden
              />
            )}
            <h3
              className={cn(
                'text-xl sm:text-2xl font-bold',
                isFeatured && !locked ? 'text-white' : 'text-purple-900',
                locked && 'text-gray-500'
              )}
            >
              {t(planNameKey)}
            </h3>
          </div>

          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="flex justify-end">
              {originalPrice && !locked && (
                <span
                  className={cn(
                    'text-sm line-through',
                    isFeatured ? 'text-white/55' : 'text-purple-400'
                  )}
                >
                  {originalPrice}
                </span>
              )}
            </div>

            <span
              className={cn(
                'text-3xl sm:text-4xl font-bold tracking-tight',
                isFeatured && !locked ? 'text-white' : 'text-purple-900',
                locked && 'text-gray-400'
              )}
            >
              {formatPlanPrice(plan)}
            </span>

            <div className="flex justify-start">
              {plan.discountPercent && !locked && (
                <span
                  className={cn(
                    'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap',
                    isFeatured
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-pink-100 text-pink-700 border border-pink-200'
                  )}
                >
                  {t('subscriptionPage.save')} {plan.discountPercent}%
                </span>
              )}
            </div>
          </div>

          <p
            className={cn(
              'text-sm mt-1.5',
              isFeatured && !locked ? 'text-white/80' : 'text-purple-600',
              locked && 'text-gray-400'
            )}
          >
            {t(intervalKey)}
            {plan.billingNoteKey && !locked && (
              <span
                className={cn(
                  'text-xs',
                  isFeatured && !locked ? 'text-white/55' : 'text-purple-400'
                )}
              >
                {' · '}
                {t(plan.billingNoteKey)}
              </span>
            )}
          </p>

          {locked && (
            <p className="text-xs sm:text-sm text-gray-500 mt-3 leading-relaxed px-2">
              {t('subscriptionPage.locked.message')}
            </p>
          )}
        </div>

        {/* Features */}
        <div
          className={cn(
            'flex-1 px-5 sm:px-6 py-2',
            locked && 'opacity-60'
          )}
        >
          <FeaturesHeading plan={plan} locked={locked} />
          {plan.features.map((feature) => (
            <FeatureItem
              key={feature.titleKey}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={feature.descriptionKey ? t(feature.descriptionKey) : undefined}
              accent={plan.variant === 'vip' && !locked ? 'vip' : 'default'}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 mt-auto">
          {locked ? (
            <Button
              variant="outline"
              size="lg"
              disabled
              className="w-full border-gray-300 text-gray-400 cursor-not-allowed"
              aria-disabled
            >
              {t('subscriptionPage.locked.joinWaitlist')}
            </Button>
          ) : isFeatured ? (
            <Button
              size="lg"
              onClick={handleSelect}
              className="w-full bg-[rgb(236,72,153)] hover:bg-[rgb(219,39,119)] text-white font-semibold py-2.5 text-base"
            >
              {t(plan.ctaKey)}
            </Button>
          ) : isVip ? (
            <Button
              size="lg"
              onClick={handleSelect}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 text-base"
            >
              {t(plan.ctaKey)}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={handleSelect}
              className="w-full border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white font-semibold py-2.5 text-base"
            >
              {t(plan.ctaKey)}
            </Button>
          )}

          {!locked && (
            <div className="flex flex-col items-center mt-3 text-xs sm:text-sm text-purple-600">
              <span style={{ color: '#665BFF' }}>
                {t('subscriptionPage.securePayment')}
              </span>
              <Image
                src="/images/stripe.png"
                alt="Stripe"
                width={150}
                height={35}
                className="mb-1"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
