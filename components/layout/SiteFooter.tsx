'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'
import { useDirection } from '@/providers/DirectionProvider'
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  Music 
} from 'lucide-react'

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Music, href: '#', label: 'TikTok' },
]

export default function SiteFooter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { direction } = useDirection()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <div className={`mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 ${direction === 'rtl' ? 'sm:space-x-reverse sm:space-x-6' : 'sm:space-x-6'}`}>
              <Image 
                src="/images/RehamDivaLogoWithText.png" 
                alt="Reham Diva" 
                width={200}
                height={112}
                className="h-20 sm:h-24 lg:h-28 w-auto"
                sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
              />
              <div className={`flex flex-col text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'} px-4 sm:px-0`}>
                <h4 className="text-base sm:text-lg font-semibold text-pink-500 mb-2 sm:mb-3">{t('footer.branding.tagline')}</h4>
                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 leading-relaxed">{t('footer.mission')}</p>
                <div className={`flex justify-center ${direction === 'rtl' ? 'sm:justify-end' : 'sm:justify-start'} gap-3 sm:gap-4`}>
                  {(direction === 'rtl' ? [...socialLinks].reverse() : socialLinks).map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-500/10 hover:bg-pink-500/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.sections.navigation')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.navigation.courses')}</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.navigation.about')}</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.navigation.blog')}</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.navigation.contact')}</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.sections.support')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.support.faq')}</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.support.terms')}</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-pink-500 transition-colors">{t('footer.support.privacy')}</a></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}>{t('footer.sections.newsletter')}</h4>
            <p className={`text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}>
              {t('footer.newsletter.title')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white/10 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 text-sm sm:text-base ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                required
              />
              <Button 
                type="submit" 
                size="sm" 
                className="w-full bg-pink-500 hover:bg-pink-700 text-white text-sm sm:text-base"
                disabled={isSubscribed}
              >
                {isSubscribed ? t('footer.newsletter.subscribed') : t('footer.newsletter.subscribe')}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400"
        >
          <p className="text-xs sm:text-sm">{t('footer.copyright')}</p>
        </motion.div>
      </div>
    </footer>
  )
}
