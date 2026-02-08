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

interface LangHomePageClientProps {
  panelUrl: string;
}

export default function LangHomePageClient({ panelUrl }: LangHomePageClientProps) {
  const { locale } = useDirection();
  return (
    <main className="min-h-screen">
      <Hero panelUrl={panelUrl} />
      <ExploreMarquee viewAllRoute={`/${locale}/courses`} marqueeSpeed={30} />
      <InstructorsSlider />
      <Features panelUrl={panelUrl} />
      <Testimonials />
      <FAQ />
      <SiteFooter panelUrl={panelUrl} />
    </main>
  );
}
