import { NextResponse } from "next/server";
import {
  badgeLabel,
  localizedField,
  planCtaLabel,
  savingsPercent,
  type BadgeTag,
  type PlanLocale,
} from "@/lib/plan-constants";
import {
  formatPackageAmount,
  getBillingIntervalLabel,
  getPackageDisplayName,
  isVipPackage,
  sanitizeCurrencyDisplay,
} from "@/lib/packages/formatting";
import { getSubscriptionPackages } from "@/lib/server/packages";
import type { SubscriptionPackageRecord } from "@/lib/types/packages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = PlanLocale;

interface PackageFeatureResponse {
  icon: string;
  title: string;
  subtitle?: string;
  isChecklistItem: boolean;
}

export interface PackageResponseItem {
  id: string;
  slug: string;
  name: string;
  titleIcon?: string | null;
  theme: SubscriptionPackageRecord["theme"];
  billingInterval: string;
  priceAmountCents: number;
  priceAmount: number;
  priceCurrency: string;
  compareAtPriceAmountCents: number | null;
  intervalLabel: string;
  priceDisplay: string;
  priceSubtitle?: string;
  stripePriceId: string;
  badgeTag: BadgeTag;
  badge: string;
  ribbonText?: string;
  inheritsDescription?: string;
  inheritsDescriptionEn?: string | null;
  inheritsDescriptionAr?: string | null;
  includesPlanName?: string;
  courseStats: SubscriptionPackageRecord["courseStats"];
  features: PackageFeatureResponse[];
  isVip: boolean;
  isHighlighted: boolean;
  isAtCapacity: boolean;
  discountPercent?: number;
  formattedPrice: string;
  formattedCompareAtPrice?: string;
  billingLabel: string;
  ctaLabel: string;
}

function mapPackageToLocale(
  pkg: SubscriptionPackageRecord,
  locale: SupportedLocale
): PackageResponseItem {
  const discount = savingsPercent(
    pkg.priceAmountCents,
    pkg.compareAtPriceAmountCents
  );

  return {
    id: pkg.id,
    slug: pkg.slug,
    name: getPackageDisplayName(pkg, locale),
    titleIcon: pkg.titleIcon,
    theme: pkg.theme,
    billingInterval: pkg.billingInterval,
    priceAmountCents: pkg.priceAmountCents,
    priceAmount: pkg.priceAmount,
    priceCurrency: pkg.priceCurrency,
    compareAtPriceAmountCents: pkg.compareAtPriceAmountCents,
    intervalLabel: pkg.intervalLabel,
    priceDisplay: pkg.priceDisplay,
    priceSubtitle: localizedField(
      locale,
      pkg.priceSubtitleEn,
      pkg.priceSubtitleAr
    ),
    stripePriceId: pkg.stripePriceId,
    badgeTag: pkg.badgeTag,
    badge: badgeLabel(pkg.badgeTag, locale),
    ribbonText: localizedField(locale, pkg.ribbonTextEn, pkg.ribbonTextAr),
    inheritsDescription: localizedField(
      locale,
      pkg.inheritsDescriptionEn,
      pkg.inheritsDescriptionAr
    ),
    inheritsDescriptionEn: pkg.inheritsDescriptionEn,
    inheritsDescriptionAr: pkg.inheritsDescriptionAr,
    includesPlanName: localizedField(
      locale,
      pkg.includesPlanNameEn,
      pkg.includesPlanNameAr
    ),
    courseStats: pkg.courseStats,
    features: pkg.features.map((feature) => ({
      icon: feature.icon,
      title: localizedField(locale, feature.titleEn, feature.titleAr),
      subtitle: localizedField(locale, feature.subtitleEn, feature.subtitleAr),
      isChecklistItem: feature.isChecklistItem,
    })),
    isVip: isVipPackage(pkg),
    isHighlighted:
      pkg.badgeTag === "best_value" || pkg.badgeTag === "most_popular",
    isAtCapacity: pkg.isAtCapacity,
    discountPercent: discount ?? undefined,
    formattedPrice: sanitizeCurrencyDisplay(
      formatPackageAmount(pkg.priceAmount, pkg.priceCurrency, locale)
    ),
    formattedCompareAtPrice:
      pkg.compareAtPriceAmountCents != null
        ? sanitizeCurrencyDisplay(
            formatPackageAmount(
              pkg.compareAtPriceAmountCents / 100,
              pkg.priceCurrency,
              locale
            )
          )
        : undefined,
    billingLabel: getBillingIntervalLabel(pkg.billingInterval, locale),
    ctaLabel: planCtaLabel(pkg.badgeTag, locale),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const packages = await getSubscriptionPackages();
    const items = packages.map((pkg) => mapPackageToLocale(pkg, locale));

    return NextResponse.json({
      locale,
      items,
      cachedAt: Date.now(),
      ttlMs: 60 * 1000,
    });
  } catch (error) {
    console.error("[packages API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load subscription packages" },
      { status: 500 }
    );
  }
}
