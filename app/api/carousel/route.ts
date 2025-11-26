import { NextResponse } from "next/server";
import {
  type CarouselRecord,
  getCarouselFeed,
} from "@/lib/server/carousel";
import { getCourseBySlug } from "@/lib/server/course";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

interface CarouselResponseItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  duration: string;
  durationMinutes: number;
  image: string;
}

function roundMinutesToNearestFive(minutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return 0;
  }

  const remainder = minutes % 5;
  const rounded =
    remainder >= 2 ? minutes + (5 - remainder) : minutes - remainder;

  return Math.round(rounded);
}

function formatDuration(minutes: number, locale: SupportedLocale): string {
  const safeMinutes = Math.max(0, Math.round(minutes));

  if (safeMinutes === 0) {
    return locale === "ar" ? "0د" : "0m";
  }

  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes - hours * 60;

  if (hours === 0) {
    return locale === "ar"
      ? `${remainingMinutes}د`
      : `${remainingMinutes}m`;
  }

  const paddedMinutes = remainingMinutes.toString().padStart(2, "0");
  if (locale === "ar") {
    return `${hours}س ${paddedMinutes}د`;
  }

  return `${hours}h ${paddedMinutes}m`;
}

function mapToLocale(
  locale: SupportedLocale,
  items: Awaited<ReturnType<typeof getCarouselFeed>>
): CarouselResponseItem[] {
  return items.map((item) => {
    const durationMinutes = roundMinutesToNearestFive(item.durationMinutes);
    return {
      id: item.id,
      slug: item.slug,
      title: locale === "ar" && item.titleAr ? item.titleAr : item.title,
      category:
        locale === "ar" && item.categoryAr ? item.categoryAr : item.category,
      durationMinutes,
      duration: formatDuration(durationMinutes, locale),
      image: item.coverImage,
    };
  });
}

function extractUniqueSlugs(items: CarouselRecord[]): string[] {
  const unique = new Set<string>();
  for (const item of items) {
    const slug = item.slug?.trim();
    if (slug) {
      unique.add(slug);
    }
  }
  return Array.from(unique);
}

async function cacheCourseDetails(slugs: string[]): Promise<void> {
  await Promise.allSettled(
    slugs.map(async (slug) => {
      try {
        await getCourseBySlug(slug);
      } catch {
        // Individual failures are already logged by getCourseBySlug.
      }
    })
  );
}

function warmCourseDetailsInBackground(items: CarouselRecord[]): void {
  const slugs = extractUniqueSlugs(items);
  if (slugs.length === 0) {
    return;
  }

  setTimeout(() => {
    cacheCourseDetails(slugs).catch((error) => {
      console.error("[carousel API] Failed to warm detail cache", error);
    });
  }, 0);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const rawItems = await getCarouselFeed();
    warmCourseDetailsInBackground(rawItems);
    const items = mapToLocale(locale, rawItems);
    return NextResponse.json({
      locale,
      items,
      cachedAt: Date.now(),
      ttlMs: 5 * 60 * 1000,
    });
  } catch (error) {
    console.error("[carousel API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load carousel data" },
      { status: 500 }
    );
  }
}

