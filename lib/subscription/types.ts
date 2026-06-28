import type { BadgeTag, PlanTheme } from "@/lib/plan-constants";

export type SubscriptionBadgeVariant =
  | "default"
  | "featured"
  | "vip"
  | "locked"
  | "limited"
  | "gold";

export type PlanCardVariant = "default" | "featured" | "vip";

export interface PlanCardBadge {
  text: string;
  variant: SubscriptionBadgeVariant;
}

export interface PlanCardFeature {
  icon: string;
  title: string;
  subtitle?: string;
}

export interface SubscriptionPlanCardModel {
  id: string;
  slug: string;
  variant: PlanCardVariant;
  name: string;
  formattedPrice: string;
  formattedCompareAtPrice?: string;
  discountPercent?: number;
  intervalLabel: string;
  priceSubtitle?: string;
  badgeTag: BadgeTag;
  badges: PlanCardBadge[];
  ribbonText?: string;
  inheritsDescriptionEn?: string | null;
  inheritsDescriptionAr?: string | null;
  features: PlanCardFeature[];
  ctaLabel: string;
  isVip: boolean;
  isLocked: boolean;
  theme: PlanTheme;
  displayOrder: number;
}
