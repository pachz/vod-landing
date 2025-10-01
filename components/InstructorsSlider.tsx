'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function RehamDivaShowcase() {
  return (
    <section id="instructor" className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
            Meet Your Guide
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Start your journey to the self with Reham Diva
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-6xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
              {/* Image */}
              <div className="flex items-center justify-center order-2 lg:order-1">
                <Image
                  src="/images/reham.png"
                  alt="Reham Diva"
                  width={448}
                  height={512}
                  className="object-contain rounded-lg"
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 448px"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-1">
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-800">
                    Reham Diva
                  </h3>
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
                  <p className="text-pink-600 text-xl sm:text-2xl font-medium">
                    Feminine Awareness & Self-Love Coach
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full"></div>
                    <p className="text-gray-700 text-base leading-relaxed pl-6 italic">
                      "Start your journey to the self. As an Arab woman, married with children, and a developmental business owner, I was among those most in need of regaining balance in every part of my life—not only for myself but also for the people I love and who love me around me."
                    </p>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Today, after ten years of offering programs in feminine awareness and starting as the first female coach in femininity in the Arab world, I can share with you the secret of femininity: to be a woman connected to the present moment with ease, always from a place of love. This is what makes us women vary between our shine and radiance or become dim.
                  </p>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Regardless of your situation—whether married, divorced, or single, employed or business owner, homemaker, leader, or influencer—start your journey with me through programs and courses in femininity, masculinity, and self-love. These programs help you harness your gentle feminine power to achieve the life intentions you deserve, through the power of intention and entering the law of least effort, balancing giving and receiving.
                  </p>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Life does not need to be a wrestling arena; it can be a space for dancing and celebrating despite the challenges we sometimes face, and you become the most important, inspiring, and attractive woman in your surroundings.
                  </p>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Join me in the Reham Diva methodology programs if you seek balance between femininity and masculinity within yourself, or start the Reham Love program if you wish to balance femininity and masculinity in your romantic relationship. You can also access my audiobooks. Welcome to my world—the world of femininity and self-love.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-medium transition-all duration-300"
                  >
                    Explore Programs
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
