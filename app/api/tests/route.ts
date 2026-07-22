import { NextResponse } from "next/server";
import { getLandingTests } from "@/lib/server/tests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

export interface TestsResponseItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  questionCount: number;
}

function mapToLocale(
  locale: SupportedLocale,
  tests: Awaited<ReturnType<typeof getLandingTests>>
): TestsResponseItem[] {
  return tests.map((test) => ({
    id: test.id,
    title: locale === "ar" ? test.nameAr || test.nameEn : test.nameEn,
    description:
      locale === "ar"
        ? test.descriptionAr || test.descriptionEn || ""
        : test.descriptionEn || test.descriptionAr || "",
    thumbnailUrl: test.thumbnailImageUrl ?? null,
    questionCount: test.questionCount,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const tests = await getLandingTests();
    const items = mapToLocale(locale, tests);

    return NextResponse.json({
      locale,
      items,
      cachedAt: Date.now(),
      ttlMs: 60 * 1000,
    });
  } catch (error) {
    console.error("[tests API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load tests data" },
      { status: 500 }
    );
  }
}
