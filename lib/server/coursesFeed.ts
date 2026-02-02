import { randomUUID } from "crypto";
import { courses as staticCourses } from "@/lib/data";
import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const COURSES_ENDPOINT = "/courses";
const COURSES_CACHE_KEY = "courses-feed";
const COURSES_CACHE_TTL_MS = 30 * 1000;

export interface AdditionalCategoryRecord {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface ExternalCoursesApiResponse {
  courses?: ExternalCourseListItem[];
  additionalCategoryIds?: string[];
  additionalCategories?: { id: string; nameEn: string; nameAr: string }[];
}

/** Per-course additional category (when backend sends full objects on list items) */
interface ExternalPerCourseCategory {
  id: string;
  nameEn?: string | null;
  nameAr?: string | null;
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
  coachId?: string | null;
  additionalCategoryIds?: (string | null)[] | null;
  /** Per-course additional categories (alternative to additionalCategoryIds + global list) */
  additionalCategories?: ExternalPerCourseCategory[] | null;
  durationMinutes?: number | null;
  studentsCount?: number | null;
  rating?: number | null;
  coverImageUrl?: string | null;
  thumbnailImageUrl?: string | null;
}

/** Sanitized per-course category for label resolution in API */
export interface PerCourseCategoryRecord {
  id: string;
  nameEn: string;
  nameAr: string;
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
  coachId?: string;
  categoryNameEn?: string;
  categoryNameAr?: string;
  additionalCategoryIds: string[];
  /** When backend sends per-course categories on list items; used for labels in API */
  additionalCategories?: PerCourseCategoryRecord[];
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

function sanitizeCategoryIds(value?: (string | null)[] | null): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function normalizePerCourseCategories(
  raw?: ExternalPerCourseCategory[] | null
): PerCourseCategoryRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (c) =>
        typeof c?.id === "string" &&
        (typeof c?.nameEn === "string" || typeof c?.nameAr === "string")
    )
    .map((c) => ({
      id: String(c.id).trim(),
      nameEn: typeof c.nameEn === "string" ? c.nameEn.trim() : "",
      nameAr: typeof c.nameAr === "string" ? c.nameAr.trim() : "",
    }))
    .filter((c) => c.id.length > 0);
}

/** Try multiple possible keys from backend for additional category ids */
function getAdditionalCategoryIds(
  item: ExternalCourseListItem
): string[] {
  const fromIds = sanitizeCategoryIds(item.additionalCategoryIds);
  if (fromIds.length > 0) return fromIds;
  if (Array.isArray(item.additionalCategories)) {
    const fromObjs = item.additionalCategories
      .filter((c) => c && typeof c.id === "string")
      .map((c) => String(c.id).trim())
      .filter(Boolean);
    if (fromObjs.length > 0) return fromObjs;
  }
  const raw = (item as unknown as Record<string, unknown>).categoryIds;
  const fromCategoryIds = Array.isArray(raw)
    ? (raw as (string | null)[])
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
        .map((v) => v.trim())
    : [];
  if (fromCategoryIds.length > 0) return fromCategoryIds;
  const categoriesRaw = (item as unknown as Record<string, unknown>).categories;
  if (Array.isArray(categoriesRaw)) {
    const fromCategories = categoriesRaw
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      .map((v) => v.trim());
    if (fromCategories.length > 0) return fromCategories;
  }
  return [];
}

function normalizeCourse(item: ExternalCourseListItem): CourseFeedRecord {
  const id = sanitizeString(item.id) ?? randomUUID();
  const perCourse = normalizePerCourseCategories(item.additionalCategories);
  const idsFromArray = getAdditionalCategoryIds(item);
  const idsFromPerCourse = perCourse.map((c) => c.id);
  const additionalCategoryIds =
    idsFromArray.length > 0 ? idsFromArray : idsFromPerCourse;
  // Backend will expose coach_id in snake_case; support both camelCase and snake_case
  const rawCoachId =
    item.coachId ??
    ((
      item as unknown as {
        coach_id?: string | null;
      }
    ).coach_id ?? null);

  return {
    id,
    slug: sanitizeSlug(item.slug ?? undefined, id),
    titleEn: sanitizeString(item.titleEn) ?? "Untitled course",
    titleAr: sanitizeString(item.titleAr),
    shortDescriptionEn: sanitizeString(item.shortDescriptionEn),
    shortDescriptionAr: sanitizeString(item.shortDescriptionAr),
    instructorNameEn: sanitizeString(item.instructorNameEn),
    instructorNameAr: sanitizeString(item.instructorNameAr),
    coachId: sanitizeString(rawCoachId ?? undefined),
    categoryNameEn: sanitizeString(item.categoryNameEn),
    categoryNameAr: sanitizeString(item.categoryNameAr),
    additionalCategoryIds,
    ...(perCourse.length > 0 ? { additionalCategories: perCourse } : {}),
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

function normalizeAdditionalCategories(
  raw?: { id: string; nameEn: string; nameAr: string }[] | null
): AdditionalCategoryRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (c) =>
        typeof c?.id === "string" &&
        typeof c?.nameEn === "string" &&
        typeof c?.nameAr === "string"
    )
    .map((c) => ({
      id: String(c.id).trim(),
      nameEn: String(c.nameEn).trim(),
      nameAr: String(c.nameAr).trim(),
    }));
}

function fallbackFromStatic(): {
  courses: CourseFeedRecord[];
  additionalCategories: AdditionalCategoryRecord[];
} {
  const courses: CourseFeedRecord[] = staticCourses.map((course) => {
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
      additionalCategoryIds: [],
      durationMinutes: duration,
      studentsCount: 0,
      rating: 4.5,
      coverImageUrl: course.image,
      thumbnailImageUrl: course.image,
    };
  });
  return { courses, additionalCategories: [] };
}

export interface CourseFeedResult {
  courses: CourseFeedRecord[];
  additionalCategories: AdditionalCategoryRecord[];
}

async function fetchCoursesFromApi(): Promise<CourseFeedResult> {
  try {
    const payload = await fetchFromBackend<ExternalCoursesApiResponse>(
      COURSES_ENDPOINT
    );
    if (!payload || !Array.isArray(payload.courses)) {
      throw new Error("[courses feed] Unexpected API response shape");
    }
    const courses = payload.courses.map(normalizeCourse);
    const additionalCategories = normalizeAdditionalCategories(
      payload.additionalCategories
    );
    return { courses, additionalCategories };
  } catch (error) {
    console.error("[courses feed] Failed to reach backend API", error);
    return fallbackFromStatic();
  }
}

export async function getCourseFeed(): Promise<CourseFeedResult> {
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


