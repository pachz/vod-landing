'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/lib/useTranslation'
import { buildVimeoEmbedUrl } from '@/lib/vimeo'

const PROMO_VIMEO_URL = 'https://vimeo.com/1219201266'
const PROMO_POSTER_URL =
  'https://i.vimeocdn.com/video/2191338056-223fcbafcec9bb7e5c9f56d9fcf7b707dd5129797291b4ee02d5dd5a07c77eaf-d_1280'

export default function CoursesPromoVideo() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)

  const embedUrl = buildVimeoEmbedUrl(PROMO_VIMEO_URL, { autoplay: true })

  if (!embedUrl) return null

  return (
    <div
      className="overflow-hidden rounded-xl border border-white/70 bg-white p-1 shadow-lg"
      aria-label={t('courses.promoVideoPlay')}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-purple-900">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={t('courses.promoVideoTitle')}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pink-500"
            aria-label={t('courses.promoVideoPlay')}
          >
            {!posterFailed && (
              <Image
                src={PROMO_POSTER_URL}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 520px"
                onError={() => setPosterFailed(true)}
              />
            )}
            <div className="absolute inset-0 bg-purple-950/25" aria-hidden />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-pink-600 shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
                <svg
                  className="h-5 w-5 translate-x-0.5 sm:h-6 sm:w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7-11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
