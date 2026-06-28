import type { PackageResponseItem } from "@/app/api/packages/route";
import type { BadgeTag } from "@/lib/plan-constants";
import type {
  PlanCardBadge,
  PlanCardVariant,
  SubscriptionBadgeVariant,
  SubscriptionPlanCardModel,
} from "./types";

/** Badge tags that render as corner ribbon only — never as header pills. */
const RIBBON_ONLY_BADGE_TAGS: BadgeTag[] = ["most_popular"];

function isRibbonOnlyBadge(tag: BadgeTag): boolean {
  return RIBBON_ONLY_BADGE_TAGS.includes(tag);
}

function getPlanVariant(pkg: PackageResponseItem): PlanCardVariant {
  if (pkg.isVip || pkg.badgeTag === "vip") return "vip";
  if (
    pkg.isHighlighted ||
    pkg.badgeTag === "best_value" ||
    pkg.badgeTag === "most_popular"
  ) {
    return "featured";
  }
  return "default";
}

function badgeTagToVariant(
  badgeTag: BadgeTag,
  variant: PlanCardVariant,
  locked: boolean
): SubscriptionBadgeVariant {
  if (locked && variant === "vip") return "locked";
  switch (badgeTag) {
    case "start_here":
      return "default";
    case "best_value":
    case "most_popular":
      return variant === "featured" ? "featured" : "default";
    case "limited":
      return variant === "vip" && !locked ? "gold" : "limited";
    case "vip":
      return "vip";
    default:
      return "default";
  }
}

function buildBadges(
  pkg: PackageResponseItem,
  variant: PlanCardVariant,
  locked: boolean,
  lockedLabels: { membershipFull: string; limitedMembers: string }
): PlanCardBadge[] {
  if (locked && variant === "vip") {
    return [
      { text: lockedLabels.membershipFull, variant: "locked" },
      { text: lockedLabels.limitedMembers, variant: "limited" },
    ];
  }

  const badges: PlanCardBadge[] = [];
  if (pkg.badge && !isRibbonOnlyBadge(pkg.badgeTag)) {
    badges.push({
      text: pkg.badge,
      variant: badgeTagToVariant(pkg.badgeTag, variant, locked),
    });
  }
  return badges;
}

export function mapPackageToCard(
  pkg: PackageResponseItem,
  lockedLabels: { membershipFull: string; limitedMembers: string }
): SubscriptionPlanCardModel {
  const variant = getPlanVariant(pkg);
  const isLocked = pkg.isAtCapacity && pkg.isVip;

  return {
    id: pkg.id,
    slug: pkg.slug,
    variant,
    name: pkg.name,
    formattedPrice: pkg.formattedPrice,
    formattedCompareAtPrice: pkg.formattedCompareAtPrice,
    discountPercent: pkg.discountPercent,
    intervalLabel: pkg.billingLabel || pkg.intervalLabel,
    priceSubtitle: pkg.priceSubtitle,
    badgeTag: pkg.badgeTag,
    badges: buildBadges(pkg, variant, isLocked, lockedLabels),
    ribbonText: pkg.ribbonText,
    inheritsDescriptionEn: pkg.inheritsDescriptionEn,
    inheritsDescriptionAr: pkg.inheritsDescriptionAr,
    features: pkg.features.map((feature) => ({
      icon: feature.icon,
      title: feature.title,
      subtitle: feature.subtitle,
    })),
    ctaLabel: pkg.ctaLabel,
    isVip: pkg.isVip,
    isLocked,
    theme: pkg.theme,
    displayOrder: 0,
  };
}

export function sortPlansForGrid(
  plans: SubscriptionPlanCardModel[]
): SubscriptionPlanCardModel[] {
  const orderWeight = (slug: string): number => {
    const normalized = slug.trim().toLowerCase();
    if (normalized === "monthly") return 1;
    if (normalized === "annual" || normalized === "yearly" || normalized === "year") {
      return 2;
    }
    if (normalized === "vip") return 3;
    return 10;
  };

  return [...plans].sort((a, b) => orderWeight(a.slug) - orderWeight(b.slug));
}

export function getPlanOrderClasses(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  if (normalized === "monthly") return "order-2 lg:order-1";
  if (normalized === "annual" || normalized === "yearly" || normalized === "year") {
    return "order-1 lg:order-2";
  }
  if (normalized === "vip") {
    return "order-3 lg:order-3 md:col-span-2 md:max-w-md md:justify-self-center lg:col-span-1";
  }
  return "";
}
