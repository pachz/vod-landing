import { NextResponse } from "next/server";
import { getCarouselFeed } from "@/lib/server/carousel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

interface CarouselResponseItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  durationMinutes: number;
  image: string;
}

function formatDuration(minutes: number, locale: SupportedLocale): string {
  if (!minutes || Number.isNaN(minutes)) {
    return locale === "ar" ? "0 دقيقة" : "0 min";
  }

  if (locale === "ar") {
    return `${minutes} دقيقة`;
  }

  return `${minutes} min`;
}

function mapToLocale(
  locale: SupportedLocale,
  items: Awaited<ReturnType<typeof getCarouselFeed>>
): CarouselResponseItem[] {
  return items.map((item) => ({
    id: item.id,
    title: locale === "ar" && item.titleAr ? item.titleAr : item.title,
    category:
      locale === "ar" && item.categoryAr ? item.categoryAr : item.category,
    durationMinutes: item.durationMinutes,
    duration: formatDuration(item.durationMinutes, locale),
    image: item.coverImage,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const rawItems = await getCarouselFeed();
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

