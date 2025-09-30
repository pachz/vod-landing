'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { t } from '@/lib/i18n'
import { instructors } from '@/lib/data'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function InstructorsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || instructors.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % instructors.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + instructors.length) % instructors.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % instructors.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (instructors.length === 0) return null

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

        <div className="relative">
          {/* Slider Container */}
          <div className="relative h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <div className="grid md:grid-cols-2 gap-12 p-10">
                    {/* Image */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-navy-800/10">
                        <Image
                          src={instructors[currentIndex].image}
                          alt={instructors[currentIndex].name}
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
                          {instructors[currentIndex].name}
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-navy-800 to-gold rounded-full"></div>
                        <p className="text-gold text-xl font-medium">
                          {instructors[currentIndex].tagline}
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-navy-800 to-gold rounded-full"></div>
                        <p className="text-text-secondary text-xl leading-relaxed pl-6 italic">
                          &ldquo;{instructors[currentIndex].statement}&rdquo;
                        </p>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white w-fit px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {instructors[currentIndex].cta}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {instructors.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl rtl:rotate-180"
                  aria-label="Previous instructor"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl rtl:rotate-180"
                  aria-label="Next instructor"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {instructors.length > 1 && (
            <div className="flex justify-center mt-10 space-x-3">
              {instructors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-navy-800 to-navy-700 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-navy-300 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play Toggle */}
          {instructors.length > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-sm text-navy-600 hover:text-navy-800 transition-colors duration-300 font-medium px-4 py-2 rounded-full hover:bg-navy-50"
              >
                {isAutoPlaying ? 'Pause' : 'Resume'} auto-play
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
