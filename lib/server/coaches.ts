import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const COACHES_ENDPOINT = "/coaches";
const COACHES_CACHE_KEY = "landing-coaches";
const COACHES_CACHE_TTL_MS = 30 * 1000;

interface ExternalCoach {
  id: string;
  nameEn: string;
  nameAr: string;
  expertiseEn: string;
  expertiseAr: string;
  descriptionEn: string;
  descriptionAr: string;
  rating: number;
  profileImageUrl: string | null;
  profileThumbnailUrl: string | null;
  lastUpdatedAt: number;
}

// Backend can return either a plain array or an object wrapper { coaches: [...] }
type CoachesApiResponse =
  | ExternalCoach[]
  | {
      coaches?: ExternalCoach[];
    };

export interface CoachRecord {
  id: string;
  nameEn: string;
  nameAr: string;
  expertiseEn: string;
  expertiseAr: string;
  descriptionEn: string;
  descriptionAr: string;
  rating: number;
  profileImageUrl?: string;
  profileThumbnailUrl?: string;
  lastUpdatedAt?: string;
}

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeRating(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  const clamped = Math.min(Math.max(value, 0), 5);
  return Math.round(clamped * 10) / 10;
}

function sanitizeTimestamp(value?: number | null): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  try {
    return new Date(value).toISOString();
  } catch {
    return undefined;
  }
}

function normalizeCoaches(raw: ExternalCoach[] | null | undefined): CoachRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c) => c && typeof c.id === "string")
    .map((c) => ({
      id: String(c.id).trim(),
      nameEn: sanitizeString(c.nameEn) ?? "",
      nameAr: sanitizeString(c.nameAr) ?? "",
      expertiseEn: sanitizeString(c.expertiseEn) ?? "",
      expertiseAr: sanitizeString(c.expertiseAr) ?? "",
      descriptionEn: sanitizeString(c.descriptionEn) ?? "",
      descriptionAr: sanitizeString(c.descriptionAr) ?? "",
      rating: sanitizeRating(c.rating),
      profileImageUrl: sanitizeString(c.profileImageUrl ?? undefined),
      profileThumbnailUrl: sanitizeString(c.profileThumbnailUrl ?? undefined),
      lastUpdatedAt: sanitizeTimestamp(c.lastUpdatedAt),
    }))
    .filter((c) => c.id.length > 0);
}

async function fetchCoachesFromApi(): Promise<CoachRecord[]> {
  try {
    const baseUrl = process.env.BACKEND_API_URL ?? "";
    const fullUrl = baseUrl
      ? `${baseUrl.replace(/\/$/, "")}${COACHES_ENDPOINT}`
      : COACHES_ENDPOINT;
    console.log("[coaches] Fetching from URL:", fullUrl);

    const payload = await fetchFromBackend<CoachesApiResponse>(
      COACHES_ENDPOINT
    );
    // console.log("[coaches] raw response payload:", payload);

    const list: ExternalCoach[] = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as any)?.coaches)
      ? (payload as any).coaches
      : [];

    return normalizeCoaches(list);
  } catch (error) {
    console.warn("[coaches] Failed to fetch coaches from backend", error);
    // Fail gracefully – courses API should still work even if coaches endpoint is missing
    return [];
  }
}

export async function getCoaches(): Promise<CoachRecord[]> {
  return getOrSetCacheValue(
    COACHES_CACHE_KEY,
    COACHES_CACHE_TTL_MS,
    fetchCoachesFromApi
  );
}


