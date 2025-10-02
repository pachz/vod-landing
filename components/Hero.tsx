'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/useTranslation'

const imageSets = [
  ['/images/hero/1.png', '/images/hero/2.png', '/images/hero/3.png', '/images/hero/4.png'],
  ['/images/hero/5.png', '/images/hero/6.png', '/images/hero/7.png', '/images/hero/8.png'],
  ['/images/hero/3.png', '/images/hero/8.png', '/images/hero/1.png', '/images/hero/5.png'],
  ['/images/hero/6.png', '/images/hero/4.png', '/images/hero/5.png', '/images/hero/2.png'],
]

export default function Hero() {
  const { t, locale } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [currentImageSet, setCurrentImageSet] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [imageAnimations, setImageAnimations] = useState<boolean[]>(new Array(4).fill(false))

  // Animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Image cycling effect with staggered animations
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out current images with stagger
      setImageAnimations(prev => prev.map(() => false))
      
      setTimeout(() => {
        // Change image set
        setCurrentImageSet((prev) => (prev + 1) % imageSets.length)
        
        // Fade in new images with stagger
        setTimeout(() => {
          setImageAnimations(prev => prev.map(() => true))
        }, 100)
      }, 800) // Wait for fade out to complete
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Initialize image animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageAnimations(prev => prev.map(() => true))
    }, 1000)
    return () => clearTimeout(timer)
  }, [])


  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Handle email submission here
      console.log('Email submitted:', email)
      setIsModalOpen(false)
      setEmail('')
    }
  }

  return (
    <section id="home" className="min-h-screen relative py-8 sm:py-16 px-4 overflow-hidden flex items-center justify-center">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[#F9FAFB]">
        {/* Subtle purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/6 via-transparent to-transparent"></div>
        
        {/* Noise texture layer */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}
          ></div>
        </div>
        
        {/* Decorative pattern - positioned based on language */}
        <Image 
          src="/images/RehamDivaSinglePattern.png"
          alt="Decorative pattern"
          width={600}
          height={600}
          className={`absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] opacity-30 sm:opacity-60 pointer-events-none object-contain hidden sm:block ${
            locale === 'ar' 
              ? 'bottom-0 left-0 object-bottom object-left rotate-90' 
              : 'bottom-0 right-0 object-bottom object-right'
          }`}
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className={`flex flex-col justify-center space-y-6 lg:space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg sm:text-xl text-purple-700 leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                className="bg-pink-500 hover:bg-pink-700 text-white w-full sm:w-auto"
              >
                {t('hero.subscribeNow')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white w-full sm:w-auto"
              >
                {t('hero.exploreAll')}
              </Button>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 aspect-square max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              {imageSets[currentImageSet].map((image, index) => {
                // Staggered vertical positioning
                const staggerOffsets = [
                  'transform-none', // Top left - no offset
                  'transform translate-y-1 sm:translate-y-2', // Top right - slight down
                  'transform -translate-y-1', // Bottom left - slight up  
                  'transform translate-y-1' // Bottom right - slight down
                ]
                
                return (
                  <div
                    key={`${currentImageSet}-${index}`}
                    className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl group transition-all duration-700 ease-out ${
                      staggerOffsets[index]
                    } ${
                      imageAnimations[index] 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-5'
                    }`}
                    style={{
                      transitionDelay: `${index * 150}ms`
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Motivational content ${index + 1}`}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-inner opacity-20"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-2">{t('hero.stayInspired')}</h3>
            <p className="text-sm sm:text-base text-purple-700 mb-6">
              {t('hero.getNotified')}
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder={t('hero.enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-base sm:text-sm"
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 w-full sm:w-auto"
                >
                  {t('hero.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 w-full sm:w-auto"
                >
                  {t('hero.submitContinue')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}