import { fetchFromBackend } from "@/lib/server/apiClient";
import { getOrSetCacheValue } from "@/lib/server/memoryCache";

const BLOGS_ENDPOINT = "/blogs";
const BLOG_DETAIL_ENDPOINT = "/blog";
const BLOG_VIEW_ENDPOINT = "/blogs/view";
const BLOGS_CACHE_KEY = "landing-blogs";
const BLOG_DETAIL_CACHE_PREFIX = "landing-blog:";
const BLOGS_CACHE_TTL_MS = 60 * 1000;
const BLOG_DETAIL_CACHE_TTL_MS = 30 * 1000;

type ExternalBlogAuthor = {
  id?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  profileImageUrl?: string | null;
  profileThumbnailUrl?: string | null;
};

type ExternalBlogCategory = {
  id?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  color?: string | null;
};

type ExternalBlogListItem = {
  id?: string | null;
  slug?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  excerptEn?: string | null;
  excerptAr?: string | null;
  imageUrl?: string | null;
  thumbnailImageUrl?: string | null;
  publishedAt?: number | null;
  readingTimeMinutes?: number | null;
  viewCount?: number | null;
  author?: ExternalBlogAuthor | null;
  category?: ExternalBlogCategory | null;
};

type ExternalBlogViews = {
  day?: number | null;
  week?: number | null;
  month?: number | null;
  total?: number | null;
};

type ExternalBlogDetail = ExternalBlogListItem & {
  bodyEn?: string | null;
  bodyAr?: string | null;
  related?: ExternalBlogListItem[] | null;
  views?: ExternalBlogViews | null;
};

type ExternalBlogsApiResponse = {
  blogs?: ExternalBlogListItem[] | null;
};

export type LandingBlogAuthor = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  profileImageUrl?: string;
  profileThumbnailUrl?: string;
};

export type LandingBlogCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
  color?: string;
};

export type LandingBlogListRecord = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn?: string;
  excerptAr?: string;
  imageUrl?: string;
  thumbnailImageUrl?: string;
  publishedAt: number;
  readingTimeMinutes: number;
  viewCount: number;
  author?: LandingBlogAuthor;
  category?: LandingBlogCategory;
};

export type LandingBlogDetailRecord = LandingBlogListRecord & {
  bodyEn?: string;
  bodyAr?: string;
  related: LandingBlogListRecord[];
  views: {
    day: number;
    week: number;
    month: number;
    total: number;
  };
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

function sanitizePublishedAt(value?: number | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function normalizeAuthor(
  author?: ExternalBlogAuthor | null
): LandingBlogAuthor | undefined {
  if (!author) {
    return undefined;
  }
  const id = sanitizeString(author.id);
  const nameEn = sanitizeString(author.nameEn);
  if (!id || !nameEn) {
    return undefined;
  }
  return {
    id,
    nameEn,
    nameAr: sanitizeString(author.nameAr) ?? nameEn,
    descriptionEn: sanitizeString(author.descriptionEn),
    descriptionAr: sanitizeString(author.descriptionAr),
    profileImageUrl: sanitizeString(author.profileImageUrl),
    profileThumbnailUrl: sanitizeString(author.profileThumbnailUrl),
  };
}

function normalizeCategory(
  category?: ExternalBlogCategory | null
): LandingBlogCategory | undefined {
  if (!category) {
    return undefined;
  }
  const id = sanitizeString(category.id);
  const nameEn = sanitizeString(category.nameEn);
  if (!id || !nameEn) {
    return undefined;
  }
  return {
    id,
    nameEn,
    nameAr: sanitizeString(category.nameAr) ?? nameEn,
    color: sanitizeString(category.color),
  };
}

function normalizeBlogListItem(
  item: ExternalBlogListItem
): LandingBlogListRecord | null {
  const id = sanitizeString(item.id);
  const slug = sanitizeString(item.slug);
  const titleEn = sanitizeString(item.titleEn);
  if (!id || !slug || !titleEn) {
    return null;
  }

  return {
    id,
    slug,
    titleEn,
    titleAr: sanitizeString(item.titleAr) ?? titleEn,
    excerptEn: sanitizeString(item.excerptEn),
    excerptAr: sanitizeString(item.excerptAr),
    imageUrl: sanitizeString(item.imageUrl),
    thumbnailImageUrl: sanitizeString(item.thumbnailImageUrl),
    publishedAt: sanitizePublishedAt(item.publishedAt),
    readingTimeMinutes: sanitizeNonNegativeInteger(item.readingTimeMinutes),
    viewCount: sanitizeNonNegativeInteger(item.viewCount),
    author: normalizeAuthor(item.author),
    category: normalizeCategory(item.category),
  };
}

function normalizeBlogDetail(
  item: ExternalBlogDetail
): LandingBlogDetailRecord | null {
  const base = normalizeBlogListItem(item);
  if (!base) {
    return null;
  }

  const relatedRaw = Array.isArray(item.related) ? item.related : [];
  const related = relatedRaw
    .map(normalizeBlogListItem)
    .filter((blog): blog is LandingBlogListRecord => blog !== null);

  return {
    ...base,
    bodyEn: sanitizeString(item.bodyEn),
    bodyAr: sanitizeString(item.bodyAr),
    related,
    views: {
      day: sanitizeNonNegativeInteger(item.views?.day),
      week: sanitizeNonNegativeInteger(item.views?.week),
      month: sanitizeNonNegativeInteger(item.views?.month),
      total: sanitizeNonNegativeInteger(item.views?.total),
    },
  };
}

function sortBlogs(blogs: LandingBlogListRecord[]): LandingBlogListRecord[] {
  return [...blogs].sort((a, b) => {
    if (a.publishedAt !== b.publishedAt) {
      return b.publishedAt - a.publishedAt;
    }
    return a.titleEn.localeCompare(b.titleEn);
  });
}

async function fetchLandingBlogs(): Promise<LandingBlogListRecord[]> {
  const payload = await fetchFromBackend<ExternalBlogsApiResponse>(
    BLOGS_ENDPOINT
  );
  const rawBlogs = Array.isArray(payload.blogs) ? payload.blogs : [];
  const normalized = rawBlogs
    .map(normalizeBlogListItem)
    .filter((blog): blog is LandingBlogListRecord => blog !== null);
  return sortBlogs(normalized);
}

async function fetchLandingBlogBySlug(
  slug: string
): Promise<LandingBlogDetailRecord | null> {
  try {
    const payload = await fetchFromBackend<ExternalBlogDetail>(
      `${BLOG_DETAIL_ENDPOINT}/${encodeURIComponent(slug)}`
    );
    return normalizeBlogDetail(payload);
  } catch (error) {
    console.error(`[blogs] Failed to load blog "${slug}"`, error);
    return null;
  }
}

export async function getLandingBlogs(): Promise<LandingBlogListRecord[]> {
  return getOrSetCacheValue(
    BLOGS_CACHE_KEY,
    BLOGS_CACHE_TTL_MS,
    fetchLandingBlogs
  );
}

export async function getLandingBlogBySlug(
  slug: string
): Promise<LandingBlogDetailRecord | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  return getOrSetCacheValue(
    `${BLOG_DETAIL_CACHE_PREFIX}${normalizedSlug}`,
    BLOG_DETAIL_CACHE_TTL_MS,
    () => fetchLandingBlogBySlug(normalizedSlug)
  );
}

export async function recordBlogView(slug: string): Promise<{
  blogId: string;
  slug: string;
  views: {
    day: number;
    week: number;
    month: number;
    total: number;
  };
}> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    throw new Error("Missing blog slug");
  }

  const payload = await fetchFromBackend<{
    blogId?: string | null;
    slug?: string | null;
    views?: ExternalBlogViews | null;
  }>(BLOG_VIEW_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ slug: normalizedSlug }),
  });

  return {
    blogId: sanitizeString(payload.blogId) ?? "",
    slug: sanitizeString(payload.slug) ?? normalizedSlug,
    views: {
      day: sanitizeNonNegativeInteger(payload.views?.day),
      week: sanitizeNonNegativeInteger(payload.views?.week),
      month: sanitizeNonNegativeInteger(payload.views?.month),
      total: sanitizeNonNegativeInteger(payload.views?.total),
    },
  };
}
