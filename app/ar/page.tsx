'use client'

import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ExploreMarquee from '@/components/ExploreMarquee'
import RehamDivaShowcase from '@/components/InstructorsSlider'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import SiteFooter from '@/components/SiteFooter'

// Sample data for the ExploreMarquee component
const sampleVideos = [
  {
    id: '1',
    title: 'بناء الثقة من الداخل',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w1.png',
    duration: '45 دقيقة',
    tags: ['confidence', 'personal-growth'],
    price: '$29',
    isFeatured: true
  },
  {
    id: '2',
    title: 'عادات يومية للنجاح',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w2.png',
    duration: '30 دقيقة',
    tags: ['habits', 'productivity'],
    price: '$19',
    isFeatured: false
  },
  {
    id: '3',
    title: 'القيادة ونمو المسيرة المهنية',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w3.png',
    duration: '60 دقيقة',
    tags: ['career', 'leadership'],
    price: '$39',
    isFeatured: true
  },
  {
    id: '4',
    title: 'اليقظة الذهنية والنمو العاطفي',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w4.png',
    duration: '40 دقيقة',
    tags: ['wellness', 'mindfulness'],
    price: '$24',
    isFeatured: false
  },
  {
    id: '5',
    title: 'تحويل نمط الحياة الصحي',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w5.png',
    duration: '50 دقيقة',
    tags: ['lifestyle', 'wellness'],
    price: '$34',
    isFeatured: false
  },
  {
    id: '6',
    title: 'التغلب على الشك الذاتي',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w6.png',
    duration: '35 دقيقة',
    tags: ['confidence', 'personal-growth'],
    price: '$27',
    isFeatured: true
  },
  {
    id: '7',
    title: 'الاستقلال المالي للمرأة',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w7.png',
    duration: '55 دقيقة',
    tags: ['finance', 'career'],
    price: '$44',
    isFeatured: false
  },
  {
    id: '8',
    title: 'التعبير الإبداعي والعلاج بالفن',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w8.png',
    duration: '40 دقيقة',
    tags: ['creativity', 'wellness'],
    price: '$29',
    isFeatured: false
  }
]

const sampleCategories = ['confidence', 'career', 'wellness', 'finance']

export default function ArabicHome() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ExploreMarquee 
        videos={sampleVideos}
        categories={sampleCategories}
        initialCategory="All"
        viewAllRoute="/ar/videos"
        marqueeSpeed={30}
        onCourseClick={(videoId) => {
          console.log('Course clicked:', videoId)
          // Navigate to course page
          if (typeof window !== 'undefined') {
            window.location.href = `/ar/courses/${videoId}`
          }
        }}
      />
      <RehamDivaShowcase />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </main>
  )
}
