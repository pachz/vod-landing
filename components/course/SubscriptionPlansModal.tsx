"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Crown, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PackageResponseItem } from "@/app/api/packages/route";
import {
  isHighlightedBadge,
  PLAN_UI_COPY,
  type PlanLocale,
} from "@/lib/plan-constants";
import {
  formatPackageAmount,
  getBillingIntervalLabel,
  getPackagePillLabel,
  isVipPackage,
  localizedField,
  matchPackagesByIds,
} from "@/lib/packages/formatting";
import { PlanIcon } from "@/lib/plan-icons";
import type { CoursePackageSummary } from "@/lib/types/packages";

interface SubscriptionPlansModalProps {
  open: boolean;
  onClose: () => void;
  coursePackages: CoursePackageSummary[];
  locale: PlanLocale;
  subscribeUrl: string;
  initialTabId?: string;
}

function buildFallbackPackage(
  summary: CoursePackageSummary,
  locale: PlanLocale
): PackageResponseItem {
  const primary = summary.theme.primary;
  return {
    id: summary.id,
    slug: summary.slug,
    name: getPackagePillLabel(summary, locale),
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
  subscribeUrl,
  initialTabId,
}: SubscriptionPlansModalProps) {
  const isAr = locale === "ar";
  const [packages, setPackages] = useState<PackageResponseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    initialTabId
  );

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

  if (!open || !mounted) return null;

  const primary = activePackage?.theme.primary ?? "#E91E8C";
  const secondary = activePackage?.theme.secondary ?? "#9C27B0";
  const useGradientHeader =
    activePackage != null &&
    (isHighlightedBadge(activePackage.badgeTag) || activePackage.isVip);

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
        <div className="pointer-events-auto relative z-10 w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-purple-100">
            <h2
              id="subscription-plans-modal-title"
              className="text-lg font-semibold text-purple-900"
            >
              {isAr ? "تفاصيل الخطط" : "Plan details"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-purple-500 hover:bg-purple-50 hover:text-purple-800 transition-colors"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {packages.length > 1 && (
            <div
              className="flex gap-1 px-5 pt-3 border-b border-purple-100"
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
                    className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-purple-900"
                        : "text-purple-400 hover:text-purple-600"
                    }`}
                  >
                    {pkg.isVip && (
                      <Crown className="h-4 w-4 text-amber-500 fill-amber-400" />
                    )}
                    {pkg.intervalLabel || pkg.name}
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

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loading && !activePackage ? (
              <div className="py-16 text-center text-purple-500">
                {isAr ? "جاري التحميل..." : "Loading plans..."}
              </div>
            ) : activePackage ? (
              <div className="space-y-4">
                <div
                  className={`relative overflow-hidden rounded-2xl px-5 py-6 ${
                    useGradientHeader ? "text-white" : "text-purple-900 border border-purple-100"
                  }`}
                  style={
                    useGradientHeader
                      ? {
                          background: `linear-gradient(135deg, ${secondary} 0%, ${primary} 100%)`,
                        }
                      : { backgroundColor: activePackage.theme.headerBg }
                  }
                >
                  {(activePackage.badge || activePackage.ribbonText) && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-3 ${
                        useGradientHeader ? "bg-white/20" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {activePackage.ribbonText || activePackage.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    {activePackage.titleIcon && (
                      <PlanIcon
                        icon={activePackage.titleIcon}
                        className={`h-7 w-7 shrink-0 ${
                          useGradientHeader ? "text-white" : "text-purple-600"
                        }`}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-bold">{activePackage.name}</h3>
                      <div className="mt-3 flex flex-wrap items-end gap-2">
                        <span className="text-4xl font-bold leading-none">
                          {activePackage.formattedPrice}
                        </span>
                        {activePackage.formattedCompareAtPrice && (
                          <span
                            className={`text-lg line-through pb-0.5 ${
                              useGradientHeader ? "text-white/70" : "text-purple-400"
                            }`}
                          >
                            {activePackage.formattedCompareAtPrice}
                          </span>
                        )}
                        {activePackage.discountPercent != null && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              useGradientHeader
                                ? "bg-white/20"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {PLAN_UI_COPY[locale].savePercent(
                              activePackage.discountPercent
                            )}
                          </span>
                        )}
                      </div>
                      {activePackage.priceSubtitle ? (
                        <p
                          className={`mt-2 text-sm ${
                            useGradientHeader ? "text-white/85" : "text-purple-600"
                          }`}
                        >
                          {activePackage.priceSubtitle}
                        </p>
                      ) : (
                        <p
                          className={`mt-2 text-sm ${
                            useGradientHeader ? "text-white/85" : "text-purple-600"
                          }`}
                        >
                          {activePackage.billingLabel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {activePackage.inheritsDescription && (
                  <div className="flex items-start gap-3 rounded-xl bg-purple-50 px-4 py-3 text-purple-900">
                    <List className="h-5 w-5 shrink-0 text-purple-600 mt-0.5" />
                    <p className="text-sm font-medium">
                      {activePackage.inheritsDescription}
                    </p>
                  </div>
                )}

                {activePackage.features.length > 0 && (
                  <ul className="divide-y divide-purple-100 rounded-xl border border-purple-100 overflow-hidden">
                    {activePackage.features.map((feature, index) => (
                      <li
                        key={`${activePackage.id}-feature-${index}`}
                        className="flex items-start gap-3 px-4 py-4 bg-white"
                      >
                        <PlanIcon
                          icon={feature.icon}
                          className="h-5 w-5 shrink-0 text-purple-600 mt-0.5"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-purple-900">
                            {feature.title}
                          </p>
                          {feature.subtitle && (
                            <p className="mt-0.5 text-sm text-purple-600">
                              {feature.subtitle}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-purple-500">
                {isAr ? "لا توجد خطط متاحة" : "No plans available"}
              </div>
            )}
          </div>

          <div className="border-t border-purple-100 px-5 py-4 bg-white">
            <Button
              size="lg"
              disabled={activePackage?.isAtCapacity}
              className="w-full rounded-xl text-base font-semibold text-white disabled:opacity-60"
              style={{
                backgroundColor: activePackage?.theme.buttonBg ?? primary,
              }}
              onClick={() => {
                if (!activePackage?.isAtCapacity) {
                  window.location.href = subscribeUrl;
                }
              }}
            >
              {activePackage?.isAtCapacity
                ? PLAN_UI_COPY[locale].soldOut
                : PLAN_UI_COPY[locale].viewMembershipPlans}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export type { PackageResponseItem as FullPackage };
