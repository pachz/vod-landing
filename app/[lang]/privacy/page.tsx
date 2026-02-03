'use client'

import { SiteFooter } from '@/components/layout'
import { useTranslation } from '@/lib/useTranslation'

type Section = { title: string; body: string; list?: string[] }

export default function PrivacyPage() {
  const { t, locale } = useTranslation()
  const sections = (t('privacyPage.sections') ?? []) as Section[]
  const dateStr = new Date().toLocaleDateString(locale === 'ar' ? 'ar' : 'en')

  return (
    <div className="min-h-screen bg-neutral-bg">
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-text-primary mb-8">{t('privacyPage.title')}</h1>
          <p className="text-sm text-text-secondary mb-8">
            {t('privacyPage.lastUpdated')} {dateStr}
          </p>

          <div className="prose prose-lg max-w-none text-text-primary space-y-6">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <p className="text-text-secondary leading-relaxed">{section.body}</p>
                {section.list?.length ? (
                  <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4 mt-4">
                    {section.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
