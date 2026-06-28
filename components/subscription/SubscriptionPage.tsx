'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SiteFooter } from '@/components/layout'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'
import { getSubscriptionPlans } from '@/lib/subscription/plans'
import { useVipLocked } from '@/lib/subscription/useVipLocked'
import SubscriptionCard from './SubscriptionCard'

export default function SubscriptionPage() {
  const { t } = useTranslation()
  const { direction } = useDirection()
  const vipLocked = useVipLocked()
  const plans = getSubscriptionPlans()

  const handleSelect = (planId: string) => {
    // Placeholder — replace with Stripe/checkout when backend is ready
    console.log('[subscription] plan selected:', planId)
  }

  return (
    <div className="min-h-screen bg-neutral-bg" dir={direction}>
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-pink-500 py-12 sm:py-16">
          <div
            className="absolute inset-0 opacity-40 sm:opacity-60 pointer-events-none"
            aria-hidden
          >
            <Image
              src="/images/RehamDivaSinglePinkPattern.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/80 mb-3"
            >
              {t('subscriptionPage.eyebrow')}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t('subscriptionPage.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              {t('subscriptionPage.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Plans grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {plans.map((plan, index) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  isLocked={plan.isVip ? vipLocked : false}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
