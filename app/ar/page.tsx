import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ExploreMarquee from '@/components/ExploreMarquee'
import RehamDivaShowcase from '@/components/InstructorsSlider'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import SiteFooter from '@/components/SiteFooter'
import LanguageDetection from '@/components/LanguageDetection'

export default function ArabicHome() {
  return (
    <main className="min-h-screen">
      <LanguageDetection />
      <Hero />
      <Features />
      <ExploreMarquee />
      <RehamDivaShowcase />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </main>
  )
}
