'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import { instructors } from '@/lib/data'
import Image from 'next/image'

export default function InstructorsSlider() {
  if (instructors.length === 0) return null

  // Display only the first instructor
  const instructor = instructors[0]

  return (
    <section id="instructors" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-6">
            {t('instructors.title')}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            {t('instructors.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="grid md:grid-cols-2 gap-12 p-10">
              {/* Image */}
              <div className="flex items-center justify-center">
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-navy-800/10">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-contain"
                    sizes="320px"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-3">
                  <h3 className="text-4xl font-bold text-navy-800 mb-3">
                    {instructor.name}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-navy-800 to-gold rounded-full"></div>
                  <p className="text-gold text-xl font-medium">
                    {instructor.tagline}
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-navy-800 to-gold rounded-full"></div>
                  <p className="text-text-secondary text-xl leading-relaxed pl-6 italic">
                    &ldquo;{instructor.statement}&rdquo;
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white w-fit px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {instructor.cta}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
