import { randomUUID } from "crypto";
import { courses as staticCourses } from "@/lib/data";
import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const COURSES_ENDPOINT = "/courses";
const COURSES_CACHE_KEY = "courses-feed";
const COURSES_CACHE_TTL_MS = 10 * 1000;

interface ExternalCoursesApiResponse {
  courses?: ExternalCourseListItem[];
}

interface ExternalCourseListItem {
  id: string;
  slug?: string | null;
  titleEn: string;
  titleAr?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  instructorNameEn?: string | null;
  instructorNameAr?: string | null;
  categoryNameEn?: string | null;
  categoryNameAr?: string | null;
  durationMinutes?: number | null;
  studentsCount?: number | null;
  rating?: number | null;
  coverImageUrl?: string | null;
  thumbnailImageUrl?: string | null;
}

export interface CourseFeedRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleAr?: string;
  shortDescriptionEn?: string;
  shortDescriptionAr?: string;
  instructorNameEn?: string;
  instructorNameAr?: string;
  categoryNameEn?: string;
  categoryNameAr?: string;
  durationMinutes: number;
  studentsCount: number;
  rating: number;
  coverImageUrl?: string;
  thumbnailImageUrl?: string;
}

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizePositiveInteger(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value);
  return Math.max(0, rounded);
}

function sanitizeRating(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  const clamped = Math.min(Math.max(value, 0), 5);
  return Math.round(clamped * 10) / 10;
}

function sanitizeSlug(value: string | undefined, fallback: string): string {
  const trimmed = sanitizeString(value);
  if (!trimmed) {
    return fallback;
  }
  return trimmed;
}

function sanitizeUrl(value?: string | null): string | undefined {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    return undefined;
  }
  if (sanitized.startsWith("http") || sanitized.startsWith("https")) {
    return sanitized;
  }
  return sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
}

function parseDurationMinutesFromLabel(label?: string): number {
  if (!label) {
    return 0;
  }
  const match = label.match(/(\d+)/);
  if (!match) {
    return 0;
  }
  return Number.parseInt(match[1], 10);
}

function normalizeCourse(item: ExternalCourseListItem): CourseFeedRecord {
  const id = sanitizeString(item.id) ?? randomUUID();
  return {
    id,
    slug: sanitizeSlug(item.slug ?? undefined, id),
    titleEn: sanitizeString(item.titleEn) ?? "Untitled course",
    titleAr: sanitizeString(item.titleAr),
    shortDescriptionEn: sanitizeString(item.shortDescriptionEn),
    shortDescriptionAr: sanitizeString(item.shortDescriptionAr),
    instructorNameEn: sanitizeString(item.instructorNameEn),
    instructorNameAr: sanitizeString(item.instructorNameAr),
    categoryNameEn: sanitizeString(item.categoryNameEn),
    categoryNameAr: sanitizeString(item.categoryNameAr),
    durationMinutes: sanitizePositiveInteger(item.durationMinutes),
    studentsCount: sanitizePositiveInteger(item.studentsCount),
    rating: sanitizeRating(item.rating),
    coverImageUrl:
      sanitizeUrl(item.coverImageUrl) ??
      sanitizeUrl(item.thumbnailImageUrl) ??
      "/images/placeholder.svg",
    thumbnailImageUrl: sanitizeUrl(item.thumbnailImageUrl),
  };
}

function fallbackFromStatic(): CourseFeedRecord[] {
  return staticCourses.map((course) => {
    const duration = parseDurationMinutesFromLabel(course.duration);
    return {
      id: course.id,
      slug: course.id,
      titleEn: course.title,
      titleAr: course.titleAr,
      shortDescriptionEn: course.description,
      shortDescriptionAr: course.descriptionAr,
      instructorNameEn: course.instructor,
      instructorNameAr: course.instructorAr,
      categoryNameEn: course.category,
      categoryNameAr: course.category,
      durationMinutes: duration,
      studentsCount: 0,
      rating: 4.5,
      coverImageUrl: course.image,
      thumbnailImageUrl: course.image,
    };
  });
}

async function fetchCoursesFromApi(): Promise<CourseFeedRecord[]> {
  try {
    const payload = await fetchFromBackend<ExternalCoursesApiResponse>(
      COURSES_ENDPOINT
    );
    if (!payload || !Array.isArray(payload.courses)) {
      throw new Error("[courses feed] Unexpected API response shape");
    }
    return payload.courses.map(normalizeCourse);
  } catch (error) {
    console.error("[courses feed] Failed to reach backend API", error);
    return fallbackFromStatic();
  }
}

export async function getCourseFeed(): Promise<CourseFeedRecord[]> {
  try {
    return await getOrSetCacheValue(
      COURSES_CACHE_KEY,
      COURSES_CACHE_TTL_MS,
      fetchCoursesFromApi
    );
  } catch (error) {
    console.error(
      "[courses feed] Unable to retrieve data from external API. Using fallback.",
      error
    );
    return fallbackFromStatic();
  }
}


