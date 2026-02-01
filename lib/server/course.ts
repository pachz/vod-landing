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

export interface AdditionalCategoryDetail {
  id: string;
  nameEn: string;
  nameAr: string;
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
  additionalCategoryIds?: (string | null)[] | null;
  additionalCategories?: { id: string; nameEn: string; nameAr: string }[] | null;
  instructor?: string;
  durationMinutes?: number;
  trialVideoUrl?: string;
  lessons?: ExternalLesson[];
  updatedAt?: string;
  coach?: ExternalCoach;
  pricing?: ExternalCoursePricing;
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
  additionalCategoryIds: string[];
  additionalCategories: AdditionalCategoryDetail[];
  instructor?: string;
  durationMinutes: number;
  trialVideoUrl?: string;
  lessons: CourseLessonRecord[];
  updatedAt?: string;
  coach?: CourseCoachRecord;
  pricing?: CoursePricingRecord;
}

/** Backend coach shape: _id, _creationTime, nameEn, nameAr, expertiseEn, expertiseAr, descriptionEn, descriptionAr, rating, profileImageUrl, profileThumbnailUrl, courseCount, lastUpdatedAt */
export interface ExternalCoach {
  _id?: string;
  _creationTime?: number;
  nameEn?: string;
  nameAr?: string;
  expertiseEn?: string;
  expertiseAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  rating?: number;
  profileImageUrl?: string | null;
  profileThumbnailUrl?: string | null;
  courseCount?: number | null;
  lastUpdatedAt?: number | string;
}

export interface CourseCoachRecord {
  nameEn?: string;
  nameAr?: string;
  expertiseEn?: string;
  expertiseAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  profileImageUrl?: string;
  profileThumbnailUrl?: string;
  rating: number;
  courseCount?: number;
  lastUpdatedAt?: string;
}

export interface ExternalCoursePricing {
  priceAmount?: number;
  priceCurrency?: string;
  priceInterval?: string;
  productName?: string;
  selectedPriceId?: string;
  selectedProductId?: string;
}

export interface CoursePricingRecord {
  priceAmount?: number;
  priceCurrency?: string;
  priceInterval?: string;
  productName?: string;
  selectedPriceId?: string;
  selectedProductId?: string;
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

function sanitizeIsoDate(value?: string | number | null): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  let date: Date;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    date = new Date(value);
  } else if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    date = new Date(trimmed);
  } else {
    return undefined;
  }

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function sanitizeRating(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  const clamped = Math.min(Math.max(value, 0), 5);
  return Math.round(clamped * 10) / 10;
}

function sanitizePriceAmount(value?: number | null): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const rounded = Math.round(value);
  return rounded > 0 ? rounded : undefined;
}

function sanitizePriceInterval(value?: string | null): string | undefined {
  const normalized = sanitizeString(value)?.toLowerCase();
  if (!normalized) {
    return undefined;
  }

  switch (normalized) {
    case "day":
    case "daily":
      return "day";
    case "week":
    case "weekly":
      return "week";
    case "month":
    case "monthly":
      return "month";
    case "year":
    case "annual":
    case "annually":
      return "year";
    case "one_time":
    case "onetime":
    case "one-time":
      return "one_time";
    default:
      return undefined;
  }
}

function normalizeLesson(lesson: ExternalLesson): CourseLessonRecord {
  return {
    id: lesson.id,
    titleEn: lesson.titleEn,
    titleAr: sanitizeString(lesson.titleAr),
    durationMinutes: sanitizePositiveInteger(lesson.durationMinutes),
  };
}

function sanitizeCategoryIds(value?: (string | null)[] | null): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function normalizeAdditionalCategories(
  raw?: { id: string; nameEn: string; nameAr: string }[] | null
): AdditionalCategoryDetail[] {
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
    additionalCategoryIds: sanitizeCategoryIds(payload.additionalCategoryIds),
    additionalCategories: normalizeAdditionalCategories(
      payload.additionalCategories
    ),
    instructor: sanitizeString(payload.instructor),
    durationMinutes: sanitizePositiveInteger(payload.durationMinutes),
    trialVideoUrl: sanitizeString(payload.trialVideoUrl),
    lessons: Array.isArray(payload.lessons)
      ? payload.lessons.map(normalizeLesson)
      : [],
    updatedAt: sanitizeIsoDate(payload.updatedAt),
    coach: payload.coach ? normalizeCoach(payload.coach) : undefined,
    pricing: payload.pricing ? normalizePricing(payload.pricing) : undefined,
  };
}

function sanitizeOptionalNumber(value?: number | null): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  return n >= 0 ? n : undefined;
}

function normalizeCoach(coach: ExternalCoach): CourseCoachRecord {
  return {
    nameEn: sanitizeString(coach.nameEn ?? undefined),
    nameAr: sanitizeString(coach.nameAr ?? undefined),
    expertiseEn: sanitizeString(coach.expertiseEn ?? undefined),
    expertiseAr: sanitizeString(coach.expertiseAr ?? undefined),
    descriptionEn: sanitizeString(coach.descriptionEn ?? undefined),
    descriptionAr: sanitizeString(coach.descriptionAr ?? undefined),
    profileImageUrl: sanitizeString(coach.profileImageUrl ?? undefined),
    profileThumbnailUrl: sanitizeString(coach.profileThumbnailUrl ?? undefined),
    rating: sanitizeRating(coach.rating),
    courseCount: sanitizeOptionalNumber(coach.courseCount) ?? undefined,
    lastUpdatedAt: sanitizeIsoDate(coach.lastUpdatedAt ?? undefined),
  };
}

function normalizePricing(pricing: ExternalCoursePricing): CoursePricingRecord | undefined {
  const normalized: CoursePricingRecord = {
    priceAmount: sanitizePriceAmount(pricing.priceAmount),
    priceCurrency: sanitizeString(pricing.priceCurrency)?.toUpperCase(),
    priceInterval: sanitizePriceInterval(pricing.priceInterval),
    productName: sanitizeString(pricing.productName),
    selectedPriceId: sanitizeString(pricing.selectedPriceId),
    selectedProductId: sanitizeString(pricing.selectedProductId),
  };

  const hasValue = Object.values(normalized).some(
    (value) => value !== undefined && value !== ""
  );

  return hasValue ? normalized : undefined;
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


