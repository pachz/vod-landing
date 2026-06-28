"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Crown, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CoursePackageSummary } from "@/lib/types/packages";
import {
  buildIncludedPlansText,
  buildPlansTitle,
  findCheapestPackage,
  formatPackageAmount,
  getBillingIntervalLabel,
  getPackagePillLabel,
  isVipPackage,
} from "@/lib/packages/formatting";
import type { PlanLocale } from "@/lib/plan-constants";
import SubscriptionPlansModal from "./SubscriptionPlansModal";

interface SubscriptionPackagesSectionProps {
  packages: CoursePackageSummary[];
  locale: PlanLocale;
  subscribeUrl: string;
}

function PackagePill({
  pkg,
  locale,
}: {
  pkg: CoursePackageSummary;
  locale: "en" | "ar";
}) {
  const label = getPackagePillLabel(pkg, locale);
  const vip = isVipPackage({ slug: pkg.slug });
  const primary = pkg.theme.primary;

  if (vip) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-sm">
        <Crown className="h-3.5 w-3.5 fill-amber-700 text-amber-900" />
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
      style={{ backgroundColor: primary }}
    >
      {label}
    </span>
  );
}

export default function SubscriptionPackagesSection({
  packages,
  locale,
  subscribeUrl,
}: SubscriptionPackagesSectionProps) {
  const isAr = locale === "ar";
  const [modalOpen, setModalOpen] = useState(false);

  const sortedPackages = useMemo(
    () =>
      [...packages].sort((a, b) => a.priceAmountCents - b.priceAmountCents),
    [packages]
  );

  const cheapest = useMemo(
    () => findCheapestPackage(sortedPackages),
    [sortedPackages]
  );

  const plansTitle = useMemo(
    () => buildPlansTitle(sortedPackages, locale),
    [sortedPackages, locale]
  );

  const includedText = useMemo(
    () => buildIncludedPlansText(sortedPackages, locale),
    [sortedPackages, locale]
  );

  if (!cheapest || sortedPackages.length === 0) {
    return null;
  }

  const startingPrice = formatPackageAmount(
    cheapest.priceAmount,
    cheapest.priceCurrency,
    locale
  );
  const intervalLabel = getBillingIntervalLabel(
    cheapest.billingInterval,
    locale
  );

  const openModal = () => setModalOpen(true);
  const pricingPageUrl = `/${locale}/subscription`;

  return (
    <>
      <div className="bg-white border border-purple-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              {sortedPackages.map((pkg) => (
                <PackagePill key={pkg.id} pkg={pkg} locale={locale} />
              ))}
            </div>
            <h3 className="mt-2 text-lg sm:text-xl font-semibold text-purple-900">
              {plansTitle}
            </h3>
            <p className="text-xs sm:text-sm text-purple-600 mt-1">
              {isAr
                ? "هذه الدورة متاحة ضمن هذه الخطط"
                : "This course is included in these plans"}
            </p>
          </div>
          <div className={`${isAr ? "text-left" : "text-right"} shrink-0`}>
            <p className="text-xs text-purple-500 mb-0.5">
              {isAr ? "تبدأ من" : "Starting from"}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-900 leading-none">
              {startingPrice}
            </p>
            <p className="text-xs sm:text-sm text-purple-600 mt-1">
              {intervalLabel}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => {
            window.location.href = subscribeUrl;
          }}
          className="w-full bg-[rgb(236,72,153)] hover:bg-[rgb(219,39,119)] text-white font-semibold py-2.5 text-base sm:text-lg rounded-xl"
        >
          {isAr ? "اشتركي الآن" : "Subscribe now"}
        </Button>

        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-1.5 font-medium text-purple-700 hover:text-purple-900 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-pink-500" />
            {isAr ? "تفاصيل الخطة" : "Plan details"}
          </button>
          <span className="h-4 w-px bg-purple-200" aria-hidden />
          <button
            type="button"
            onClick={() => {
              window.location.href = pricingPageUrl;
            }}
            className="inline-flex items-center gap-1.5 font-medium text-purple-700 hover:text-purple-900 transition-colors"
          >
            {isAr ? "قارني الخطط" : "Compare plans"}
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-purple-500">{includedText}</p>

        <div className="flex flex-col items-center mt-4 text-xs sm:text-sm text-purple-600">
          <span style={{ color: "#665BFF" }}>
            {isAr ? "دفع آمن" : "Secure payment"}
          </span>
          <Image
            src="/images/stripe.png"
            alt="Stripe"
            width={150}
            height={35}
            className="mb-0"
          />
        </div>
      </div>

      <SubscriptionPlansModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        coursePackages={sortedPackages}
        locale={locale}
      />
    </>
  );
}
