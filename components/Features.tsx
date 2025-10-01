'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import { 
  Play, 
  Headphones, 
  Download, 
  Monitor, 
  Star, 
  Users 
} from 'lucide-react'

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

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
            {t('features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-300/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-purple-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-4 sm:p-6 pt-0">
                  <CardDescription className="text-sm sm:text-base text-text-secondary">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button size="lg" className="bg-pink-500 hover:bg-pink-700 text-white w-full sm:w-auto">
            {t('features.cta.primary')}
          </Button>
          <Button size="lg" variant="outline" className="border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white w-full sm:w-auto">
            {t('features.cta.secondary')}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
