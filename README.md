# Reham Diva - Landing Page

A motivational video platform landing page built with Next.js 14, TypeScript, Tailwind CSS, and modern web technologies.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Component Library**: shadcn/ui components with custom pink/purple theme
- **Animations**: Framer Motion for smooth micro-animations
- **Accessibility**: WCAG compliant with focus states, ARIA labels, and reduced motion support
- **Responsive Design**: Mobile-first approach (360px-430px, tablet, desktop)
- **RTL Ready**: Internationalization support with direction provider
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards

## 🎨 Design System

### Color Palette
- **Pink Primary**: `#EA8BB8`
- **Pink Hover**: `#D774A0`
- **Pink Dark**: `#B85C89`
- **Pink Soft**: `#F4B6D1`
- **Pink Light**: `#FBE4EE`
- **Purple Primary**: `#4A235A`
- **Purple Hover**: `#6C3483`
- **Purple Dark**: `#2E0F38`
- **Purple Soft**: `#A569BD`
- **Neutral BG**: `#F5F7FA`

### Typography
- **Font**: Inter (system font fallback)
- **Headings**: Bold, purple color
- **Body**: Regular weight, secondary text color

## 📱 Sections

1. **Hero**: Interactive question block with auto-scrolling image grid
2. **Features**: 6 feature cards with icons and descriptions
3. **Explore**: Animated marquee with course cards
4. **Instructors**: Paper-stack slider with instructor profiles
5. **FAQ**: Accordion-style frequently asked questions
6. **Footer**: Newsletter signup, social links, and navigation

## 🛠 Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Environment Variables

Create an `.env.local` file with the backend base URL and landing secret:

```
BACKEND_API_URL=https://api.example.com
LANDING_SECRET=super-secret-key
```

Carousel responses must include `id`, `slug`, `titleEn`, `titleAr`, `descriptionEn`, `descriptionAr`, `categoryNameEn`, `categoryNameAr`, `durationMinutes`, and `coverImageUrl`. Results are cached in memory for five minutes per server instance, and every request from the landing page sends the `LANDING_SECRET` header for authentication.

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page composition
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Hero.tsx             # Hero section
│   ├── Features.tsx         # Features section
│   ├── ExploreMarquee.tsx   # Course marquee
│   ├── InstructorsSlider.tsx # Instructor slider
│   ├── FAQ.tsx              # FAQ accordion
│   └── SiteFooter.tsx       # Footer component
├── app/api/
│   └── carousel/route.ts    # Backend proxy with caching
├── lib/
│   ├── data.ts              # Sample data
│   ├── i18n.ts              # Internationalization
│   ├── server/
│   │   ├── apiClient.ts     # Shared backend fetch helper
│   │   ├── carousel.ts      # External API fetcher + cache
│   │   └── memoryCache.ts   # Simple in-memory TTL cache
│   └── utils.ts             # Utility functions
├── locales/
│   └── en.json              # English translations
├── providers/
│   └── DirectionProvider.tsx # RTL/LTR direction provider
└── public/
    └── images/              # Placeholder images
```

## 🎯 Key Features

### Accessibility
- Keyboard navigation support
- Focus rings and ARIA labels
- Screen reader announcements
- Reduced motion preferences
- High contrast ratios

### Performance
- Static generation for fast loading
- Optimized images with Next.js Image
- Minimal layout shift (CLS)
- Efficient animations with Framer Motion

### Responsive Design
- Mobile-first approach
- Breakpoints: 360px, 768px, 1024px+
- Touch-friendly interactions
- Swipe gestures for mobile

## 🌐 Internationalization

The project is set up for easy localization:
- All text content in `locales/en.json`
- `t()` function for translations
- Direction provider for RTL support
- Ready for Arabic language addition

## 🚀 Deployment

The project builds to static files and can be deployed to:
- Vercel (recommended)
- Netlify
- Any static hosting service

## 📝 License

© 2025 Reham Diva. All rights reserved.
