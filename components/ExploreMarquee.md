# ExploreMarquee Component

A responsive, accessible video exploration component with decorative marquee background and interactive category filtering.

## Features

- **Category Filtering**: Interactive chips to filter videos by category
- **Responsive Preview**: Shows 1-4 videos based on screen size (mobile/tablet/desktop)
- **Decorative Marquee**: Animated background with reduced motion support
- **Accessibility**: Full keyboard navigation and screen reader support
- **Smooth Transitions**: Animated category changes and video filtering
- **View All CTA**: Configurable navigation when more videos are available

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videos` | `Video[]` | **Required** | Array of video objects to display |
| `categories` | `string[]` | **Required** | Array of category names for filtering |
| `initialCategory` | `string` | `"All"` | Initial selected category |
| `onCategoryChange` | `(category: string) => void` | `undefined` | Callback when category changes |
| `onViewAllClick` | `() => void` | `undefined` | Callback when View All is clicked |
| `viewAllRoute` | `string` | `"/videos"` | Route to navigate to when View All is clicked |
| `marqueeSpeed` | `number` | `30` | Marquee animation speed in seconds |
| `reduceMotionFallback` | `boolean` | `false` | Force reduced motion (overrides user preference) |
| `viewCourseLabel` | `string` | `"View Course"` | Label for the course CTA button |
| `onCourseClick` | `(videoId: string) => void` | `undefined` | Callback when a course card is clicked |

## Video Interface

```typescript
interface Video {
  id: string
  title: string
  instructor: string
  thumbnailUrl: string
  duration: string
  tags: string[]
  price: string
  isFeatured: boolean
}
```

## Usage Examples

### Basic Usage

```tsx
import ExploreMarquee from '@/components/ExploreMarquee'

const videos = [
  {
    id: '1',
    title: 'Building Confidence',
    instructor: 'Sarah Khalil',
    thumbnailUrl: '/images/video1.jpg',
    duration: '45 min',
    tags: ['confidence', 'personal-growth'],
    price: '$29',
    isFeatured: true
  }
  // ... more videos
]

const categories = ['confidence', 'career', 'wellness', 'finance']

<ExploreMarquee 
  videos={videos}
  categories={categories}
/>
```

### With Custom Configuration

```tsx
<ExploreMarquee 
  videos={videos}
  categories={categories}
  initialCategory="confidence"
  onCategoryChange={(category) => console.log('Selected:', category)}
  onViewAllClick={() => router.push('/all-videos')}
  viewAllRoute="/videos"
  marqueeSpeed={45}
  reduceMotionFallback={false}
  viewCourseLabel="Start Learning"
  onCourseClick={(videoId) => router.push(`/courses/${videoId}`)}
/>
```

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Semantic HTML**: Uses proper heading hierarchy and landmarks

### Keyboard Shortcuts

- **Tab**: Navigate between category chips
- **Enter/Space**: Select focused category chip
- **Tab**: Navigate to video cards and View All button

## Responsive Behavior

| Screen Size | Videos Shown | Grid Layout |
|-------------|--------------|-------------|
| Mobile (< 768px) | 1 | 1 column |
| Tablet (768px - 1024px) | 2 | 2 columns |
| Desktop (> 1024px) | 4 | 4 columns |

## Animation & Transitions

- **Category Changes**: Smooth fade/slide transitions (300ms)
- **Marquee Animation**: Configurable speed with hover pause
- **Reduced Motion**: Disables animations when user prefers reduced motion
- **Hover Effects**: Scale and shadow effects on video cards

## Configuration Options

### Marquee Speed
```tsx
<ExploreMarquee 
  marqueeSpeed={15} // Fast
  marqueeSpeed={30} // Normal (default)
  marqueeSpeed={60} // Slow
/>
```

### Reduced Motion
```tsx
<ExploreMarquee 
  reduceMotionFallback={true} // Force reduced motion
/>
```

### Custom Navigation
```tsx
<ExploreMarquee 
  onViewAllClick={() => {
    // Custom navigation logic
    analytics.track('view_all_clicked')
    router.push('/custom-videos-page')
  }}
  onCourseClick={(videoId) => {
    // Custom course navigation
    analytics.track('course_clicked', { videoId })
    router.push(`/custom-course-page/${videoId}`)
  }}
/>
```

### Custom CTA Labels
```tsx
<ExploreMarquee 
  viewCourseLabel="Start Learning"
  // or
  viewCourseLabel="Watch Now"
  // or for Arabic
  viewCourseLabel="عرض الدورة"
/>
```

## Testing

The component includes comprehensive tests covering:

- Default category selection
- Category filtering functionality
- Empty state handling
- View All button behavior
- Keyboard navigation
- Accessibility attributes
- Responsive behavior

Run tests with:
```bash
npm test ExploreMarquee
```

## Demo Page

Visit `/demo` to see the component in action with:
- Interactive controls for testing different configurations
- Real-time state display
- Test scenarios for all features
- Accessibility testing tools

## Browser Support

- Modern browsers with CSS Grid support
- Reduced motion preference support
- Touch device support for marquee interaction
