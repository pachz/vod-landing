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
    title: 'Building Confidence from Within',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w1.png',
    duration: '45 min',
    tags: ['confidence', 'personal-growth'],
    price: '$29',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Daily Habits for Success',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w2.png',
    duration: '30 min',
    tags: ['habits', 'productivity'],
    price: '$19',
    isFeatured: false
  },
  {
    id: '3',
    title: 'Leadership & Career Growth',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w3.png',
    duration: '60 min',
    tags: ['career', 'leadership'],
    price: '$39',
    isFeatured: true
  },
  {
    id: '4',
    title: 'Mindfulness & Emotional Growth',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w4.png',
    duration: '40 min',
    tags: ['wellness', 'mindfulness'],
    price: '$24',
    isFeatured: false
  },
  {
    id: '5',
    title: 'Healthy Lifestyle Transformation',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w5.png',
    duration: '50 min',
    tags: ['lifestyle', 'wellness'],
    price: '$34',
    isFeatured: false
  },
  {
    id: '6',
    title: 'Overcoming Self-Doubt',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w6.png',
    duration: '35 min',
    tags: ['confidence', 'personal-growth'],
    price: '$27',
    isFeatured: true
  },
  {
    id: '7',
    title: 'Financial Independence for Women',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w7.png',
    duration: '55 min',
    tags: ['finance', 'career'],
    price: '$44',
    isFeatured: false
  },
  {
    id: '8',
    title: 'Creative Expression & Art Therapy',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w8.png',
    duration: '40 min',
    tags: ['creativity', 'wellness'],
    price: '$29',
    isFeatured: false
  }
]

const sampleCategories = ['confidence', 'career', 'wellness', 'finance']

export default function EnglishHome() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ExploreMarquee 
        videos={sampleVideos}
        categories={sampleCategories}
        initialCategory="All"
        viewAllRoute="/en/videos"
        marqueeSpeed={30}
        onCourseClick={(videoId) => {
          console.log('Course clicked:', videoId)
          // Navigate to course page
          if (typeof window !== 'undefined') {
            window.location.href = `/en/courses/${videoId}`
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
