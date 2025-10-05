import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ExploreMarquee, { Video } from '@/components/ExploreMarquee'

// Mock Next.js router
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
})

// Sample test data
const testVideos: Video[] = [
  {
    id: '1',
    title: 'Test Video 1',
    instructor: 'Test Instructor',
    thumbnailUrl: '/test1.jpg',
    duration: '30 min',
    tags: ['confidence'],
    price: '$29',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Test Video 2',
    instructor: 'Test Instructor',
    thumbnailUrl: '/test2.jpg',
    duration: '45 min',
    tags: ['career'],
    price: '$39',
    isFeatured: false
  },
  {
    id: '3',
    title: 'Test Video 3',
    instructor: 'Test Instructor',
    thumbnailUrl: '/test3.jpg',
    duration: '60 min',
    tags: ['confidence', 'wellness'],
    price: '$49',
    isFeatured: true
  },
  {
    id: '4',
    title: 'Test Video 4',
    instructor: 'Test Instructor',
    thumbnailUrl: '/test4.jpg',
    duration: '20 min',
    tags: ['finance'],
    price: '$19',
    isFeatured: false
  },
  {
    id: '5',
    title: 'Test Video 5',
    instructor: 'Test Instructor',
    thumbnailUrl: '/test5.jpg',
    duration: '90 min',
    tags: ['creativity'],
    price: '$59',
    isFeatured: true
  }
]

const testCategories = ['confidence', 'career', 'wellness', 'finance', 'creativity']

describe('ExploreMarquee Component', () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('renders with default "All" category selected', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
    
    expect(screen.getByText('All')).toHaveClass('bg-pink-500')
    expect(screen.getByText('Test Video 1')).toBeInTheDocument()
  })

  it('filters videos by category when chip is clicked', async () => {
    const onCategoryChange = jest.fn()
    
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
        onCategoryChange={onCategoryChange}
      />
    )
    
    // Click on "confidence" category
    const confidenceChip = screen.getByText('confidence')
    fireEvent.click(confidenceChip)
    
    await waitFor(() => {
      expect(onCategoryChange).toHaveBeenCalledWith('confidence')
    })
    
    // Should show only videos with confidence tag
    expect(screen.getByText('Test Video 1')).toBeInTheDocument()
    expect(screen.getByText('Test Video 3')).toBeInTheDocument()
    expect(screen.queryByText('Test Video 2')).not.toBeInTheDocument()
  })

  it('shows empty state when no videos match category', async () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={['nonexistent']}
      />
    )
    
    // Click on "nonexistent" category
    const nonexistentChip = screen.getByText('nonexistent')
    fireEvent.click(nonexistentChip)
    
    await waitFor(() => {
      expect(screen.getByText('No videos found in this category')).toBeInTheDocument()
    })
  })

  it('shows View All button when more than 4 videos match', () => {
    const manyVideos = Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Video ${i + 1}`,
      instructor: 'Test Instructor',
      thumbnailUrl: `/test${i + 1}.jpg`,
      duration: '30 min',
      tags: ['confidence'],
      price: '$29',
      isFeatured: false
    }))
    
    render(
      <ExploreMarquee 
        videos={manyVideos}
        categories={testCategories}
      />
    )
    
    expect(screen.getByText(/View All/)).toBeInTheDocument()
  })

  it('calls onViewAllClick when View All button is clicked', () => {
    const onViewAllClick = jest.fn()
    const manyVideos = Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Test Video ${i + 1}`,
      instructor: 'Test Instructor',
      thumbnailUrl: `/test${i + 1}.jpg`,
      duration: '30 min',
      tags: ['confidence'],
      price: '$29',
      isFeatured: false
    }))
    
    render(
      <ExploreMarquee 
        videos={manyVideos}
        categories={testCategories}
        onViewAllClick={onViewAllClick}
      />
    )
    
    const viewAllButton = screen.getByText(/View All/)
    fireEvent.click(viewAllButton)
    
    expect(onViewAllClick).toHaveBeenCalled()
  })

  it('calls onCourseClick when course card is clicked', () => {
    const onCourseClick = jest.fn()
    
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
        onCourseClick={onCourseClick}
      />
    )
    
    const courseButton = screen.getByText('View Course')
    fireEvent.click(courseButton)
    
    expect(onCourseClick).toHaveBeenCalledWith('1')
  })

  it('uses custom viewCourseLabel', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
        viewCourseLabel="Start Learning"
      />
    )
    
    expect(screen.getByText('Start Learning')).toBeInTheDocument()
    expect(screen.queryByText('View Course')).not.toBeInTheDocument()
  })

  it('supports keyboard navigation for category chips', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
    
    const confidenceChip = screen.getByText('confidence')
    confidenceChip.focus()
    
    // Test Enter key
    fireEvent.keyDown(confidenceChip, { key: 'Enter' })
    expect(confidenceChip).toHaveAttribute('aria-selected', 'true')
    
    // Test Space key
    const careerChip = screen.getByText('career')
    careerChip.focus()
    fireEvent.keyDown(careerChip, { key: ' ' })
    expect(careerChip).toHaveAttribute('aria-selected', 'true')
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
    
    // Check tablist role
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    
    // Check tab roles
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(6) // "All" + 5 categories
    
    // Check aria-selected attributes
    expect(screen.getByText('All')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('confidence')).toHaveAttribute('aria-selected', 'false')
  })

  it('respects reduced motion preference', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
        reduceMotionFallback={true}
      />
    )
    
    // The marquee should be present but animations should be disabled
    expect(screen.getByText('Discover courses that inspire your next step')).toBeInTheDocument()
  })

  it('uses custom initial category', () => {
    render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
        initialCategory="confidence"
      />
    )
    
    expect(screen.getByText('confidence')).toHaveClass('bg-pink-500')
    expect(screen.getByText('All')).not.toHaveClass('bg-pink-500')
  })

  it('shows correct number of videos for different screen sizes', () => {
    // Test desktop (4 videos)
    Object.defineProperty(window, 'innerWidth', { value: 1200 })
    
    const { rerender } = render(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
    
    // Should show all 5 videos on desktop
    expect(screen.getByText('Test Video 1')).toBeInTheDocument()
    expect(screen.getByText('Test Video 5')).toBeInTheDocument()
    
    // Test tablet (2 videos)
    Object.defineProperty(window, 'innerWidth', { value: 768 })
    rerender(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
    
    // Test mobile (1 video)
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    rerender(
      <ExploreMarquee 
        videos={testVideos}
        categories={testCategories}
      />
    )
  })
})
