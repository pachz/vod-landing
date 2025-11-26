import { NextResponse } from "next/server";
import { getCourseFeed, type CourseFeedRecord } from "@/lib/server/coursesFeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

interface CoursesResponseItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  instructor: string;
  thumbnailUrl: string;
  durationMinutes: number;
  durationLabel: string;
  studentsCount: number;
  rating: number;
  categoryKey: string;
  categoryLabel?: string;
  tags: string[];
}

function roundMinutesToNearestFive(minutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return 0;
  }
  const remainder = minutes % 5;
  const rounded =
    remainder >= 2 ? minutes + (5 - remainder) : minutes - remainder;
  return Math.round(rounded);
}

function formatDuration(minutes: number, locale: SupportedLocale): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  if (safeMinutes === 0) {
    return locale === "ar" ? "0د" : "0m";
  }
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes - hours * 60;
  if (hours === 0) {
    return locale === "ar"
      ? `${remainingMinutes}د`
      : `${remainingMinutes}m`;
  }
  const paddedMinutes = remainingMinutes.toString().padStart(2, "0");
  if (locale === "ar") {
    return `${hours}س ${paddedMinutes}د`;
  }
  return `${hours}h ${paddedMinutes}m`;
}

function toCategoryKey(value?: string): string {
  if (!value) {
    return "general";
  }
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

function mapToLocale(
  locale: SupportedLocale,
  courses: CourseFeedRecord[]
): CoursesResponseItem[] {
  return courses.map((course) => {
    const durationMinutes = roundMinutesToNearestFive(course.durationMinutes);
    const categoryLabel =
      locale === "ar" && course.categoryNameAr
        ? course.categoryNameAr
        : course.categoryNameEn;
    const categoryKey = toCategoryKey(
      course.categoryNameEn || course.categoryNameAr
    );
    return {
      id: course.slug || course.id,
      slug: course.slug || course.id,
      title:
        locale === "ar" && course.titleAr ? course.titleAr : course.titleEn,
      shortDescription:
        locale === "ar" && course.shortDescriptionAr
          ? course.shortDescriptionAr
          : course.shortDescriptionEn || "",
      instructor:
        locale === "ar" && course.instructorNameAr
          ? course.instructorNameAr
          : course.instructorNameEn || "",
      thumbnailUrl:
        course.coverImageUrl ??
        course.thumbnailImageUrl ??
        "/images/placeholder.svg",
      durationMinutes,
      durationLabel: formatDuration(durationMinutes, locale),
      studentsCount: course.studentsCount,
      rating: course.rating,
      categoryKey,
      categoryLabel,
      tags: [categoryKey],
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const records = await getCourseFeed();
    const items = mapToLocale(locale, records);
    return NextResponse.json({
      locale,
      items,
      cachedAt: Date.now(),
      ttlMs: 5 * 60 * 1000,
    });
  } catch (error) {
    console.error("[courses API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load courses data" },
      { status: 500 }
    );
  }
}


