import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/server/siteUrl";
import type { LandingBlogDetailRecord } from "@/lib/server/blogs";

type SupportedLocale = "en" | "ar";

const SITE_NAME = "Reham Diva";

function resolveAbsoluteUrl(url: string | undefined | null): string | undefined {
  if (!url) {
    return undefined;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const base = getSiteUrl();
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

export function getBlogPostPath(lang: SupportedLocale, slug: string): string {
  return `/${lang}/blog/${encodeURIComponent(slug)}`;
}

export function getBlogPostUrl(lang: SupportedLocale, slug: string): string {
  return `${getSiteUrl()}${getBlogPostPath(lang, slug)}`;
}

export function buildBlogPostMetadata(
  blog: LandingBlogDetailRecord,
  locale: SupportedLocale
): Metadata {
  const title =
    locale === "ar" ? blog.titleAr || blog.titleEn : blog.titleEn;
  const description =
    locale === "ar"
      ? blog.excerptAr || blog.excerptEn || undefined
      : blog.excerptEn || blog.excerptAr || undefined;
  const canonicalUrl = getBlogPostUrl(locale, blog.slug);
  const imageUrl =
    resolveAbsoluteUrl(blog.imageUrl) ??
    resolveAbsoluteUrl(blog.thumbnailImageUrl);
  const authorName = blog.author
    ? locale === "ar"
      ? blog.author.nameAr || blog.author.nameEn
      : blog.author.nameEn
    : undefined;
  const publishedTime =
    blog.publishedAt > 0 ? new Date(blog.publishedAt).toISOString() : undefined;

  const ogImages = imageUrl
    ? [
        {
          url: imageUrl,
          alt: title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: getBlogPostUrl("en", blog.slug),
        ar: getBlogPostUrl("ar", blog.slug),
      },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url: canonicalUrl,
      title,
      description,
      images: ogImages,
      publishedTime,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function buildBlogsListingMetadata(locale: SupportedLocale): Metadata {
  const title = locale === "ar" ? "المدونة" : "Blogs";
  const description =
    locale === "ar"
      ? "مقالات ونصائح ملهمة تساعدكِ على أن تصبحي أفضل نسخة من نفسك."
      : "Inspiring articles and tips to help you become the best version of yourself.";
  const canonicalUrl = `${getSiteUrl()}/${locale}/blogs`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${getSiteUrl()}/en/blogs`,
        ar: `${getSiteUrl()}/ar/blogs`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      url: canonicalUrl,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
