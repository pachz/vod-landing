import { NextResponse } from "next/server";
import { getCourseFeed, type CourseFeedRecord } from "@/lib/server/coursesFeed";
import { getCoaches, type CoachRecord } from "@/lib/server/coaches";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

interface AdditionalCategoryResponse {
  id: string;
  name: string;
}

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
  additionalCategoryIds: string[];
  /** Resolved display names for additional categories (for listing cards) */
  additionalCategoryLabels: string[];
}

function normalizeIdForMatch(id: string): string {
  return (id ?? "").trim().toLowerCase();
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
  courses: CourseFeedRecord[],
  additionalCategoriesForLocale: AdditionalCategoryResponse[],
  coaches: CoachRecord[]
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
    const ids = course.additionalCategoryIds ?? [];
    const perCourse = course.additionalCategories ?? [];
    const additionalCategoryLabels =
      perCourse.length > 0
        ? perCourse.map((c) =>
            locale === "ar" && c.nameAr ? c.nameAr : c.nameEn || ""
          ).filter(Boolean)
        : ids
            .map((id) => {
              const norm = normalizeIdForMatch(id);
              const cat = additionalCategoriesForLocale.find(
                (c) => normalizeIdForMatch(c.id) === norm
              );
              return cat?.name ?? null;
            })
            .filter((name): name is string => Boolean(name));
    const coach =
      course.coachId != null
        ? coaches.find((c) => c.id === course.coachId)
        : undefined;
    const instructorName = coach
      ? locale === "ar"
        ? coach.nameAr || coach.nameEn
        : coach.nameEn || coach.nameAr
      : locale === "ar" && course.instructorNameAr
      ? course.instructorNameAr
      : course.instructorNameEn || "";

    return {
      id: course.slug || course.id,
      slug: course.slug || course.id,
      title:
        locale === "ar" && course.titleAr ? course.titleAr : course.titleEn,
      shortDescription:
        locale === "ar" && course.shortDescriptionAr
          ? course.shortDescriptionAr
          : course.shortDescriptionEn || "",
      instructor: instructorName,
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
      additionalCategoryIds: ids,
      additionalCategoryLabels,
    };
  });
}

function mapAdditionalCategoriesToLocale(
  locale: SupportedLocale,
  additionalCategories: { id: string; nameEn: string; nameAr: string }[]
): AdditionalCategoryResponse[] {
  return additionalCategories.map((c) => ({
    id: c.id,
    name:
      locale === "ar" && c.nameAr ? c.nameAr : c.nameEn || "",
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const { courses, additionalCategories } = await getCourseFeed();
    const coaches = await getCoaches();
    const additionalCategoriesForLocale = mapAdditionalCategoriesToLocale(
      locale,
      additionalCategories
    );
    const items = mapToLocale(
      locale,
      courses,
      additionalCategoriesForLocale,
      coaches
    );

    // Debug logging: verify coaches + instructors wiring
    console.log("[courses API] coaches count:", coaches.length);
    console.log(
      "[courses API] sample course coachIds:",
      courses.slice(0, 5).map((c) => ({
        id: c.id,
        coachId: c.coachId,
        instructorNameEn: c.instructorNameEn,
        instructorNameAr: c.instructorNameAr,
      }))
    );
    console.log(
      "[courses API] sample instructors sent to client:",
      items.slice(0, 5).map((c) => ({
        id: c.id,
        instructor: c.instructor,
      }))
    );

    return NextResponse.json({
      locale,
      items,
      additionalCategories: additionalCategoriesForLocale,
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


