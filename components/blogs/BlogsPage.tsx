"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout";
import { Input } from "@/components/ui/input";
import type { BlogCardItem } from "@/lib/blogs";
import { useTranslation } from "@/lib/useTranslation";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils";
import BlogCard from "./BlogCard";

type BlogsApiResponse = {
  locale: string;
  items: BlogCardItem[];
};

const PAGE_SIZE = 6;

export default function BlogsPage() {
  const { t, locale } = useTranslation();
  const { direction } = useDirection();
  const isRtl = direction === "rtl";
  const loadErrorLabel = t("blogs.loadError");
  const retryLabel = t("blogs.retry");

  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [blogs, setBlogs] = useState<BlogCardItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchBlogs = useCallback(async () => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs?locale=${locale}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to load blogs");
      }
      const payload = (await response.json()) as BlogsApiResponse;
      if (requestIdRef.current !== requestId) {
        return;
      }
      setBlogs(Array.isArray(payload.items) ? payload.items : []);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      console.error("[blogs page] Failed to load blogs", err);
      if (requestIdRef.current !== requestId) {
        return;
      }
      setBlogs([]);
      setError(loadErrorLabel);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [locale, loadErrorLabel]);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string | null }>();
    for (const blog of blogs) {
      if (blog.category && !map.has(blog.category.id)) {
        map.set(blog.category.id, blog.category);
      }
    }
    return Array.from(map.values());
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (selectedCategoryId && blog.category?.id !== selectedCategoryId) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack =
        `${blog.title} ${blog.excerpt} ${blog.category?.name ?? ""} ${blog.author?.name ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [blogs, query, selectedCategoryId]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedCategoryId]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredBlogs.length;
  const showSkeleton = loading && blogs.length === 0;
  const noResults = !loading && filteredBlogs.length === 0 && !error;
  const readingTimeLabels = {
    minute: t("blogs.minRead"),
    minutes: t("blogs.minReadPlural"),
  };

  return (
    <div className="min-h-screen bg-white" dir={direction}>
      <main className="pt-16">
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="mx-auto max-w-2xl space-y-3 text-center lg:mx-0 lg:text-start">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {t("blogs.title")}
                </h1>
                <p className="text-base text-gray-500 sm:text-lg">
                  {t("blogs.subtitle")}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:mt-1">
                <Search
                  className={cn(
                    "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
                    isRtl ? "right-3" : "left-3"
                  )}
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("blogs.searchPlaceholder")}
                  className={cn(
                    "h-11 rounded-full border-gray-200 bg-white shadow-sm",
                    isRtl ? "pr-10" : "pl-10"
                  )}
                />
              </div>
            </div>

            {categories.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap items-center justify-center gap-2",
                  isRtl && "flex-row-reverse"
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selectedCategoryId === null
                      ? "border-pink-500 text-pink-600"
                      : "border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600"
                  )}
                >
                  {t("blogs.allCategories")}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      selectedCategoryId === category.id
                        ? "border-pink-500 text-pink-600"
                        : "border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center">
                <p className="mb-4 font-medium text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => void fetchBlogs()}
                  className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-700"
                >
                  {retryLabel}
                </button>
              </div>
            )}

            {showSkeleton && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`blog-skeleton-${index}`}
                    className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                  />
                ))}
              </div>
            )}

            {!showSkeleton && !error && (
              <>
                {noResults ? (
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                    <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-gray-500">
                      {query.trim() || selectedCategoryId
                        ? t("blogs.noSearchResults")
                        : t("blogs.empty")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {visibleBlogs.map((blog) => (
                        <BlogCard
                          key={blog.id}
                          blog={blog}
                          href={`/${locale}/blog/${encodeURIComponent(blog.slug)}`}
                          locale={locale}
                          isRtl={isRtl}
                          readingTimeLabels={readingTimeLabels}
                        />
                      ))}
                    </div>

                    {canLoadMore && (
                      <div className="flex justify-center pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleCount((count) => count + PAGE_SIZE)
                          }
                          className={cn(
                            "inline-flex items-center gap-2 rounded-xl border border-pink-400 px-6 py-3 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50",
                            isRtl && "flex-row-reverse"
                          )}
                        >
                          {t("blogs.loadMore")}
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
