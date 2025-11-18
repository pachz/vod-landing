"use client";

import {
  Hero,
  Features,
  ExploreMarquee,
  InstructorsSlider,
  Testimonials,
  FAQ,
} from "@/components/home";
import { SiteFooter } from "@/components/layout";
import { useDirection } from "@/providers/DirectionProvider";

export default function LangHomePage() {
  const { locale } = useDirection();
  return (
    <main className="min-h-screen">
      <Hero />
      <ExploreMarquee viewAllRoute={`/${locale}/courses`} marqueeSpeed={30} />
      <InstructorsSlider />
      <Features />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </main>
  );
}
