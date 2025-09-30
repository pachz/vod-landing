// .cursor/rules/30-explore-marquee-wireframe.md
# Section 3 — Explore Courses (Animated Background Rows)

## Layout
- **Background:** 1 horizontal row of `CourseCard` moving in opposite directions (infinite auto-scroll)
  - Continuous on desktop & mobile
  - **Desktop hover:** slows hovered row by ~70%
  - **Mobile:** auto-moving; users can swipe to interact
- **Foreground (center overlay):**
  - **H2:** “Discover courses that inspire your next step”
  - **Subtitle:** “From confidence to career — find your path in short, motivational courses.”
  - **CTA Primary:** “View All Courses” → `/courses`
  - **Optional category chips:** `/courses?category=<slug>`

## Mobile UX
- Slower base speed for readability
- Overlay ~60% viewport height for legibility
- Primary CTA: full-width, sticky below overlay

## Behavior & Animations
- Base auto-scroll ~15s per loop (desktop), slower on mobile
- Swipe overrides auto-scroll momentarily; then resumes
- Cards hover/tap: lift + shadow
- Infinite loop with seamless re-entry (no visible gaps)