export type {
  BadgeTag,
  BillingInterval,
  LandingCoursePackagePill,
  LandingPackage,
  LandingPackageFeature,
  PlanLocale,
  PlanTheme,
} from "@/lib/plan-constants";

/** Course detail embed — alias for backend pill shape. */
export type { LandingCoursePackagePill as CoursePackageSummary } from "@/lib/plan-constants";

/** Full package from GET /landing/packages. */
export type { LandingPackage as SubscriptionPackageRecord } from "@/lib/plan-constants";
