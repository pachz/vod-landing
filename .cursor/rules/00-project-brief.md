// .cursor/rules/00-project-brief.md
# vod lady — Landing Page Build Brief

## Tech
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui components
- framer-motion (micro-animations)
- lucide-react (icons)
- i18n-ready (EN now, AR later), RTL-aware

## Brand Palette (Light theme)
- Navy / Primary: `#0A1F44`
- Navy (hover-700): `#0F2E6E`
- Navy (darker-900): `#08152B`
- Gold / Accent: `#C49A3A`
- Gold (hover/darker): `#A97C18`
- Gold (soft on light bg): `#E0C063`
- Neutral BG (light gray): `#F5F7FA`
- Text Primary: `#111827`
- Text Secondary: `#4B5563`
- Optional Dark BG: `#0F1115`

## Global Requirements
- Pixel-perfect **responsive** (mobile-first: 360–430px, tablet, desktop)
- Accessible (focus states, aria labels, prefers-reduced-motion)
- SEO (title/description/OG)
- RTL-ready (flip carousels/arrows; use `dir` logic)
- Clean TS (strict), no errors, no CLS (image aspect-ratio set)

## Files to Create
- `app/page.tsx`
- `components/Hero.tsx`
- `components/Features.tsx`
- `components/ExploreMarquee.tsx`
- `components/InstructorsSlider.tsx`
- `components/FAQ.tsx`
- `components/SiteFooter.tsx`
- `lib/data.ts` (mock: courses, instructors, faqs)
- `lib/i18n.ts`, `locales/en.json`
- `providers/DirectionProvider.tsx`
- Tailwind theme extension (colors above)
- Base styles in `app/globals.css`