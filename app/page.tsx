import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ExploreMarquee from '@/components/ExploreMarquee'
import InstructorsSlider from '@/components/InstructorsSlider'
import FAQ from '@/components/FAQ'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ExploreMarquee />
      <InstructorsSlider />
      <FAQ />
      <SiteFooter />
    </main>
  )
}
