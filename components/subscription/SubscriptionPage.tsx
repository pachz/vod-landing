"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SiteFooter } from "@/components/layout";
import type { PackageResponseItem } from "@/app/api/packages/route";
import {
  mapPackageToCard,
  sortPlansForGrid,
} from "@/lib/subscription/mapPackageToCard";
import type { SubscriptionPlanCardModel } from "@/lib/subscription/types";
import { getPanelPaymentsUrl } from "@/lib/panelUrl";
import { useTranslation } from "@/lib/useTranslation";
import { useDirection } from "@/providers/DirectionProvider";
import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionPage() {
  const { t, locale } = useTranslation();
  const { direction } = useDirection();
  const [plans, setPlans] = useState<SubscriptionPlanCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const subscribeUrl = useMemo(
    () => getPanelPaymentsUrl(locale === "ar" ? "ar" : "en"),
    [locale]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    const lockedLabels = {
      membershipFull: t("subscriptionPage.badges.membershipFull"),
      limitedMembers: t("subscriptionPage.badges.limitedMembers"),
    };

    fetch(`/api/packages?locale=${locale}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load packages");
        const data = (await response.json()) as { items?: PackageResponseItem[] };
        if (cancelled) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setPlans(
          sortPlansForGrid(items.map((item) => mapPackageToCard(item, lockedLabels)))
        );
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="min-h-screen bg-neutral-bg" dir={direction}>
      <main className="pt-16">
        <section className="relative overflow-hidden bg-pink-500 py-12 sm:py-16">
          <div
            className="absolute inset-0 opacity-40 sm:opacity-60 pointer-events-none"
            aria-hidden
          >
            <Image
              src="/images/RehamDivaSinglePinkPattern.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/80 mb-3"
            >
              {t("subscriptionPage.eyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t("subscriptionPage.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              {t("subscriptionPage.subtitle")}
            </motion.p>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-20 text-purple-600">
                {t("subscriptionPage.loadError")}
              </div>
            )}

            {!loading && !error && plans.length === 0 && (
              <div className="text-center py-20 text-purple-600">
                {t("subscriptionPage.empty")}
              </div>
            )}

            {!loading && !error && plans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {plans.map((plan, index) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    subscribeUrl={subscribeUrl}
                    recommendedRibbon={t("subscriptionPage.ribbon.recommended")}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
