// Shared with backend landing plan schema.

export const PLAN_ICON_KEYS = [
  "GraduationCap",
  "BookOpen",
  "Heart",
  "MessageCircle",
  "HelpCircle",
  "Crown",
  "Video",
  "Calendar",
  "Percent",
  "Star",
  "Sparkles",
  "Gift",
  "Ribbon",
  "Medal",
  "Users",
  "Shield",
  "Zap",
  "CheckCircle2",
] as const;

export type PlanIconKey = (typeof PLAN_ICON_KEYS)[number];

export const DEFAULT_PLAN_ICON: PlanIconKey = "CheckCircle2";

export function isPlanIconKey(value: string): value is PlanIconKey {
  return (PLAN_ICON_KEYS as readonly string[]).includes(value);
}

export const BADGE_TAG_VALUES = [
  "none",
  "start_here",
  "best_value",
  "most_popular",
  "limited",
  "vip",
] as const;

export type BadgeTag = (typeof BADGE_TAG_VALUES)[number];

export const BADGE_LABELS = {
  en: {
    none: "",
    start_here: "Start Here",
    best_value: "Best Value",
    most_popular: "Most Popular",
    limited: "Limited",
    vip: "VIP",
  },
  ar: {
    none: "",
    start_here: "ابدأ هنا",
    best_value: "أفضل قيمة",
    most_popular: "الأكثر شعبية",
    limited: "محدود",
    vip: "VIP",
  },
} as const satisfies Record<"en" | "ar", Record<BadgeTag, string>>;

export const HIGHLIGHTED_BADGE_TAGS: BadgeTag[] = [
  "most_popular",
  "best_value",
];

export function isHighlightedBadge(tag: BadgeTag): boolean {
  return HIGHLIGHTED_BADGE_TAGS.includes(tag);
}

export const BILLING_INTERVALS = ["month", "year"] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const INTERVAL_LABELS: Record<BillingInterval, string> = {
  month: "Monthly",
  year: "Yearly",
};

export const INTERVAL_COPY = {
  en: { month: "per month", year: "per year" },
  ar: { month: "شهريًا", year: "سنويًا" },
} as const;

export type PlanTheme = {
  primary: string;
  secondary: string;
  border: string;
  headerBg: string;
  buttonBg: string;
};

export const PLAN_UI_COPY = {
  en: {
    perMonth: "per month",
    perYear: "per year",
    savePercent: (pct: number) => `Save ${pct}%`,
    checklistItem: "Checklist item",
    selectPlan: "Select Plan",
    joinVip: "Join VIP",
    viewMembershipPlans: "View membership plans",
    securePayment: "Secure payment · Powered by Stripe",
    soldOut: "Sold out",
  },
  ar: {
    perMonth: "شهريًا",
    perYear: "سنويًا",
    savePercent: (pct: number) => `وفّر ${pct}%`,
    checklistItem: "عنصر قائمة",
    selectPlan: "اختر الخطة",
    joinVip: "انضم إلى VIP",
    viewMembershipPlans: "عرض خطط العضوية",
    securePayment: "دفع آمن · مدعوم من Stripe",
    soldOut: "نفدت الأماكن",
  },
} as const;

export type PlanLocale = keyof typeof PLAN_UI_COPY;

export function planCtaLabel(badgeTag: BadgeTag, locale: PlanLocale): string {
  return badgeTag === "vip"
    ? PLAN_UI_COPY[locale].joinVip
    : PLAN_UI_COPY[locale].selectPlan;
}

export function badgeLabel(tag: BadgeTag, locale: PlanLocale): string {
  return BADGE_LABELS[locale][tag];
}

export function savingsPercent(
  priceAmountCents: number,
  compareAtPriceAmountCents: number | null | undefined
): number | null {
  if (
    compareAtPriceAmountCents == null ||
    compareAtPriceAmountCents <= priceAmountCents
  ) {
    return null;
  }
  return Math.round(
    ((compareAtPriceAmountCents - priceAmountCents) /
      compareAtPriceAmountCents) *
      100
  );
}

export function localizedField(
  locale: PlanLocale,
  en: string | null | undefined,
  ar: string | null | undefined
): string {
  const enVal = en?.trim() ?? "";
  const arVal = ar?.trim() ?? "";
  return locale === "ar" ? arVal || enVal : enVal || arVal;
}

export type LandingPackageFeature = {
  icon: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  isChecklistItem: boolean;
  displayOrder: number;
};

export type LandingPackage = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  titleIcon: string | null;
  billingInterval: BillingInterval;
  stripeProductId: string;
  stripePriceId: string;
  priceAmountCents: number;
  priceAmount: number;
  priceCurrency: string;
  compareAtPriceAmountCents: number | null;
  priceSubtitleEn: string | null;
  priceSubtitleAr: string | null;
  intervalLabel: string;
  priceDisplay: string;
  theme: PlanTheme;
  badgeTag: BadgeTag;
  ribbonTextEn: string | null;
  ribbonTextAr: string | null;
  inheritsDescriptionEn: string | null;
  inheritsDescriptionAr: string | null;
  includesPlanSlug: string | null;
  includesPlanNameEn: string | null;
  includesPlanNameAr: string | null;
  courseStats: { courses: number; lessons: number; hours: number };
  features: LandingPackageFeature[];
  displayOrder: number;
  isAtCapacity: boolean;
};

export type LandingPackagesResponse = {
  packages: LandingPackage[];
};

export type LandingCoursePackagePill = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  color: string;
  theme: PlanTheme;
  billingInterval: BillingInterval;
  priceAmountCents: number;
  priceAmount: number;
  priceCurrency: string;
  compareAtPriceAmountCents: number | null;
  intervalLabel: string;
  priceDisplay: string;
  priceSubtitleEn: string | null;
  priceSubtitleAr: string | null;
  stripePriceId: string;
};

export function isBadgeTag(value: string): value is BadgeTag {
  return (BADGE_TAG_VALUES as readonly string[]).includes(value);
}

export function normalizeBadgeTag(value?: string | null): BadgeTag {
  const normalized = value?.trim().toLowerCase();
  if (normalized && isBadgeTag(normalized)) {
    return normalized;
  }
  return "none";
}

export function normalizeBillingInterval(value?: string | null): BillingInterval {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "year" || normalized === "annual" || normalized === "annually") {
    return "year";
  }
  return "month";
}
