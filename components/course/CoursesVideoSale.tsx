'use client'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/useTranslation'
import { useDirection } from '@/providers/DirectionProvider'
import { getPanelUrl } from '@/lib/panelUrl'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const VIMEO_VIDEO_ID = '773767998'
// Minimal controls: only play and volume (hide fullscreen, pip, cc, chapters, progress bar, etc.)
const VIMEO_EMBED_URL = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?title=0&byline=0&portrait=0&fullscreen=0&pip=0&cc=0&chapters=0&chromecast=0&quality_selector=0&transcript=0&progress_bar=0&vimeo_logo=0`

export default function CoursesVideoSale() {
  const { t } = useTranslation()
  const { locale } = useDirection()
  const isArabic = locale === 'ar'
  const panelUrl = getPanelUrl(locale)
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight

  return (
    <section
      className="relative overflow-hidden py-8 sm:py-10"
      aria-label={t('courses.videoSaleLabel')}
    >
      <div className="relative max-w-5xl mx-auto px-4">
        <div
          className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-10 ${
            isArabic ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Video */}
          <div className="w-full lg:w-[55%] flex-shrink-0">
            <div className="relative aspect-video max-h-[260px] sm:max-h-[320px] rounded-3xl overflow-hidden">
              <iframe
                src={VIMEO_EMBED_URL}
                title={t('courses.videoSaleLabel')}
                className="absolute inset-0 w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* CTA */}
          <div
            className={`flex flex-col items-center lg:items-start text-center lg:text-left flex-1 ${
              isArabic ? 'lg:items-end lg:text-right' : ''
            }`}
          >
            <p className="text-purple-600 text-sm font-medium tracking-widest uppercase mb-2">
              {t('courses.videoSaleBadge')}
            </p>
            <h2 className="text-purple-900 text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              {t('courses.videoSaleTitle')}
            </h2>
            <Button
              asChild
              size="lg"
              className="group bg-[rgb(236,72,153)] hover:bg-[rgb(190,24,93)] text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <a href={panelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                {t('courses.videoSaleCta')}
                <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
