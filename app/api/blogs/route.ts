import { NextResponse } from "next/server";
import { getLandingBlogs } from "@/lib/server/blogs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupportedLocale = "en" | "ar";

export type BlogsResponseItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: number;
  readingTimeMinutes: number;
  viewCount: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  category: {
    id: string;
    name: string;
    color: string | null;
  } | null;
};

function mapToLocale(
  locale: SupportedLocale,
  blogs: Awaited<ReturnType<typeof getLandingBlogs>>
): BlogsResponseItem[] {
  return blogs.map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: locale === "ar" ? blog.titleAr || blog.titleEn : blog.titleEn,
    excerpt:
      locale === "ar"
        ? blog.excerptAr || blog.excerptEn || ""
        : blog.excerptEn || blog.excerptAr || "",
    imageUrl: blog.imageUrl ?? null,
    thumbnailUrl: blog.thumbnailImageUrl ?? blog.imageUrl ?? null,
    publishedAt: blog.publishedAt,
    readingTimeMinutes: blog.readingTimeMinutes,
    viewCount: blog.viewCount,
    author: blog.author
      ? {
          id: blog.author.id,
          name:
            locale === "ar"
              ? blog.author.nameAr || blog.author.nameEn
              : blog.author.nameEn,
          avatarUrl:
            blog.author.profileThumbnailUrl ??
            blog.author.profileImageUrl ??
            null,
        }
      : null,
    category: blog.category
      ? {
          id: blog.category.id,
          name:
            locale === "ar"
              ? blog.category.nameAr || blog.category.nameEn
              : blog.category.nameEn,
          color: blog.category.color ?? null,
        }
      : null,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: SupportedLocale =
    localeParam === "ar" || localeParam === "en" ? localeParam : "en";

  try {
    const blogs = await getLandingBlogs();
    const items = mapToLocale(locale, blogs);

    return NextResponse.json({
      locale,
      items,
      cachedAt: Date.now(),
      ttlMs: 60 * 1000,
    });
  } catch (error) {
    console.error("[blogs API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to load blogs data" },
      { status: 500 }
    );
  }
}
