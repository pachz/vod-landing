import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailClient } from "@/components/blogs";
import type { BlogCardItem, BlogDetailData } from "@/lib/blogs";
import {
  getLandingBlogBySlug,
  type LandingBlogDetailRecord,
  type LandingBlogListRecord,
} from "@/lib/server/blogs";

interface BlogDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

type SupportedLocale = "en" | "ar";

function mapListItem(
  blog: LandingBlogListRecord,
  locale: SupportedLocale
): BlogCardItem {
  return {
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
  };
}

function mapDetail(
  blog: LandingBlogDetailRecord,
  locale: SupportedLocale
): BlogDetailData {
  const base = mapListItem(blog, locale);
  const author = blog.author
    ? {
        id: blog.author.id,
        name:
          locale === "ar"
            ? blog.author.nameAr || blog.author.nameEn
            : blog.author.nameEn,
        description:
          locale === "ar"
            ? blog.author.descriptionAr || blog.author.descriptionEn || ""
            : blog.author.descriptionEn || blog.author.descriptionAr || "",
        avatarUrl:
          blog.author.profileThumbnailUrl ??
          blog.author.profileImageUrl ??
          null,
        profileImageUrl:
          blog.author.profileImageUrl ??
          blog.author.profileThumbnailUrl ??
          null,
      }
    : null;

  return {
    ...base,
    body:
      locale === "ar"
        ? blog.bodyAr || blog.bodyEn || ""
        : blog.bodyEn || blog.bodyAr || "",
    author,
    related: blog.related.map((item) => mapListItem(item, locale)),
  };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: SupportedLocale = lang === "ar" ? "ar" : "en";
  const blog = await getLandingBlogBySlug(slug);

  if (!blog) {
    return {
      title: locale === "ar" ? "المدونة" : "Blog",
    };
  }

  const title = locale === "ar" ? blog.titleAr || blog.titleEn : blog.titleEn;
  const description =
    locale === "ar"
      ? blog.excerptAr || blog.excerptEn || undefined
      : blog.excerptEn || blog.excerptAr || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : undefined,
    },
  };
}

export default async function LangBlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { lang, slug } = await params;
  const locale: SupportedLocale = lang === "ar" ? "ar" : "en";
  const blog = await getLandingBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetailClient blog={mapDetail(blog, locale)} lang={locale} />;
}
