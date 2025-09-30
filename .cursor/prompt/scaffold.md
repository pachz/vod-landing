// .cursor/prompts/scaffold.md
# Scaffold vod lady Project

You are an AI coding assistant.  
Read all files in `.cursor/rules/` and generate a **Next.js 14 (App Router)** project with **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **framer-motion**, and **lucide-react**.  

## Requirements
- Implement **all sections** as described in the rules (`Hero`, `Features`, `ExploreMarquee`, `InstructorsSlider`, `FAQ`, `Footer`).  
- Use the **navy + gold** palette from `00-project-brief.md` and `60-implementation-notes.md`.  
- **Mobile-first**, pixel-perfect responsive design (360–430px, tablet, desktop).  
- Accessibility: keyboard navigation, focus rings, aria labels, `prefers-reduced-motion`.  
- **RTL-ready** (use i18n strings, flip carousels/arrows when `dir=rtl`).  

## Generate
- `app/page.tsx` → compose all sections  
- `app/globals.css` → base styles (colors, focus rings, etc.)  
- `tailwind.config.ts` → extend with navy/gold palette  
- `components/`  
  - `Hero.tsx`  
  - `Features.tsx`  
  - `ExploreMarquee.tsx`  
  - `InstructorsSlider.tsx`  
  - `FAQ.tsx`  
  - `SiteFooter.tsx`  
  - `ui/` → use shadcn/ui primitives (Button, Card, Accordion, Input, Sheet, Badge)  
- `lib/data.ts` → sample data (courses, instructors, faqs)  
- `lib/i18n.ts` → minimal i18n provider with `t()`  
- `locales/en.json` → copy strings from rules (Hero, Features, etc.)  
- `providers/DirectionProvider.tsx` → set `<html dir>` (`ltr` default, ready for `rtl`)  
- `public/images/` → placeholder images  

## Acceptance
- Build runs with `pnpm dev` (or `npm run dev`) without errors.  
- TypeScript strict, no warnings.  
- No layout shift on initial paint.  
- Carousels/marquees smooth and swipeable.  
- Design matches rules (navy + gold).  