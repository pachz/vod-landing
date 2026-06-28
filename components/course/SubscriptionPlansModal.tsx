"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Crown, X } from "lucide-react";
import type { PackageResponseItem } from "@/app/api/packages/route";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { PLAN_UI_COPY, type PlanLocale } from "@/lib/plan-constants";
import {
  formatPackageAmount,
  getBillingIntervalLabel,
  getPackageDisplayName,
  isVipPackage,
  localizedField,
  matchPackagesByIds,
} from "@/lib/packages/formatting";
import { mapPackageToCard } from "@/lib/subscription/mapPackageToCard";
import type { CoursePackageSummary } from "@/lib/types/packages";
import { useTranslation } from "@/lib/useTranslation";
import { cn } from "@/lib/utils";

interface SubscriptionPlansModalProps {
  open: boolean;
  onClose: () => void;
  coursePackages: CoursePackageSummary[];
  locale: PlanLocale;
  initialTabId?: string;
}

function buildFallbackPackage(
  summary: CoursePackageSummary,
  locale: PlanLocale
): PackageResponseItem {
  return {
    id: summary.id,
    slug: summary.slug,
    name: getPackageDisplayName(summary, locale),
    titleIcon: null,
    theme: summary.theme,
    billingInterval: summary.billingInterval,
    priceAmountCents: summary.priceAmountCents,
    priceAmount: summary.priceAmount,
    priceCurrency: summary.priceCurrency,
    compareAtPriceAmountCents: summary.compareAtPriceAmountCents,
    intervalLabel: summary.intervalLabel,
    priceDisplay: summary.priceDisplay,
    priceSubtitle: localizedField(
      locale,
      summary.priceSubtitleEn,
      summary.priceSubtitleAr
    ),
    stripePriceId: summary.stripePriceId,
    badgeTag: isVipPackage(summary) ? "vip" : "none",
    badge: "",
    features: [],
    isVip: isVipPackage(summary),
    isHighlighted: false,
    isAtCapacity: false,
    formattedPrice: formatPackageAmount(
      summary.priceAmount,
      summary.priceCurrency,
      locale
    ),
    billingLabel: getBillingIntervalLabel(summary.billingInterval, locale),
    ctaLabel: isVipPackage(summary)
      ? PLAN_UI_COPY[locale].joinVip
      : PLAN_UI_COPY[locale].selectPlan,
    courseStats: { courses: 0, lessons: 0, hours: 0 },
  };
}

export default function SubscriptionPlansModal({
  open,
  onClose,
  coursePackages,
  locale,
  initialTabId,
}: SubscriptionPlansModalProps) {
  const { t } = useTranslation();
  const isAr = locale === "ar";
  const [packages, setPackages] = useState<PackageResponseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    initialTabId
  );

  const lockedLabels = {
    membershipFull: t("subscriptionPage.badges.membershipFull"),
    limitedMembers: t("subscriptionPage.badges.limitedMembers"),
  };

  const planCards = packages.map((pkg) => mapPackageToCard(pkg, lockedLabels));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/packages?locale=${locale}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load packages");
        }
        const data = (await response.json()) as { items?: PackageResponseItem[] };
        if (cancelled) return;

        const allItems = Array.isArray(data.items) ? data.items : [];
        const matched = matchPackagesByIds(coursePackages, allItems);
        const nextPackages =
          matched.length > 0
            ? matched
            : coursePackages.map((summary) =>
                buildFallbackPackage(summary, locale)
              );

        setPackages(nextPackages);
        setActiveTabId((current) => {
          if (initialTabId && nextPackages.some((pkg) => pkg.id === initialTabId)) {
            return initialTabId;
          }
          if (current && nextPackages.some((pkg) => pkg.id === current)) {
            return current;
          }
          return nextPackages[0]?.id;
        });
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = coursePackages.map((summary) =>
          buildFallbackPackage(summary, locale)
        );
        setPackages(fallback);
        setActiveTabId(fallback[0]?.id);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, coursePackages, locale, initialTabId]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const activePackage = useMemo(
    () => packages.find((pkg) => pkg.id === activeTabId) ?? packages[0],
    [packages, activeTabId]
  );

  const activePlan = useMemo(
    () => planCards.find((plan) => plan.id === activePackage?.id) ?? planCards[0],
    [planCards, activePackage?.id]
  );

  const membershipPageUrl = `/${locale}/subscription`;

  if (!open || !mounted) return null;

  const primary = activePackage?.theme.primary ?? "#E91E8C";

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label={isAr ? "إغلاق" : "Close"}
      />

      <div
        className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-plans-modal-title"
      >
        <div className="pointer-events-auto relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-neutral-bg shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
          <div className="flex shrink-0 items-center justify-between border-b border-purple-100 bg-white px-5 pb-2 pt-5">
            <h2
              id="subscription-plans-modal-title"
              className="text-lg font-semibold text-purple-900"
            >
              {isAr ? "تفاصيل الخطط" : "Plan details"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-purple-500 transition-colors hover:bg-purple-50 hover:text-purple-800"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {packages.length > 1 && (
            <div
              className="flex shrink-0 gap-1 overflow-x-auto border-b border-purple-100 bg-white px-5 pt-3"
              role="tablist"
            >
              {packages.map((pkg) => {
                const isActive = pkg.id === activePackage?.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTabId(pkg.id)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-purple-900"
                        : "text-purple-400 hover:text-purple-600"
                    )}
                  >
                    {pkg.isVip && (
                      <Crown className="h-4 w-4 fill-amber-400 text-amber-500" />
                    )}
                    {pkg.name}
                    {isActive && (
                      <span
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                        style={{ backgroundColor: primary }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {loading && !activePlan ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
              </div>
            ) : activePlan && activePackage ? (
              <SubscriptionCard
                key={activePlan.id}
                plan={activePlan}
                index={0}
                subscribeUrl={membershipPageUrl}
                recommendedRibbon={t("subscriptionPage.ribbon.recommended")}
                ctaLabel={
                  activePackage.isAtCapacity
                    ? PLAN_UI_COPY[locale].soldOut
                    : PLAN_UI_COPY[locale].viewMembershipPlans
                }
                ctaDisabled={activePackage.isAtCapacity}
                animated={false}
                embedded
              />
            ) : (
              <div className="py-16 text-center text-purple-500">
                {isAr ? "لا توجد خطط متاحة" : "No plans available"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export type { PackageResponseItem as FullPackage };
