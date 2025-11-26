import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const SUBSCRIPTION_ENDPOINT = "/subscription";
const SUBSCRIPTION_CACHE_KEY = "subscription-plan";
export const SUBSCRIPTION_CACHE_TTL_MS = 10 * 1000;

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

type SubscriptionInterval = "day" | "week" | "month" | "year" | "one_time";

interface ExternalSubscriptionPlan {
  productId?: string | null;
  priceId?: string | null;
  name?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  amountCents?: number | null;
  amount?: number | null;
  currency?: string | null;
  interval?: string | null;
}

interface ExternalSubscriptionResponse {
  subscription?: ExternalSubscriptionPlan;
  [key: string]: unknown;
}

export interface SubscriptionRecord {
  productId: string;
  priceId?: string;
  nameEn: string;
  nameAr?: string;
  amountCents: number;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
}

const FALLBACK_SUBSCRIPTION: SubscriptionRecord = {
  productId: "prod_TQx9TrKRUQUdz5",
  priceId: "price_1SU5FaDWdoFAA1MHEHAmr1Ys",
  nameEn: "Test Subscription",
  nameAr: "اشتراك تجريبي",
  amountCents: 1500,
  amount: 15,
  currency: "USD",
  interval: "month",
};

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeAmountCents(value?: number | null): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const rounded = Math.round(value);
  return rounded > 0 ? rounded : undefined;
}

function sanitizeCurrency(value?: string | null): string | undefined {
  const sanitized = sanitizeString(value);
  return sanitized ? sanitized.toUpperCase() : undefined;
}

function normalizeInterval(value?: string | null): SubscriptionInterval | undefined {
  const normalized = sanitizeString(value)?.toLowerCase();
  switch (normalized) {
    case "day":
    case "daily":
      return "day";
    case "week":
    case "weekly":
      return "week";
    case "month":
    case "monthly":
      return "month";
    case "year":
    case "annual":
    case "annually":
      return "year";
    case "one_time":
    case "one-time":
    case "onetime":
      return "one_time";
    default:
      return undefined;
  }
}

function deriveAmount(amountCents: number, currency: string): number {
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return 0;
  }
  const divisor = ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100;
  return amountCents / divisor;
}

function normalizeSubscriptionPlan(
  raw: ExternalSubscriptionPlan
): SubscriptionRecord {
  const fallback = FALLBACK_SUBSCRIPTION;
  const currency = sanitizeCurrency(raw.currency) ?? fallback.currency;
  const interval = normalizeInterval(raw.interval) ?? fallback.interval;
  const amountCents =
    sanitizeAmountCents(
      raw.amountCents ??
        (typeof raw.amount === "number"
          ? raw.amount *
            (ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100)
          : undefined)
    ) ?? fallback.amountCents;

  return {
    productId: sanitizeString(raw.productId) ?? fallback.productId,
    priceId: sanitizeString(raw.priceId) ?? fallback.priceId,
    nameEn:
      sanitizeString(raw.nameEn) ??
      sanitizeString(raw.name) ??
      fallback.nameEn,
    nameAr: sanitizeString(raw.nameAr) ?? fallback.nameAr,
    amountCents,
    amount: deriveAmount(amountCents, currency),
    currency,
    interval,
  };
}

async function fetchSubscriptionFromApi(): Promise<SubscriptionRecord> {
  try {
    const payload = await fetchFromBackend<ExternalSubscriptionResponse>(
      SUBSCRIPTION_ENDPOINT
    );
    const rawPlan =
      (payload && payload.subscription) ||
      (payload as ExternalSubscriptionPlan);
    if (!rawPlan) {
      throw new Error("[subscription] Unexpected API response shape");
    }
    return normalizeSubscriptionPlan(rawPlan);
  } catch (error) {
    console.error("[subscription] Failed to reach backend API", error);
    return { ...FALLBACK_SUBSCRIPTION };
  }
}

export async function getSubscriptionPlan(): Promise<SubscriptionRecord> {
  try {
    return await getOrSetCacheValue(
      SUBSCRIPTION_CACHE_KEY,
      SUBSCRIPTION_CACHE_TTL_MS,
      fetchSubscriptionFromApi
    );
  } catch (error) {
    console.error("[subscription] Unable to load plan data", error);
    return { ...FALLBACK_SUBSCRIPTION };
  }
}


