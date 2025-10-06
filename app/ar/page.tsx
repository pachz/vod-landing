'use client'

import { Hero, Features, ExploreMarquee, InstructorsSlider, Testimonials, FAQ } from '@/components/home'
import { SiteFooter } from '@/components/layout'

// Sample data for the ExploreMarquee component
const sampleVideos = [
  {
    id: '1',
    title: 'بناء الثقة من الداخل',
    description: 'دورة شاملة لبناء الثقة الداخلية والقوة الشخصية',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w1.png',
    totalTime: '45 دقيقة',
    totalStudents: 1250,
    rating: 4.8,
    tags: ['confidence', 'personal-growth'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'عادات يومية للنجاح',
    description: 'تعلم العادات اليومية التي تقودك للنجاح',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w2.png',
    totalTime: '30 دقيقة',
    totalStudents: 980,
    rating: 4.6,
    tags: ['habits', 'productivity'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'القيادة ونمو المسيرة المهنية',
    description: 'مهارات القيادة والتطوير المهني',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w3.png',
    totalTime: '60 دقيقة',
    totalStudents: 2100,
    rating: 4.9,
    tags: ['career', 'leadership'],
    isFeatured: true
  },
  {
    id: '4',
    title: 'اليقظة الذهنية والنمو العاطفي',
    description: 'تطوير الوعي الذهني والنمو العاطفي',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w4.png',
    totalTime: '40 دقيقة',
    totalStudents: 1500,
    rating: 4.7,
    tags: ['wellness', 'mindfulness'],
    isFeatured: false
  },
  {
    id: '5',
    title: 'تحويل نمط الحياة الصحي',
    description: 'خطوات عملية لتحويل نمط حياتك إلى نمط صحي',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w5.png',
    totalTime: '50 دقيقة',
    totalStudents: 1800,
    rating: 4.5,
    tags: ['lifestyle', 'wellness'],
    isFeatured: false
  },
  {
    id: '6',
    title: 'التغلب على الشك الذاتي',
    description: 'استراتيجيات للتغلب على الشك الذاتي وبناء الثقة',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w6.png',
    totalTime: '35 دقيقة',
    totalStudents: 1650,
    rating: 4.8,
    tags: ['confidence', 'personal-growth'],
    isFeatured: true
  },
  {
    id: '7',
    title: 'الاستقلال المالي للمرأة',
    description: 'مبادئ الاستقلال المالي وإدارة الأموال',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w7.png',
    totalTime: '55 دقيقة',
    totalStudents: 2200,
    rating: 4.9,
    tags: ['finance', 'career'],
    isFeatured: false
  },
  {
    id: '8',
    title: 'التعبير الإبداعي والعلاج بالفن',
    description: 'استكشاف الإبداع والعلاج بالفنون',
    instructor: 'رهام دیفا',
    thumbnailUrl: '/images/w8.png',
    totalTime: '40 دقيقة',
    totalStudents: 1200,
    rating: 4.6,
    tags: ['creativity', 'wellness'],
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
      <InstructorsSlider />
      <Testimonials />
      <FAQ />
      <SiteFooter />
    </main>
  )
}
