import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/server/siteUrl";
import { getCourseFeed } from "@/lib/server/coursesFeed";

/** Regenerate sitemap periodically; course URLs still come from getCourseFeed() (memory-cached). */
export const revalidate = 300;

const LOCALES = ["en", "ar"] as const;

const STATIC_SEGMENTS = ["", "courses", "subscription", "tests", "terms", "privacy", "faq"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const { courses } = await getCourseFeed();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const segment of STATIC_SEGMENTS) {
      const path = segment === "" ? "" : `/${segment}`;
      entries.push({
        url: `${base}/${locale}${path}`,
        changeFrequency:
          segment === ""
            ? "weekly"
            : segment === "courses"
              ? "daily"
              : "monthly",
        priority:
          segment === "" ? 1 : segment === "courses" ? 0.9 : 0.5,
      });
    }

    for (const course of courses) {
      const id = course.slug || course.id;
      entries.push({
        url: `${base}/${locale}/course/${encodeURIComponent(id)}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
