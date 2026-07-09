import {
  INTERVAL_COPY,
  localizedField,
  savingsPercent,
  type BadgeTag,
  type PlanLocale,
} from "@/lib/plan-constants";
import type { CoursePackageSummary } from "@/lib/types/packages";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

type PackageLike = Pick<
  CoursePackageSummary,
  | "priceAmountCents"
  | "priceAmount"
  | "priceCurrency"
  | "billingInterval"
  | "intervalLabel"
  | "slug"
  | "nameEn"
  | "nameAr"
>;

export function isVipPackage(pkg: {
  slug?: string;
  badgeTag?: BadgeTag;
}): boolean {
  if (pkg.badgeTag === "vip") return true;
  return (pkg.slug ?? "").trim().toLowerCase() === "vip";
}

const CURRENCY_FORMAT_LOCALE = "en-US";

export function sanitizeCurrencyDisplay(formatted: string): string {
  return formatted
    .replace(/[\u200e\u200f\u061c\u00a0]/g, (char) => (char === "\u00a0" ? " " : ""))
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*US\$/gi, (_, amount) => `$${amount}`)
    .replace(/US\$\s*(\d)/gi, (_, digit) => `$${digit}`)
    .replace(/\$\s*US\s+/g, "$")
    .trim();
}

export function formatPackageAmount(
  amount: number,
  currency: string,
  locale: PlanLocale
): string {
  const normalizedCurrency = currency.toUpperCase();
  const maxFractionDigits = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency)
    ? 0
    : 2;
  try {
    const formatted = new Intl.NumberFormat(CURRENCY_FORMAT_LOCALE, {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    }).format(amount);

    return sanitizeCurrencyDisplay(formatted);
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}

export function getBillingIntervalLabel(
  interval: string,
  locale: PlanLocale
): string {
  if (interval === "month" || interval === "year") {
    return INTERVAL_COPY[locale][interval];
  }
  switch (interval) {
    case "day":
      return locale === "ar" ? "يومياً" : "per day";
    case "week":
      return locale === "ar" ? "أسبوعياً" : "per week";
    case "one_time":
      return locale === "ar" ? "دفعة واحدة" : "one-time";
    default:
      return locale === "ar" ? "لكل فترة" : "per period";
  }
}

export function getPackageDisplayName(
  pkg: PackageLike,
  locale: PlanLocale
): string {
  return localizedField(locale, pkg.nameEn, pkg.nameAr);
}

export function getPackagePillLabel(
  pkg: PackageLike,
  locale: PlanLocale
): string {
  return getPackageDisplayName(pkg, locale);
}

export function findCheapestPackage<T extends PackageLike>(
  packages: T[]
): T | undefined {
  if (packages.length === 0) return undefined;
  return [...packages].sort(
    (a, b) => a.priceAmountCents - b.priceAmountCents
  )[0];
}

export function buildPlansTitle(
  packages: PackageLike[],
  locale: PlanLocale
): string {
  const labels = packages.map((pkg) => getPackageDisplayName(pkg, locale));
  if (labels.length === 0) {
    return locale === "ar" ? "خطط الاشتراك" : "Subscription Plans";
  }
  if (labels.length === 1) {
    return locale === "ar"
      ? `خطة ${labels[0]}`
      : `${labels[0]} Plan`;
  }
  if (locale === "ar") {
    const last = labels[labels.length - 1];
    const rest = labels.slice(0, -1);
    return `خطط ${rest.join(" و ")} و ${last}`;
  }
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1);
  return `${rest.join(" and ")} and ${last} Plans`;
}

export function buildIncludedPlansText(
  packages: PackageLike[],
  locale: PlanLocale
): string {
  const labels = packages.map((pkg) => getPackageDisplayName(pkg, locale));
  if (labels.length === 0) {
    return locale === "ar"
      ? "هذه الدورة متاحة ضمن خطط الاشتراك"
      : "This course is included in subscription plans";
  }
  if (locale === "ar") {
    if (labels.length === 1) {
      return `هذه الدورة متاحة ضمن خطة ${labels[0]}`;
    }
    const last = labels[labels.length - 1];
    const rest = labels.slice(0, -1);
    return `هذه الدورة متاحة ضمن خطط ${rest.join(" و ")} و ${last}`;
  }
  if (labels.length === 1) {
    return `This course is included in the ${labels[0]} plan`;
  }
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1);
  return `This course is included in the ${rest.join(", ")} and ${last} plans`;
}

export function computeDiscountPercent(
  priceAmountCents: number,
  compareAtPriceAmountCents?: number | null
): number | undefined {
  const value = savingsPercent(priceAmountCents, compareAtPriceAmountCents);
  return value ?? undefined;
}

export function sortPackagesByPrice<T extends PackageLike>(
  packages: T[]
): T[] {
  return [...packages].sort((a, b) => a.priceAmountCents - b.priceAmountCents);
}

export function matchPackagesByIds<
  T extends { id: string; slug: string; priceAmountCents?: number },
>(
  coursePackages: CoursePackageSummary[],
  allPackages: T[]
): T[] {
  const ids = new Set(coursePackages.map((pkg) => pkg.id));
  const slugs = new Set(
    coursePackages.map((pkg) => pkg.slug.trim().toLowerCase())
  );

  return allPackages
    .filter(
      (pkg) => ids.has(pkg.id) || slugs.has(pkg.slug.trim().toLowerCase())
    )
    .sort((a, b) => {
      const aPrice = a.priceAmountCents ?? Number.MAX_SAFE_INTEGER;
      const bPrice = b.priceAmountCents ?? Number.MAX_SAFE_INTEGER;
      return aPrice - bPrice;
    });
}

export { localizedField, savingsPercent };
