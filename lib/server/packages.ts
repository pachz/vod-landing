import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";
import {
  normalizeBadgeTag,
  normalizeBillingInterval,
  type BadgeTag,
  type BillingInterval,
  type LandingPackage,
  type LandingPackageFeature,
  type LandingPackagesResponse,
  type PlanTheme,
} from "@/lib/plan-constants";
import type { SubscriptionPackageRecord } from "@/lib/types/packages";

const PACKAGES_ENDPOINT = "/packages";
const PACKAGES_CACHE_KEY = "landing-packages";
const PACKAGES_CACHE_TTL_MS = 60 * 1000;

type ExternalPackageFeature = {
  icon?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  subtitleEn?: string | null;
  subtitleAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  valueEn?: string | null;
  valueAr?: string | null;
  isChecklistItem?: boolean | null;
  displayOrder?: number | null;
};

type ExternalPackage = {
  id?: string | null;
  slug?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  titleIcon?: string | null;
  color?: string | null;
  theme?: Partial<PlanTheme> | null;
  billingInterval?: string | null;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  priceAmountCents?: number | null;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  compareAtPriceAmountCents?: number | null;
  intervalLabel?: string | null;
  priceDisplay?: string | null;
  priceSubtitleEn?: string | null;
  priceSubtitleAr?: string | null;
  badgeTag?: string | null;
  badgeEn?: string | null;
  badgeAr?: string | null;
  ribbonTextEn?: string | null;
  ribbonTextAr?: string | null;
  inheritsDescriptionEn?: string | null;
  inheritsDescriptionAr?: string | null;
  highlightEn?: string | null;
  highlightAr?: string | null;
  includesPlanSlug?: string | null;
  includesPlanNameEn?: string | null;
  includesPlanNameAr?: string | null;
  courseStats?: {
    courses?: number | null;
    lessons?: number | null;
    hours?: number | null;
  } | null;
  features?: ExternalPackageFeature[] | null;
  displayOrder?: number | null;
  sortOrder?: number | null;
  isAtCapacity?: boolean | null;
  isVip?: boolean | null;
};

type PackagesApiResponse = ExternalPackage[] | LandingPackagesResponse;

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizePositiveInteger(value?: number | null): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const rounded = Math.round(value);
  return rounded > 0 ? rounded : undefined;
}

function sanitizeNonNegativeInteger(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function normalizeTheme(
  theme: Partial<PlanTheme> | null | undefined,
  color?: string | null
): PlanTheme {
  const primary =
    sanitizeString(theme?.primary) ?? sanitizeString(color) ?? "#E91E8C";
  return {
    primary,
    secondary: sanitizeString(theme?.secondary) ?? "#9C27B0",
    border: sanitizeString(theme?.border) ?? "#E0E0E0",
    headerBg: sanitizeString(theme?.headerBg) ?? "#FFFFFF",
    buttonBg: sanitizeString(theme?.buttonBg) ?? primary,
  };
}

function normalizeFeature(
  feature: ExternalPackageFeature,
  index: number
): LandingPackageFeature | undefined {
  const titleEn =
    sanitizeString(feature.titleEn) ??
    sanitizeString(feature.descriptionEn) ??
    "";
  const titleAr =
    sanitizeString(feature.titleAr) ??
    sanitizeString(feature.descriptionAr) ??
    "";
  const subtitleEn =
    sanitizeString(feature.subtitleEn) ??
    sanitizeString(feature.valueEn) ??
    null;
  const subtitleAr =
    sanitizeString(feature.subtitleAr) ??
    sanitizeString(feature.valueAr) ??
    null;

  if (!titleEn && !titleAr) {
    return undefined;
  }

  return {
    icon: sanitizeString(feature.icon) ?? "CheckCircle2",
    titleEn: titleEn || titleAr,
    titleAr: titleAr || titleEn,
    subtitleEn,
    subtitleAr,
    isChecklistItem: feature.isChecklistItem === true,
    displayOrder:
      typeof feature.displayOrder === "number" && Number.isFinite(feature.displayOrder)
        ? feature.displayOrder
        : index,
  };
}

function normalizePackage(raw: ExternalPackage): SubscriptionPackageRecord | undefined {
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

  let badgeTag: BadgeTag = normalizeBadgeTag(raw.badgeTag);
  if (badgeTag === "none" && raw.isVip === true) {
    badgeTag = "vip";
  }
  if (badgeTag === "none" && slug.toLowerCase() === "vip") {
    badgeTag = "vip";
  }

  const features = Array.isArray(raw.features)
    ? raw.features
        .map(normalizeFeature)
        .filter((feature): feature is LandingPackageFeature => feature !== undefined)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const compareAtPriceAmountCents =
    sanitizePositiveInteger(raw.compareAtPriceAmountCents) ?? null;

  const displayOrder =
    typeof raw.displayOrder === "number" && Number.isFinite(raw.displayOrder)
      ? raw.displayOrder
      : typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder)
        ? raw.sortOrder
        : 0;

  return {
    id,
    slug,
    nameEn,
    nameAr: sanitizeString(raw.nameAr) ?? nameEn,
    titleIcon: sanitizeString(raw.titleIcon) ?? null,
    billingInterval,
    stripeProductId: sanitizeString(raw.stripeProductId) ?? id,
    stripePriceId,
    priceAmountCents,
    priceAmount,
    priceCurrency,
    compareAtPriceAmountCents,
    priceSubtitleEn: sanitizeString(raw.priceSubtitleEn) ?? null,
    priceSubtitleAr: sanitizeString(raw.priceSubtitleAr) ?? null,
    intervalLabel:
      sanitizeString(raw.intervalLabel) ??
      (billingInterval === "year" ? "Yearly" : "Monthly"),
    priceDisplay:
      sanitizeString(raw.priceDisplay) ??
      `${priceCurrency} ${priceAmount} / ${billingInterval}`,
    theme: normalizeTheme(raw.theme, raw.color),
    badgeTag,
    ribbonTextEn:
      sanitizeString(raw.ribbonTextEn) ??
      sanitizeString(raw.badgeEn) ??
      null,
    ribbonTextAr:
      sanitizeString(raw.ribbonTextAr) ??
      sanitizeString(raw.badgeAr) ??
      null,
    inheritsDescriptionEn:
      sanitizeString(raw.inheritsDescriptionEn) ??
      sanitizeString(raw.highlightEn) ??
      null,
    inheritsDescriptionAr:
      sanitizeString(raw.inheritsDescriptionAr) ??
      sanitizeString(raw.highlightAr) ??
      null,
    includesPlanSlug: sanitizeString(raw.includesPlanSlug) ?? null,
    includesPlanNameEn: sanitizeString(raw.includesPlanNameEn) ?? null,
    includesPlanNameAr: sanitizeString(raw.includesPlanNameAr) ?? null,
    courseStats: {
      courses: sanitizeNonNegativeInteger(raw.courseStats?.courses),
      lessons: sanitizeNonNegativeInteger(raw.courseStats?.lessons),
      hours: sanitizeNonNegativeInteger(raw.courseStats?.hours),
    },
    features,
    displayOrder,
    isAtCapacity: raw.isAtCapacity === true,
  };
}

function normalizePackages(
  raw: ExternalPackage[] | null | undefined
): SubscriptionPackageRecord[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map(normalizePackage)
    .filter((pkg): pkg is SubscriptionPackageRecord => pkg !== undefined)
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.priceAmountCents - b.priceAmountCents;
    });
}

async function fetchPackagesFromApi(): Promise<SubscriptionPackageRecord[]> {
  const payload = await fetchFromBackend<PackagesApiResponse>(PACKAGES_ENDPOINT);
  const list: ExternalPackage[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.packages)
      ? payload.packages
      : [];

  return normalizePackages(list);
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackageRecord[]> {
  try {
    return await getOrSetCacheValue(
      PACKAGES_CACHE_KEY,
      PACKAGES_CACHE_TTL_MS,
      fetchPackagesFromApi
    );
  } catch (error) {
    console.error("[packages] Unable to load package data", error);
    throw error;
  }
}
