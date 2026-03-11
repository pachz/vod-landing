/**
 * When true, the homepage (Hero, Testimonials, FAQ, etc.) is hidden.
 * Root and lang routes redirect to /{lang}/courses. Main landing becomes /ar/courses.
 */
export const USE_COURSES_AS_HOME =
  process.env.NEXT_PUBLIC_USE_COURSES_AS_HOME === "true";
