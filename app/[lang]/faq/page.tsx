'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SiteFooter } from '@/components/layout'
import { useTranslation } from '@/lib/useTranslation'

export default function FAQPage() {
  const { t } = useTranslation()
  const items = t('faqPage.items') as Array<{ id: string; question: string; answer: string }>

  return (
    <div className="min-h-screen bg-neutral-bg">
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
              {t('faqPage.title')}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion
              type="single"
              collapsible
              className="space-y-3 sm:space-y-4"
            >
              {Array.isArray(items) &&
                items.map((faq: { id: string; question: string; answer: string }, index: number) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <AccordionItem
                      value={faq.id}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                    >
                      <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-start font-semibold text-purple-800 hover:text-pink-500 transition-all duration-300 text-sm sm:text-base group">
                        <span className="ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4 text-text-secondary leading-relaxed text-sm sm:text-base whitespace-pre-line text-justify">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
            </Accordion>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
