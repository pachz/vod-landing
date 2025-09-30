'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import { courses } from '@/lib/data'
import Image from 'next/image'

export default function ExploreMarquee() {
  const duplicatedCourses = [...courses, ...courses, ...courses]

  return (
    <section className="relative py-20 px-4 bg-neutral-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Background Marquee Rows */}
        <div className="absolute inset-0 flex flex-col gap-8">
          {/* Row 1 - Moving Right */}
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -100 * courses.length] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {duplicatedCourses.map((course, index) => (
              <Card key={`row1-${index}`} className="flex-shrink-0 w-80 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 group">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    sizes="320px"
                  />
                </div>
                <CardContent className="p-4 group-hover:bg-white/95 transition-colors duration-300">
                  <h3 className="font-semibold text-navy-800 mb-2 group-hover:text-gold transition-colors duration-300">{course.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gold">
                    <span>{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Row 2 - Moving Left */}
          <motion.div
            className="flex gap-6"
            animate={{ x: [-100 * courses.length, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          >
            {duplicatedCourses.map((course, index) => (
              <Card key={`row2-${index}`} className="flex-shrink-0 w-80 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 group">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    sizes="320px"
                  />
                </div>
                <CardContent className="p-4 group-hover:bg-white/95 transition-colors duration-300">
                  <h3 className="font-semibold text-navy-800 mb-2 group-hover:text-gold transition-colors duration-300">{course.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gold">
                    <span>{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Row 3 - Moving Right */}
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -100 * courses.length] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {duplicatedCourses.map((course, index) => (
              <Card key={`row3-${index}`} className="flex-shrink-0 w-80 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 group">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                    sizes="320px"
                  />
                </div>
                <CardContent className="p-4 group-hover:bg-white/95 transition-colors duration-300">
                  <h3 className="font-semibold text-navy-800 mb-2 group-hover:text-gold transition-colors duration-300">{course.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gold">
                    <span>{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Foreground Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-2xl mx-auto shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-6">
              {t('explore.title')}
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              {t('explore.subtitle')}
            </p>
            <Button size="lg" className="bg-gold hover:bg-gold-700 text-white">
              {t('explore.cta')}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
