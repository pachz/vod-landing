// .cursor/rules/40-instructors-slider-wireframe.md
# Section 4 — Meet the Instructors (Paper-Stack Slider)

## Layout
- **H2:** “Learn from inspiring voices”
- **H3:** “Meet the women and mentors who guide you through every step of your journey.”
- **Slider** (paper-stack effect):
  - Each slide = `InstructorCard`
    - Image (left / top on mobile)
    - Text (right / bottom): name, tagline, 1–2 line statement
    - CTA: “Explore Courses” or “Watch Intro”
  - UI:
    - Active slide centered, full view
    - Next/prev slides **peek** from behind (stacked paper look)
    - If only 1 slide exists, center single card; hide arrows/dots gracefully

## Behavior
- Optional autoplay (pause on hover)
- Manual arrows/dots; swipeable on mobile
- Smooth “flip/stack” transition
- RTL-aware arrows

## Example copy
- Slide 1 (Main Lady)
  - **Name:** Sarah Khalil
  - **Tagline:** Motivational Speaker & Life Coach
  - **Statement:** “I believe every woman has the strength to design her future. Let’s take the first step together.”
  - **CTA:** Watch Her Story
- Slide 2
  - **Name:** Layla Hassan
  - **Tagline:** Wellness & Lifestyle Mentor
  - **Statement:** “Small daily habits build lifelong confidence and energy.”
  - **CTA:** Explore Her Courses
- Slide 3
  - **Name:** Maya Al Zahra
  - **Tagline:** Career & Leadership Coach
  - **Statement:** “Unlock your potential, lead with purpose, and inspire others.”
  - **CTA:** Start Learning
- Slide 4
  - **Name:** Nora Al Sabah
  - **Tagline:** Mindfulness & Emotional Growth
  - **Statement:** “Inner peace is the foundation of true success.”
  - **CTA:** Join Her Sessions