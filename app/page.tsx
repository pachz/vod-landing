'use client'

import { useDirection } from '@/providers/DirectionProvider'
import { Hero, Features, ExploreMarquee, InstructorsSlider, Testimonials, FAQ } from '@/components/home'
import { SiteFooter } from '@/components/layout'

// Sample data for the ExploreMarquee component
const sampleVideos = [
  {
    id: '1',
    title: 'Building Confidence from Within',
    description: 'A comprehensive course on building inner confidence and personal strength',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w1.png',
    totalTime: '45 min',
    totalStudents: 1250,
    rating: 4.8,
    tags: ['confidence', 'personal-growth'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Daily Habits for Success',
    description: 'Learn the daily habits that lead to success',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w2.png',
    totalTime: '30 min',
    totalStudents: 980,
    rating: 4.6,
    tags: ['habits', 'productivity'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Leadership & Career Growth',
    description: 'Leadership skills and professional development',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w3.png',
    totalTime: '60 min',
    totalStudents: 2100,
    rating: 4.9,
    tags: ['career', 'leadership'],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Mindfulness & Emotional Growth',
    description: 'Developing mindfulness and emotional growth',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w4.png',
    totalTime: '40 min',
    totalStudents: 1500,
    rating: 4.7,
    tags: ['wellness', 'mindfulness'],
    isFeatured: false
  },
  {
    id: '5',
    title: 'Healthy Lifestyle Transformation',
    description: 'Practical steps to transform your lifestyle to a healthy one',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w5.png',
    totalTime: '50 min',
    totalStudents: 1800,
    rating: 4.5,
    tags: ['lifestyle', 'wellness'],
    isFeatured: false
  },
  {
    id: '6',
    title: 'Overcoming Self-Doubt',
    description: 'Strategies to overcome self-doubt and build confidence',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w6.png',
    totalTime: '35 min',
    totalStudents: 1650,
    rating: 4.8,
    tags: ['confidence', 'personal-growth'],
    isFeatured: true
  },
  {
    id: '7',
    title: 'Financial Independence for Women',
    description: 'Principles of financial independence and money management',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w7.png',
    totalTime: '55 min',
    totalStudents: 2200,
    rating: 4.9,
    tags: ['finance', 'career'],
    isFeatured: false
  },
  {
    id: '8',
    title: 'Creative Expression & Art Therapy',
    description: 'Exploring creativity and art therapy',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w8.png',
    totalTime: '40 min',
    totalStudents: 1200,
    rating: 4.6,
    tags: ['creativity', 'wellness'],
    isFeatured: false
  }
]

const sampleCategories = ['confidence', 'career', 'wellness', 'finance']

export default function Home() {
  const { locale } = useDirection()
  
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ExploreMarquee 
        videos={sampleVideos}
        categories={sampleCategories}
        initialCategory="All"
        viewAllRoute="/videos"
        marqueeSpeed={30}
        onCourseClick={(videoId) => {
          console.log('Course clicked:', videoId)
          // Navigate to language-specific course page
          if (typeof window !== 'undefined') {
            window.location.href = `/${locale}/courses/${videoId}`
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
