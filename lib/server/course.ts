import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const COURSE_ENDPOINT = "/course";
const COURSE_CACHE_PREFIX = "course-detail:";
const COURSE_CACHE_TTL_MS = 30 * 1000;

export interface ExternalLesson {
  id: string;
  titleEn: string;
  titleAr?: string;
  durationMinutes?: number;
}

export interface ExternalCourseResponse {
  id: string;
  slug: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  shortDescriptionEn?: string;
  shortDescriptionAr?: string;
  coverImageUrl?: string;
  thumbnailImageUrl?: string;
  categoryNameEn?: string;
  categoryNameAr?: string;
  instructor?: string;
  durationMinutes?: number;
  trialVideoUrl?: string;
  lessons?: ExternalLesson[];
}

export interface CourseLessonRecord {
  id: string;
  titleEn: string;
  titleAr?: string;
  durationMinutes: number;
}

export interface CourseDetailRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  shortDescriptionEn?: string;
  shortDescriptionAr?: string;
  coverImageUrl?: string;
  thumbnailImageUrl?: string;
  categoryNameEn?: string;
  categoryNameAr?: string;
  instructor?: string;
  durationMinutes: number;
  trialVideoUrl?: string;
  lessons: CourseLessonRecord[];
}

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizePositiveInteger(value?: number | null): number {
  if (typeof value !== "number") {
    return 0;
  }
  const rounded = Math.round(value);
  return Number.isFinite(rounded) && rounded > 0 ? rounded : 0;
}

function normalizeLesson(lesson: ExternalLesson): CourseLessonRecord {
  return {
    id: lesson.id,
    titleEn: lesson.titleEn,
    titleAr: sanitizeString(lesson.titleAr),
    durationMinutes: sanitizePositiveInteger(lesson.durationMinutes),
  };
}

function normalizeCourseResponse(
  payload: ExternalCourseResponse
): CourseDetailRecord {
  return {
    id: payload.id,
    slug: payload.slug,
    titleEn: payload.titleEn,
    titleAr: sanitizeString(payload.titleAr),
    descriptionEn: payload.descriptionEn,
    descriptionAr: sanitizeString(payload.descriptionAr),
    shortDescriptionEn: sanitizeString(payload.shortDescriptionEn),
    shortDescriptionAr: sanitizeString(payload.shortDescriptionAr),
    coverImageUrl: sanitizeString(payload.coverImageUrl),
    thumbnailImageUrl: sanitizeString(payload.thumbnailImageUrl),
    categoryNameEn: sanitizeString(payload.categoryNameEn),
    categoryNameAr: sanitizeString(payload.categoryNameAr),
    instructor: sanitizeString(payload.instructor),
    durationMinutes: sanitizePositiveInteger(payload.durationMinutes),
    trialVideoUrl: sanitizeString(payload.trialVideoUrl),
    lessons: Array.isArray(payload.lessons)
      ? payload.lessons.map(normalizeLesson)
      : [],
  };
}

async function fetchCourseFromApi(
  slug: string
): Promise<CourseDetailRecord> {
  const safeSlug = encodeURIComponent(slug);
  const payload = await fetchFromBackend<ExternalCourseResponse>(
    `${COURSE_ENDPOINT}/${safeSlug}`
  );

  if (!payload || !payload.id) {
    throw new Error("[course] Unexpected API response shape");
  }

  return normalizeCourseResponse(payload);
}

export async function getCourseBySlug(
  slug: string
): Promise<CourseDetailRecord | undefined> {
  const trimmedSlug = slug?.trim();
  if (!trimmedSlug) {
    return undefined;
  }

  try {
    return await getOrSetCacheValue(
      `${COURSE_CACHE_PREFIX}${trimmedSlug}`,
      COURSE_CACHE_TTL_MS,
      () => fetchCourseFromApi(trimmedSlug)
    );
  } catch (error) {
    console.error(`[course] Failed to load course "${trimmedSlug}"`, error);
    return undefined;
  }
}


