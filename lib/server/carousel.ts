import { courses } from "@/lib/data";
import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const CAROUSEL_CACHE_KEY = "carousel-feed";
const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const CAROUSEL_ENDPOINT = "/carousel";

interface ExternalCarouselApiResponse {
  courses: ExternalCarouselApiItem[];
}

export interface ExternalCarouselApiItem {
  id: string;
  slug?: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  categoryNameEn: string;
  categoryNameAr?: string;
  durationMinutes: number;
  coverImageUrl: string;
}

export interface CarouselRecord {
  id: string;
  slug?: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  category: string;
  categoryAr?: string;
  durationMinutes: number;
  coverImage: string;
}

function normalizeApiItem(item: ExternalCarouselApiItem): CarouselRecord {
  return {
    id: item.id,
    slug: item.slug,
    title: item.titleEn,
    titleAr: item.titleAr,
    description: item.descriptionEn,
    descriptionAr: item.descriptionAr,
    category: item.categoryNameEn,
    categoryAr: item.categoryNameAr,
    durationMinutes: item.durationMinutes,
    coverImage: item.coverImageUrl,
  };
}

function fallbackFromStatic(): CarouselRecord[] {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    titleAr: course.titleAr,
    description: course.description,
    descriptionAr: course.descriptionAr,
    category: course.category,
    categoryAr: course.category,
    durationMinutes: parseDurationMinutes(course.duration),
    coverImage: course.image,
  }));
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  if (!match) {
    return 0;
  }
  return Number.parseInt(match[1], 10);
}

async function fetchCarouselFromApi(): Promise<CarouselRecord[]> {
  try {
    const payload = await fetchFromBackend<ExternalCarouselApiResponse>(
      CAROUSEL_ENDPOINT
    );

    if (!payload || !Array.isArray(payload.courses)) {
      throw new Error("[carousel] Unexpected API response shape");
    }

    return payload.courses.map(normalizeApiItem);
  } catch (error) {
    console.error("[carousel] Failed to reach backend API", error);
    return fallbackFromStatic();
  }
}

export async function getCarouselFeed(): Promise<CarouselRecord[]> {
  try {
    return await getOrSetCacheValue(
      CAROUSEL_CACHE_KEY,
      FIVE_MINUTES_IN_MS,
      fetchCarouselFromApi
    );
  } catch (error) {
    console.error(
      "[carousel] Unable to retrieve data from external API. Using fallback.",
      error
    );
    return fallbackFromStatic();
  }
}

