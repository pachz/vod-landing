import { NextResponse } from "next/server";
import { formatPackageAmount } from "@/lib/packages/formatting";
import {
  SUBSCRIPTION_CACHE_TTL_MS,
  getSubscriptionPlan,
} from "@/lib/server/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

const INTERVAL_LABELS: Record<
  SupportedLocale,
  Record<string, { label: string; display: string }>
> = {
  en: {
    day: { label: "Daily", display: "daily" },
    week: { label: "Weekly", display: "weekly" },
    month: { label: "Monthly", display: "monthly" },
    year: { label: "Yearly", display: "yearly" },
    one_time: { label: "One-time", display: "one-time" },
  },
  ar: {
    day: { label: "يوميًا", display: "يوميًا" },
    week: { label: "أسبوعيًا", display: "أسبوعيًا" },
    month: { label: "شهريًا", display: "شهريًا" },
    year: { label: "سنويًا", display: "سنويًا" },
    one_time: { label: "دفعة واحدة", display: "مرة واحدة" },
  },
};

function getIntervalCopy(
  interval: string,
  locale: SupportedLocale
): { intervalLabel: string; displayLabel: string } {
  const fallback = INTERVAL_LABELS[locale].month;
  const match = INTERVAL_LABELS[locale][interval] ?? fallback;
  return { intervalLabel: match.label, displayLabel: match.display };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const plan = await getSubscriptionPlan();
    const { intervalLabel, displayLabel } = getIntervalCopy(
      plan.interval,
      locale
    );
    const localizedName =
      locale === "ar" && plan.nameAr ? plan.nameAr : plan.nameEn;
    const amountLabel = formatPackageAmount(plan.amount, plan.currency, locale);
    const priceDisplay =
      plan.interval === "one_time"
        ? `${amountLabel} / ${displayLabel}`
        : `${amountLabel} / ${displayLabel}`;

    return NextResponse.json({
      locale,
      plan: {
        productId: plan.productId,
        priceId: plan.priceId,
        name: localizedName,
        amountCents: plan.amountCents,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        intervalLabel,
        priceDisplay,
      },
      cachedAt: Date.now(),
      ttlMs: SUBSCRIPTION_CACHE_TTL_MS,
    });
  } catch (error) {
    console.error("[subscription API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load subscription details" },
      { status: 500 }
    );
  }
}


