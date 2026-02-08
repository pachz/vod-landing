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
}

/** New API shape: per-course categories array. main: true = primary, main: false = additional. */
interface ExternalCategory {
  id: string;
  nameEn?: string | null;
  nameAr?: string | null;
  main?: boolean;
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
  coachId?: string | null;
  /** New shape: categories array. main: true = primary, main: false = additional. Main first when present. */
  categories?: ExternalCategory[] | null;
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

/** Parse new categories array: [{ id, nameEn, nameAr, main }]. main: true = primary, main: false = additional. */
function parseCategoriesArray(
  raw?: ExternalCategory[] | null
): {
  categoryNameEn?: string;
  categoryNameAr?: string;
  additionalCategoryIds: string[];
  additionalCategories: PerCourseCategoryRecord[];
} {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { additionalCategoryIds: [], additionalCategories: [] };
  }
  let categoryNameEn: string | undefined;
  let categoryNameAr: string | undefined;
  const additionalCategoryIds: string[] = [];
  const additionalCategories: PerCourseCategoryRecord[] = [];

  for (const c of raw) {
    if (!c || typeof c.id !== "string" || !c.id.trim()) continue;
    const id = String(c.id).trim();
    const nameEn = typeof c.nameEn === "string" ? c.nameEn.trim() : "";
    const nameAr = typeof c.nameAr === "string" ? c.nameAr.trim() : "";
    const isMain = c.main === true;

    if (isMain) {
      categoryNameEn = nameEn || categoryNameEn;
      categoryNameAr = nameAr || categoryNameAr;
    } else {
      additionalCategoryIds.push(id);
      if (nameEn || nameAr) {
        additionalCategories.push({ id, nameEn, nameAr });
      }
    }
  }

  return {
    categoryNameEn,
    categoryNameAr,
    additionalCategoryIds,
    additionalCategories,
  };
}

function normalizeCourse(item: ExternalCourseListItem): CourseFeedRecord {
  const id = sanitizeString(item.id) ?? randomUUID();
  const parsed = parseCategoriesArray(item.categories);

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
    categoryNameEn: parsed.categoryNameEn,
    categoryNameAr: parsed.categoryNameAr,
    additionalCategoryIds: parsed.additionalCategoryIds,
    ...(parsed.additionalCategories.length > 0
      ? { additionalCategories: parsed.additionalCategories }
      : {}),
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

/** Derive a unique list of all categories from courses (for filter dropdown / label resolution) */
function deriveAdditionalCategoriesFromCourses(
  courses: CourseFeedRecord[]
): AdditionalCategoryRecord[] {
  const byId = new Map<string, AdditionalCategoryRecord>();
  for (const course of courses) {
    const perCourse = course.additionalCategories ?? [];
    for (const c of perCourse) {
      if (c.id && !byId.has(c.id)) {
        byId.set(c.id, { id: c.id, nameEn: c.nameEn, nameAr: c.nameAr });
      }
    }
  }
  return Array.from(byId.values());
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
    const additionalCategories = deriveAdditionalCategoriesFromCourses(courses);
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


