// .cursor/rules/10-hero-wireframe.md
# Section 1 — Hero (Wireframe & Copy)

## Layout
- Two columns on desktop; stacked on mobile.

### Left (Text & Interaction)
- **H1:** “Find Your Strength, Shape Your Future.”
- **Subheadline:** “Unlimited motivational classes in bite-sized episodes designed for women who want to grow.”
- **Question Block**
  - Title: “What brings you to vod lady today?”
  - Options (checkbox-style buttons):
    - Build confidence
    - Improve daily habits
    - Cultivate a healthy lifestyle
    - Boost career & leadership
    - Something else
  - **CTA:** “Continue”
    - Disabled by default; **enabled** once ≥ 1 option is selected.
    - Announce state change for screen readers.

### Right (Visuals)
- **Auto-scrolling Image Grid**
  - 4–6 portrait images
  - Two columns, variable heights
  - Smooth upward auto-scroll (loop) **or** timed crossfade slideshow
  - Content: instructor portraits, speaking, writing, lifestyle/thematic objects

## Motion & UX
- Text: fade-in / slide-from-left on load
- Grid: continuous auto-scroll (desktop + mobile)
- Respect `prefers-reduced-motion`
- Contrast AA with navy/gold palette