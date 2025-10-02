import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ExploreMarquee from '@/components/ExploreMarquee'
import RehamDivaShowcase from '@/components/InstructorsSlider'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import SiteFooter from '@/components/SiteFooter'

export default function ArabicHome() {
  return (
    <main className="min-h-screen">
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
