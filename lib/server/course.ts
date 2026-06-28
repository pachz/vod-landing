import type { CoursePackageSummary } from "@/lib/types/packages";
import {
  normalizeBillingInterval,
  type BillingInterval,
  type PlanTheme,
} from "@/lib/plan-constants";
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

/** New API shape: per-course categories. main: true = primary, main: false = additional. */
interface ExternalCategory {
  id: string;
  nameEn?: string | null;
  nameAr?: string | null;
  main?: boolean;
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
  /** New shape: categories array. main: true = primary, main: false = additional. Main first when present. */
  categories?: ExternalCategory[] | null;
  instructor?: string;
  durationMinutes?: number;
  watchedHours?: number | null;
  trialVideoUrl?: string;
  lessons?: ExternalLesson[];
  updatedAt?: string;
  coach?: ExternalCoach;
  pricing?: ExternalCoursePricing;
  packages?: ExternalCoursePackage[] | null;
}

interface ExternalCoursePackage {
  id?: string | null;
  slug?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  color?: string | null;
  theme?: Partial<PlanTheme> | null;
  billingInterval?: string | null;
  priceAmountCents?: number | null;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  compareAtPriceAmountCents?: number | null;
  intervalLabel?: string | null;
  priceDisplay?: string | null;
  priceSubtitleEn?: string | null;
  priceSubtitleAr?: string | null;
  stripePriceId?: string | null;
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
  watchedHours: number;
  trialVideoUrl?: string;
  lessons: CourseLessonRecord[];
  updatedAt?: string;
  coach?: CourseCoachRecord;
  pricing?: CoursePricingRecord;
  packages: CoursePackageSummary[];
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

/** Parse new categories array for course detail. main: true = primary, main: false = additional. */
function parseCategoriesForDetail(
  raw?: ExternalCategory[] | null
): {
  categoryNameEn?: string;
  categoryNameAr?: string;
  additionalCategoryIds: string[];
  additionalCategories: AdditionalCategoryDetail[];
} {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { additionalCategoryIds: [], additionalCategories: [] };
  }
  let categoryNameEn: string | undefined;
  let categoryNameAr: string | undefined;
  const additionalCategoryIds: string[] = [];
  const additionalCategories: AdditionalCategoryDetail[] = [];

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
      additionalCategories.push({
        id,
        nameEn,
        nameAr,
      });
    }
  }

  return {
    categoryNameEn,
    categoryNameAr,
    additionalCategoryIds,
    additionalCategories,
  };
}

function normalizeCourseResponse(
  payload: ExternalCourseResponse
): CourseDetailRecord {
  const parsed = parseCategoriesForDetail(payload.categories);
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
    categoryNameEn: parsed.categoryNameEn,
    categoryNameAr: parsed.categoryNameAr,
    additionalCategoryIds: parsed.additionalCategoryIds,
    additionalCategories: parsed.additionalCategories,
    instructor: sanitizeString(payload.instructor),
    durationMinutes: sanitizePositiveInteger(payload.durationMinutes),
    watchedHours:
      sanitizeOptionalNumber(payload.watchedHours) ??
      sanitizeOptionalNumber(
        (payload as unknown as { watched_hours?: number | null }).watched_hours
      ) ??
      0,
    trialVideoUrl: sanitizeString(payload.trialVideoUrl),
    lessons: Array.isArray(payload.lessons)
      ? payload.lessons.map(normalizeLesson)
      : [],
    updatedAt: sanitizeIsoDate(payload.updatedAt),
    coach: payload.coach ? normalizeCoach(payload.coach) : undefined,
    pricing: payload.pricing ? normalizePricing(payload.pricing) : undefined,
    packages: normalizeCoursePackages(payload.packages),
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

function normalizeCoursePackage(
  raw: ExternalCoursePackage
): CoursePackageSummary | undefined {
  const id = sanitizeString(raw.id);
  const slug = sanitizeString(raw.slug);
  const nameEn = sanitizeString(raw.nameEn);
  const priceAmountCents = sanitizePositiveInteger(raw.priceAmountCents);
  const priceCurrency = sanitizeString(raw.priceCurrency)?.toUpperCase();
  const stripePriceId = sanitizeString(raw.stripePriceId);

  if (!id || !slug || !nameEn || !priceAmountCents || !priceCurrency || !stripePriceId) {
    return undefined;
  }

  const priceAmount =
    typeof raw.priceAmount === "number" && Number.isFinite(raw.priceAmount)
      ? raw.priceAmount
      : priceAmountCents / 100;

  const billingInterval: BillingInterval = normalizeBillingInterval(
    raw.billingInterval
  );
  const primary =
    sanitizeString(raw.theme?.primary) ?? sanitizeString(raw.color) ?? "#E91E8C";

  return {
    id,
    slug,
    nameEn,
    nameAr: sanitizeString(raw.nameAr) ?? nameEn,
    color: primary,
    theme: {
      primary,
      secondary: sanitizeString(raw.theme?.secondary) ?? "#9C27B0",
      border: sanitizeString(raw.theme?.border) ?? "#E0E0E0",
      headerBg: sanitizeString(raw.theme?.headerBg) ?? "#FFFFFF",
      buttonBg: sanitizeString(raw.theme?.buttonBg) ?? primary,
    },
    billingInterval,
    priceAmountCents,
    priceAmount,
    priceCurrency,
    compareAtPriceAmountCents:
      sanitizePositiveInteger(raw.compareAtPriceAmountCents) ?? null,
    intervalLabel:
      sanitizeString(raw.intervalLabel) ??
      (billingInterval === "year" ? "Yearly" : "Monthly"),
    priceDisplay:
      sanitizeString(raw.priceDisplay) ??
      `${priceCurrency} ${priceAmount} / ${billingInterval}`,
    priceSubtitleEn: sanitizeString(raw.priceSubtitleEn) ?? null,
    priceSubtitleAr: sanitizeString(raw.priceSubtitleAr) ?? null,
    stripePriceId,
  };
}

function normalizeCoursePackages(
  raw?: ExternalCoursePackage[] | null
): CoursePackageSummary[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeCoursePackage)
    .filter((pkg): pkg is CoursePackageSummary => pkg !== undefined);
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


