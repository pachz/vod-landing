'use client'

import { useState } from 'react'
import ExploreMarquee, { Video } from '@/components/ExploreMarquee'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Extended sample data for comprehensive testing
const demoVideos: Video[] = [
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
  },
  {
    id: '9',
    title: 'Advanced Leadership Strategies',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w3.png',
    duration: '75 min',
    tags: ['leadership', 'career'],
    price: '$49',
    isFeatured: true
  },
  {
    id: '10',
    title: 'Mindful Productivity Techniques',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w4.png',
    duration: '35 min',
    tags: ['productivity', 'mindfulness'],
    price: '$22',
    isFeatured: false
  },
  {
    id: '11',
    title: 'Financial Planning for Beginners',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w7.png',
    duration: '65 min',
    tags: ['finance', 'personal-growth'],
    price: '$37',
    isFeatured: false
  },
  {
    id: '12',
    title: 'Creative Writing for Self-Expression',
    instructor: 'Reham Diva',
    thumbnailUrl: '/images/w8.png',
    duration: '45 min',
    tags: ['creativity', 'personal-growth'],
    price: '$31',
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
