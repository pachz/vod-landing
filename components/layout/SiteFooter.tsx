'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { t } from '@/lib/i18n'
import { useDirection } from '@/providers/DirectionProvider'
import { getPanelUrl } from '@/lib/panelUrl'
import { 
  Facebook,
  Instagram, 
  Twitter,
  Youtube, 
  Send,
  MessageCircle
} from 'lucide-react'

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/rehamalrashidipage', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/rehamhouse', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/rehamalrashidi', label: 'X (Twitter)' },
  { icon: Youtube, href: 'https://www.youtube.com/user/rehamalrashidi', label: 'YouTube' },
  { icon: Send, href: 'https://t.me/rehamalrashidi', label: 'Telegram' },
  { icon: MessageCircle, href: 'https://wa.me/+96550406406', label: 'WhatsApp' },
]

const footerNavigationItems = [
  { labelKey: 'footer.navigation.home', href: '#home' },
  { labelKey: 'footer.navigation.courses', href: '/courses', isPage: true }
]

const footerSupportItems = [
  { labelKey: 'footer.support.faq', href: '/faq', isPage: true },
  { labelKey: 'footer.support.terms', href: '/terms', isPage: true },
  { labelKey: 'footer.support.privacy', href: '/privacy', isPage: true }
]

interface SiteFooterProps {
  /** Pass from server to avoid hydration mismatch. */
  panelUrl?: string
}

export default function SiteFooter({ panelUrl: panelUrlProp }: SiteFooterProps = {}) {
  const { direction, locale } = useDirection()
  const panelUrl = panelUrlProp ?? getPanelUrl(locale)

  const handleFooterNavigation = (item: { href: string; isPage?: boolean }) => {
    if (typeof window === 'undefined') return

    const basePath = locale === 'ar' ? '/ar' : locale === 'en' ? '/en' : ''
    const isLandingPage = ['/', '/ar', '/en'].includes(window.location.pathname)

    if (item.isPage) {
      const normalizedPath = item.href.startsWith('/') ? item.href : `/${item.href}`
      const base = basePath || ''
      window.location.href = `${base}${normalizedPath}`
      return
    }

    if (isLandingPage) {
      const element = document.querySelector(item.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      const base = basePath || '/'
      window.location.href = `${base}${item.href}`
    }
  }

  return (
    <footer className="bg-fuschia text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                src="/images/RehamDivaLogoWithText-White.png" 
                alt="Reham Diva" 
                width={200}
                height={112}
                className="h-20 sm:h-24 lg:h-28 w-auto"
                sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
              />
              <div className={`flex flex-col text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'} px-4 sm:px-0`}>
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{t('footer.branding.tagline')}</h4>
                <p className="text-xs sm:text-sm text-white/90 mb-4 sm:mb-6 leading-relaxed">{t('footer.mission')}</p>
                <div
                  className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-center ${direction === 'rtl' ? 'sm:justify-end' : 'sm:justify-start'} gap-3 sm:gap-4`}
                >
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
              {footerNavigationItems.map((item) => (
                <li key={item.labelKey}>
                  <button
                    onClick={() => handleFooterNavigation(item)}
                    className="text-sm sm:text-base text-white/90 hover:text-white transition-colors"
                  >
                    {t(item.labelKey)}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={panelUrl}
                  className="text-sm sm:text-base text-white/90 hover:text-white transition-colors"
                >
                  {t('footer.navigation.signIn')}
                </a>
              </li>
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
              {footerSupportItems.map((item) => (
                <li key={item.labelKey}>
                  <button
                    onClick={() => handleFooterNavigation(item)}
                    className="text-sm sm:text-base text-white/90 hover:text-white transition-colors"
                  >
                    {t(item.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-white/80"
        >
          <p className="text-xs sm:text-sm">{t('footer.copyright').replace('{{year}}', String(new Date().getFullYear()))}</p>
        </motion.div>
      </div>
    </footer>
  )
}
