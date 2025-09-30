// .cursor/rules/60-implementation-notes.md

# Implementation Notes (Theme, i18n, Accessibility)

## Tailwind Theme

Extend `theme.colors`:

```ts
navy: {
  900: '#08152B',
  800: '#0A1F44',
  700: '#0F2E6E',
},
gold: {
  DEFAULT: '#C49A3A',
  700: '#A97C18',
  300: '#E0C063',
},
neutral: {
  bg: '#F5F7FA',
}
```

## Base Styles (`app/globals.css`)

* Set CSS vars for colors above
* Body bg: `var(--neutral-bg)`; text: `#111827`
* Focus ring visible; smooth scroll; images with `aspect-ratio` or width/height

## i18n & RTL

* Minimal provider: `lib/i18n.ts` + `locales/en.json`
* All strings via `t('...')` for Arabic later
* `providers/DirectionProvider.tsx`: set `<html dir="ltr|rtl">`
* Carousels & chevrons flip in RTL (Tailwind `rtl:rotate-180`)

## Components (shadcn/ui)

* Buttons: Primary (Gold filled), Secondary (Navy outline), Ghost
* Cards with rounded-2xl, soft shadow
* Accordion for FAQ, Sheet for mobile menu
* Inputs with proper labels and aria attributes

## Animation

* framer-motion `whileInView` for sections
* Respect `prefers-reduced-motion`
* Avoid CLS: lock image sizes

## Acceptance

* TS strict, no errors
* Lighthouse: no layout shift on initial paint
* Excellent mobile UX; tap targets ≥ 44px
* Smooth marquees/sliders; hover slows desktop, swipe on mobile

