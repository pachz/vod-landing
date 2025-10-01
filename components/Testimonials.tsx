'use client'

import { motion } from 'framer-motion'
import { t } from '@/lib/i18n'
import { testimonials } from '@/lib/data'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation arrows - hidden on mobile, shown on larger screens */}
          <button
            onClick={prevSlide}
            className="hidden md:block absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-purple-800 hover:bg-purple-700 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 z-10 shadow-lg"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:block absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-purple-800 hover:bg-purple-700 rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-300 z-10 shadow-lg"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial content */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg">
              {/* Profile image */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, 96px"
                  />
                </div>
              </div>

              {/* Testimonial text */}
              <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 text-left max-w-3xl mx-auto">
                {testimonials[currentIndex].text}
              </blockquote>

              {/* Quote mark */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <span className="text-4xl sm:text-6xl font-bold text-purple-800">&ldquo;</span>
              </div>

              {/* Name and role */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-purple-800'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile navigation buttons */}
          <div className="flex justify-center mt-6 md:hidden space-x-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-purple-800 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-purple-800 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
