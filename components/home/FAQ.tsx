'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslation } from '@/lib/useTranslation'

export default function FAQ() {
  const { t } = useTranslation()
  
  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 px-4 bg-neutral-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4 sm:mb-6">
            {t('faq.title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {t('faq.items').map((faq: any, index: number) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={faq.id} 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-purple-800 hover:text-pink-500 transition-all duration-300 text-sm sm:text-base group">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4 text-text-secondary leading-relaxed text-sm sm:text-base">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
