export type BlogCardItem = {
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

export type BlogDetailAuthor = {
  id: string;
  name: string;
  description: string;
  avatarUrl: string | null;
  profileImageUrl: string | null;
};

export type BlogDetailData = Omit<BlogCardItem, "author"> & {
  body: string;
  author: BlogDetailAuthor | null;
  related: BlogCardItem[];
};

/** Normalize blog markdown alignment containers for remark-directive. */
export function preprocessBlogMarkdown(content: string): string {
  if (!content) {
    return "";
  }

  return content
    // remark-directive requires `:::name` with no space after the colons.
    .replace(
      /^::: +(left|right|center|justify)\s*$/gim,
      (_match, name: string) => `:::${name.toLowerCase()}`
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function formatBlogDate(
  publishedAt: number,
  locale: "en" | "ar"
): string {
  if (!publishedAt) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(publishedAt));
  } catch {
    return "";
  }
}

export function formatReadingTime(
  minutes: number,
  labels: { minute: string; minutes: string }
): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const unit = safeMinutes === 1 ? labels.minute : labels.minutes;
  return `${safeMinutes} ${unit}`;
}
