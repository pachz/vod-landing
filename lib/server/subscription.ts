import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const SUBSCRIPTION_ENDPOINT = "/subscription";
const SUBSCRIPTION_CACHE_KEY = "subscription-plan";
export const SUBSCRIPTION_CACHE_TTL_MS = 60 * 1000;

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
  const currency = sanitizeCurrency(raw.currency);
  const interval = normalizeInterval(raw.interval);
  const amountCents = sanitizeAmountCents(
    raw.amountCents ??
      (typeof raw.amount === "number" && currency
        ? raw.amount * (ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100)
        : undefined)
  );

  const productId = sanitizeString(raw.productId);
  const nameEn = sanitizeString(raw.nameEn) ?? sanitizeString(raw.name);

  if (!productId || !nameEn || !amountCents || !currency || !interval) {
    throw new Error(
      "[subscription] Incomplete API response: missing productId, nameEn, amountCents, currency, or interval"
    );
  }

  return {
    productId,
    priceId: sanitizeString(raw.priceId),
    nameEn,
    nameAr: sanitizeString(raw.nameAr),
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
    throw error;
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
    throw error;
  }
}


