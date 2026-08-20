"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { ChevronRight, Clock } from "lucide-react";
import { SiteFooter } from "@/components/layout";
import {
  formatBlogDate,
  formatReadingTime,
  preprocessBlogMarkdown,
  type BlogDetailData,
} from "@/lib/blogs";
import { remarkBlogAlignments } from "@/lib/remarkBlogAlignments";
import { useTranslation } from "@/lib/useTranslation";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils";

export type BlogDetailClientProps = {
  blog: BlogDetailData;
  lang: "en" | "ar";
  shareUrl: string;
};

export default function BlogDetailClient({
  blog,
  lang,
  shareUrl,
}: BlogDetailClientProps) {
  const { t } = useTranslation();
  const { direction } = useDirection();
  const isRtl = direction === "rtl";
  const blogsHref = `/${lang}/blogs`;
  const homeHref = `/${lang}`;

  const dateLabel = formatBlogDate(blog.publishedAt, lang);
  const readingLabel = formatReadingTime(blog.readingTimeMinutes, {
    minute: t("blogs.minRead"),
    minutes: t("blogs.minReadPlural"),
  });
  const markdown = useMemo(
    () => preprocessBlogMarkdown(blog.body),
    [blog.body]
  );
  const categoryColor = blog.category?.color || "#EA8BB8";

  useEffect(() => {
    let cancelled = false;
    const recordView = async () => {
      try {
        await fetch("/api/blogs/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: blog.slug }),
          keepalive: true,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("[blog detail] Failed to record view", error);
        }
      }
    };
    void recordView();
    return () => {
      cancelled = true;
    };
  }, [blog.slug]);

  return (
    <div className="min-h-screen bg-white" dir={direction}>
      <main className="pt-16">
        <article className="px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <nav
              className={cn(
                "mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-500",
                isRtl && "flex-row-reverse"
              )}
              aria-label="Breadcrumb"
            >
              <Link href={homeHref} className="hover:text-pink-600">
                {t("blogs.home")}
              </Link>
              <ChevronRight
                className={cn("h-3.5 w-3.5 text-gray-400", isRtl && "rotate-180")}
              />
              <Link href={blogsHref} className="hover:text-pink-600">
                {t("blogs.title")}
              </Link>
              <ChevronRight
                className={cn("h-3.5 w-3.5 text-gray-400", isRtl && "rotate-180")}
              />
              <span className="line-clamp-1 font-medium text-gray-700">
                {blog.title}
              </span>
            </nav>

            <header className="mb-8 space-y-5">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {blog.title}
              </h1>

              <div
                className={cn(
                  "flex flex-col gap-4 sm:flex-row sm:items-center",
                  isRtl ? "items-start sm:justify-start" : "sm:justify-between"
                )}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
                  {blog.author ? (
                    <div className="flex items-center gap-2">
                      {blog.author.avatarUrl || blog.author.profileImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            blog.author.avatarUrl ||
                            blog.author.profileImageUrl ||
                            ""
                          }
                          alt={blog.author.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-700">
                          {blog.author.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-gray-800">
                        {blog.author.name}
                      </span>
                    </div>
                  ) : null}

                  {blog.category ? (
                    <span style={{ color: categoryColor }}>
                      {blog.category.name}
                    </span>
                  ) : null}

                  {dateLabel ? <span>{dateLabel}</span> : null}

                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingLabel}
                  </span>
                </div>

                {shareUrl ? (
                  <div className="flex items-center gap-2">
                    <FacebookShareButton url={shareUrl}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={blog.title}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={blog.title}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                ) : null}
              </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0 space-y-8">
                {(blog.imageUrl || blog.thumbnailUrl) && (
                  <div className="overflow-hidden rounded-2xl bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.imageUrl || blog.thumbnailUrl || ""}
                      alt={blog.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "prose-blog space-y-4 text-base leading-relaxed text-gray-700",
                    isRtl ? "text-right" : "text-left"
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                      remarkBreaks,
                      remarkDirective,
                      remarkBlogAlignments,
                    ]}
                    components={{
                      div: ({ className, children }) => (
                        <div className={cn("space-y-4", className)}>
                          {children}
                        </div>
                      ),
                      h1: ({ children }) => (
                        <h2 className="pt-2 text-2xl font-bold text-gray-900">
                          {children}
                        </h2>
                      ),
                      h2: ({ children }) => (
                        <h2 className="pt-2 text-xl font-bold text-gray-900">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="pt-1 text-lg font-semibold text-gray-900">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="leading-relaxed text-gray-700">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc space-y-2 ps-5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal space-y-2 ps-5">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed text-gray-700">
                          {children}
                        </li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="rounded-xl border-s-4 border-pink-500 bg-pink-50 px-5 py-4 text-pink-700 italic">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="font-medium text-pink-600 underline-offset-2 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                {blog.author ? (
                  <div className="rounded-2xl border border-gray-200 p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      {t("blogs.aboutAuthor")}
                    </h2>
                    <div className="flex flex-col items-center text-center">
                      {blog.author.profileImageUrl || blog.author.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            blog.author.profileImageUrl ||
                            blog.author.avatarUrl ||
                            ""
                          }
                          alt={blog.author.name}
                          className="mb-4 h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-2xl font-semibold text-pink-700">
                          {blog.author.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <p className="mb-2 text-base font-semibold text-pink-600">
                        {blog.author.name}
                      </p>
                      {blog.author.description ? (
                        <p className="mb-4 text-sm leading-relaxed text-gray-500">
                          {blog.author.description}
                        </p>
                      ) : null}
                      <Link
                        href={blogsHref}
                        className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                      >
                        {t("blogs.viewAllPosts")}
                      </Link>
                    </div>
                  </div>
                ) : null}

                {blog.related.length > 0 ? (
                  <div className="rounded-2xl border border-gray-200 p-6">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      {t("blogs.relatedArticles")}
                    </h2>
                    <ul className="space-y-4">
                      {blog.related.map((related) => {
                        const relatedDate = formatBlogDate(
                          related.publishedAt,
                          lang
                        );
                        const relatedImage =
                          related.thumbnailUrl || related.imageUrl;
                        return (
                          <li key={related.id}>
                            <Link
                              href={`/${lang}/blog/${encodeURIComponent(related.slug)}`}
                              className={cn(
                                "group flex gap-3",
                                isRtl && "flex-row-reverse"
                              )}
                            >
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                {relatedImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={relatedImage}
                                    alt={related.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div
                                className={cn(
                                  "min-w-0",
                                  isRtl ? "text-right" : "text-left"
                                )}
                              >
                                <p className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-pink-600">
                                  {related.title}
                                </p>
                                {relatedDate ? (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {relatedDate}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
