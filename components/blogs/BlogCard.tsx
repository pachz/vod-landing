"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import {
  formatBlogDate,
  formatReadingTime,
  type BlogCardItem,
} from "@/lib/blogs";
import { cn } from "@/lib/utils";

export type BlogCardProps = {
  blog: BlogCardItem;
  href: string;
  locale: "en" | "ar";
  isRtl: boolean;
  readingTimeLabels: { minute: string; minutes: string };
};

export default function BlogCard({
  blog,
  href,
  locale,
  isRtl,
  readingTimeLabels,
}: BlogCardProps) {
  const imageSrc = blog.thumbnailUrl || blog.imageUrl;
  const dateLabel = formatBlogDate(blog.publishedAt, locale);
  const readingLabel = formatReadingTime(
    blog.readingTimeMinutes,
    readingTimeLabels
  );
  const categoryColor = blog.category?.color || "#EA8BB8";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-pink-100 via-white to-gray-100" />
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5",
          isRtl ? "text-right" : "text-left"
        )}
      >
        {blog.category ? (
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: categoryColor }}
          >
            {blog.category.name}
          </span>
        ) : null}

        <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-pink-700">
          {blog.title}
        </h2>

        {blog.excerpt ? (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
            {blog.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div
          className={cn(
            "mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500",
            isRtl && "flex-row-reverse"
          )}
        >
          {blog.author ? (
            <div
              className={cn(
                "flex items-center gap-2",
                isRtl && "flex-row-reverse"
              )}
            >
              {blog.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.author.avatarUrl}
                  alt={blog.author.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-[10px] font-semibold text-pink-700">
                  {blog.author.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="font-medium text-gray-700">
                {blog.author.name}
              </span>
            </div>
          ) : null}

          {dateLabel ? <span>{dateLabel}</span> : null}

          <span
            className={cn(
              "inline-flex items-center gap-1",
              isRtl && "flex-row-reverse"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {readingLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
