import {
  normalizeBillingInterval,
  type BillingInterval,
  type PlanTheme,
} from "@/lib/plan-constants";
import type { CoursePackageSummary } from "@/lib/types/packages";

export interface ExternalCoursePackageInput {
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

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizePositiveInteger(value?: number | null): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const rounded = Math.round(value);
  return rounded > 0 ? rounded : undefined;
}

export function normalizeCoursePackagePill(
  raw: ExternalCoursePackageInput | null | undefined
): CoursePackageSummary | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

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
