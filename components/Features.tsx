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
    <section id="features" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gold-300/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="text-xl text-navy-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-text-secondary">
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-gold hover:bg-gold-700 text-white">
            {t('features.cta.primary')}
          </Button>
          <Button size="lg" variant="outline" className="border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white">
            {t('features.cta.secondary')}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
