'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/useTranslation'
import { getPanelUrl } from '@/lib/panelUrl'
import { 
  Play, 
  Headphones, 
  Download, 
  Monitor, 
  Star, 
  Users 
} from 'lucide-react'

export default function Features() {
  const { t, locale } = useTranslation()

  const features = [
    {
      icon: Play,
      title: t('features.cards.courses.title'),
      description: t('features.cards.courses.description'),
    },
    {
      icon: Headphones,
      title: t('features.cards.audio.title'),
      description: t('features.cards.audio.description'),
    },
    {
      icon: Download,
      title: t('features.cards.offline.title'),
      description: t('features.cards.offline.description'),
    },
    {
      icon: Monitor,
      title: t('features.cards.devices.title'),
      description: t('features.cards.devices.description'),
    },
    {
      icon: Star,
      title: t('features.cards.content.title'),
      description: t('features.cards.content.description'),
    },
    {
      icon: Users,
      title: t('features.cards.community.title'),
      description: t('features.cards.community.description'),
    },
  ]
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
            {t('features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 mb-8 sm:mb-12 justify-center">
          <div className="flex flex-col gap-4 sm:gap-6 items-start">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-pink-300/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-purple-800">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-6 items-start">
            {features.slice(3, 6).map((feature, index) => (
              <motion.div
                key={index + 3}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-pink-300/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-purple-800">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button size="lg" className="bg-pink-500 hover:bg-pink-700 text-white w-full sm:w-auto" asChild>
            <Link className="flex w-full items-center justify-center" href={`/${locale}/courses`}>
              {t('features.cta.primary')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white w-full sm:w-auto" asChild>
            <Link className="flex w-full items-center justify-center" href={getPanelUrl()}>
              {t('features.cta.secondary')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
