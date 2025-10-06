'use client'

import { useState } from 'react'
import { ExploreMarquee } from '@/components/home'
import { Video } from '@/components/course'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Extended sample data for comprehensive testing
const demoVideos: Video[] = [
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
  },
  {
    id: '9',
    title: 'Advanced Leadership Strategies',
    description: 'Advanced strategies for effective leadership',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w3.png',
    totalTime: '75 min',
    totalStudents: 1800,
    rating: 4.9,
    tags: ['leadership', 'career'],
    isFeatured: true
  },
  {
    id: '10',
    title: 'Mindful Productivity Techniques',
    description: 'Productivity techniques with mindfulness approach',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w4.png',
    totalTime: '35 min',
    totalStudents: 1400,
    rating: 4.7,
    tags: ['productivity', 'mindfulness'],
    isFeatured: false
  },
  {
    id: '11',
    title: 'Financial Planning for Beginners',
    description: 'Basic financial planning and money management',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w7.png',
    totalTime: '65 min',
    totalStudents: 1900,
    rating: 4.8,
    tags: ['finance', 'personal-growth'],
    isFeatured: false
  },
  {
    id: '12',
    title: 'Creative Writing for Self-Expression',
    description: 'Using creative writing for personal expression',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w8.png',
    totalTime: '45 min',
    totalStudents: 1100,
    rating: 4.6,
    tags: ['creativity', 'personal-growth'],
    isFeatured: true
  }
]

const demoCategories = ['confidence', 'career', 'wellness', 'finance']

export default function DemoPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [marqueeSpeed, setMarqueeSpeed] = useState(30)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [viewAllClicks, setViewAllClicks] = useState(0)
  const [courseClicks, setCourseClicks] = useState(0)
  const [viewCourseLabel, setViewCourseLabel] = useState('View Course')

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    console.log('Category changed to:', category)
  }

  const handleViewAllClick = () => {
    setViewAllClicks(prev => prev + 1)
    console.log('View All clicked!')
    alert(`View All clicked! This would navigate to /videos. Click count: ${viewAllClicks + 1}`)
  }

  const handleCourseClick = (videoId: string) => {
    setCourseClicks(prev => prev + 1)
    console.log('Course clicked:', videoId)
    alert(`Course clicked! Video ID: ${videoId}. Click count: ${courseClicks + 1}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ExploreMarquee Component Demo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Current State</h3>
              <p className="text-sm text-gray-600">Selected: {selectedCategory}</p>
              <p className="text-sm text-gray-600">View All clicks: {viewAllClicks}</p>
              <p className="text-sm text-gray-600">Course clicks: {courseClicks}</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Marquee Speed</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={marqueeSpeed === 15 ? "default" : "outline"}
                  onClick={() => setMarqueeSpeed(15)}
                >
                  Fast (15s)
                </Button>
                <Button 
                  size="sm" 
                  variant={marqueeSpeed === 30 ? "default" : "outline"}
                  onClick={() => setMarqueeSpeed(30)}
                >
                  Normal (30s)
                </Button>
                <Button 
                  size="sm" 
                  variant={marqueeSpeed === 60 ? "default" : "outline"}
                  onClick={() => setMarqueeSpeed(60)}
                >
                  Slow (60s)
                </Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <Button 
                size="sm" 
                variant={reduceMotion ? "default" : "outline"}
                onClick={() => setReduceMotion(!reduceMotion)}
              >
                {reduceMotion ? "Enable Motion" : "Reduce Motion"}
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">CTA Label</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={viewCourseLabel === "View Course" ? "default" : "outline"}
                  onClick={() => setViewCourseLabel("View Course")}
                >
                  Default
                </Button>
                <Button 
                  size="sm" 
                  variant={viewCourseLabel === "Start Learning" ? "default" : "outline"}
                  onClick={() => setViewCourseLabel("Start Learning")}
                >
                  Start Learning
                </Button>
                <Button 
                  size="sm" 
                  variant={viewCourseLabel === "Watch Now" ? "default" : "outline"}
                  onClick={() => setViewCourseLabel("Watch Now")}
                >
                  Watch Now
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Test scenarios:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Click category chips to filter videos</li>
              <li>Use Tab key to navigate between chips</li>
              <li>Press Enter/Space on focused chips to select</li>
              <li>Try &quot;creativity&quot; category (should show 2 videos)</li>
              <li>Try &quot;productivity&quot; category (should show 2 videos)</li>
              <li>Try &quot;nonexistent&quot; category (should show empty state)</li>
              <li>Click &quot;View All&quot; buttons to test navigation</li>
              <li>Click individual course cards to test CTA buttons</li>
              <li>Test keyboard navigation on course cards</li>
              <li>Toggle reduced motion to see animation changes</li>
              <li>Try different CTA labels to see customization</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Component Demo */}
      <ExploreMarquee 
        videos={demoVideos}
        categories={demoCategories}
        initialCategory="All"
        onCategoryChange={handleCategoryChange}
        onViewAllClick={handleViewAllClick}
        viewAllRoute="/videos"
        marqueeSpeed={marqueeSpeed}
        reduceMotionFallback={reduceMotion}
        viewCourseLabel={viewCourseLabel}
        onCourseClick={handleCourseClick}
      />
    </div>
  )
}
