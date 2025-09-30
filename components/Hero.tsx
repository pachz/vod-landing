'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const imageSets = [
  ['/images/1.webp', '/images/2.webp', '/images/3.webp', '/images/4.webp'],
  ['/images/5.webp', '/images/6.webp', '/images/7.webp', '/images/8.webp'],
  ['/images/9.webp', '/images/10.webp', '/images/1.webp', '/images/2.webp'],
  ['/images/3.webp', '/images/4.webp', '/images/5.webp', '/images/6.webp']
]

export default function Hero() {
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
    <section id="home" className="min-h-screen relative py-16 px-4 overflow-hidden flex items-center justify-center">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[#F9FAFB]">
        {/* Subtle navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44]/6 via-transparent to-transparent"></div>
        
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
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className={`flex flex-col justify-center space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                Find Your Strength,{' '}
                <span className="text-gold">Shape Your Future.</span>
              </h1>
              <p className="text-xl text-navy-700 leading-relaxed">
                Unlimited motivational classes in bite-sized episodes designed for women who want to grow.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold-700 text-white"
              >
                Explore all
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white"
              >
                Subscribe Now
              </Button>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="grid grid-cols-2 gap-4 aspect-square max-w-lg mx-auto">
              {imageSets[currentImageSet].map((image, index) => {
                // Staggered vertical positioning
                const staggerOffsets = [
                  'transform-none', // Top left - no offset
                  'transform translate-y-2', // Top right - slight down
                  'transform -translate-y-1', // Bottom left - slight up  
                  'transform translate-y-1' // Bottom right - slight down
                ]
                
                return (
                  <div
                    key={`${currentImageSet}-${index}`}
                    className={`relative overflow-hidden rounded-2xl shadow-xl group transition-all duration-700 ease-out ${
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
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 rounded-2xl shadow-inner opacity-20"></div>
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-navy-900 mb-2">Stay Inspired</h3>
            <p className="text-navy-700 mb-6">
              Get notified about new motivational content and exclusive updates.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Submit & Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}