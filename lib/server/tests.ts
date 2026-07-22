import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const TESTS_ENDPOINT = "/tests";
const TESTS_CACHE_KEY = "landing-tests";
const TESTS_CACHE_TTL_MS = 60 * 1000;

type ExternalLandingTest = {
  id?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  thumbnailImageUrl?: string | null;
  questionCount?: number | null;
  displayOrder?: number | null;
  updatedAt?: number | null;
};

type ExternalTestsApiResponse = {
  tests?: ExternalLandingTest[] | null;
};

export type LandingTestRecord = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  thumbnailImageUrl?: string;
  questionCount: number;
  displayOrder: number;
  updatedAt: number;
};

function sanitizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeNonNegativeInteger(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function sanitizeDisplayOrder(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 50;
  }
  return Math.round(value);
}

function sanitizeUpdatedAt(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function normalizeTest(item: ExternalLandingTest): LandingTestRecord | null {
  const id = sanitizeString(item.id);
  const nameEn = sanitizeString(item.nameEn);
  if (!id || !nameEn) {
    return null;
  }

  return {
    id,
    nameEn,
    nameAr: sanitizeString(item.nameAr) ?? nameEn,
    descriptionEn: sanitizeString(item.descriptionEn),
    descriptionAr: sanitizeString(item.descriptionAr),
    thumbnailImageUrl: sanitizeString(item.thumbnailImageUrl),
    questionCount: sanitizeNonNegativeInteger(item.questionCount),
    displayOrder: sanitizeDisplayOrder(item.displayOrder),
    updatedAt: sanitizeUpdatedAt(item.updatedAt),
  };
}

function sortTests(tests: LandingTestRecord[]): LandingTestRecord[] {
  return [...tests].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.updatedAt !== b.updatedAt) {
      return a.updatedAt - b.updatedAt;
    }
    return a.nameEn.localeCompare(b.nameEn);
  });
}

async function fetchLandingTests(): Promise<LandingTestRecord[]> {
  const payload = await fetchFromBackend<ExternalTestsApiResponse>(TESTS_ENDPOINT);
  const rawTests = Array.isArray(payload.tests) ? payload.tests : [];
  const normalized = rawTests
    .map(normalizeTest)
    .filter((test): test is LandingTestRecord => test !== null);
  return sortTests(normalized);
}

export async function getLandingTests(): Promise<LandingTestRecord[]> {
  return getOrSetCacheValue(TESTS_CACHE_KEY, TESTS_CACHE_TTL_MS, fetchLandingTests);
}
