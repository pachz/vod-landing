"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { getPanelMyTestsUrl } from "@/lib/panelUrl";
import { useTranslation } from "@/lib/useTranslation";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils";
import TestCard, { type TestCardItem } from "./TestCard";

type TestsApiResponse = {
  locale: string;
  items: TestCardItem[];
};

export default function TestsPage() {
  const { t, locale } = useTranslation();
  const { direction } = useDirection();
  const isRtl = direction === "rtl";
  const loadErrorLabel = t("tests.loadError");
  const retryLabel = t("tests.retry");

  const [query, setQuery] = useState("");
  const [tests, setTests] = useState<TestCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchTests = useCallback(async () => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tests?locale=${locale}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to load tests");
      }
      const payload = (await response.json()) as TestsApiResponse;
      if (requestIdRef.current !== requestId) {
        return;
      }
      setTests(Array.isArray(payload.items) ? payload.items : []);
    } catch (err) {
      console.error("[tests page] Failed to load tests", err);
      if (requestIdRef.current !== requestId) {
        return;
      }
      setTests([]);
      setError(loadErrorLabel);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [locale, loadErrorLabel]);

  useEffect(() => {
    void fetchTests();
  }, [fetchTests]);

  const filteredTests = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return tests;
    }
    return tests.filter((test) => {
      const haystack = `${test.title} ${test.description}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [tests, query]);

  const handleStartTest = (testId: string) => {
    if (typeof window === "undefined") {
      return;
    }
    window.location.href = getPanelMyTestsUrl(testId, locale);
  };

  const showSkeleton = loading && tests.length === 0;
  const noResults = !loading && filteredTests.length === 0 && !error;

  return (
    <div className="min-h-screen bg-neutral-bg" dir={direction}>
      <main className="pt-16">
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("tests.title")}
              </h1>
              <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
                {t("tests.subtitle")}
              </p>
            </div>

            <div className="relative mx-auto max-w-xl">
              <Search
                className={cn(
                  "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
                  isRtl ? "right-3" : "left-3"
                )}
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("tests.searchPlaceholder")}
                className={cn(
                  "h-11 rounded-xl border-gray-200 bg-white shadow-sm",
                  isRtl ? "pr-10" : "pl-10"
                )}
              />
            </div>

            {error && (
              <div className="text-center">
                <p className="mb-4 font-medium text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => void fetchTests()}
                  className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                >
                  {retryLabel}
                </button>
              </div>
            )}

            {showSkeleton && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`test-skeleton-${index}`}
                    className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-white/70"
                  />
                ))}
              </div>
            )}

            {!showSkeleton && !error && (
              <>
                {noResults ? (
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                    <ClipboardList className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-gray-500">
                      {query.trim()
                        ? t("tests.noSearchResults")
                        : t("tests.empty")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTests.map((test) => (
                      <TestCard
                        key={test.id}
                        test={test}
                        isRtl={isRtl}
                        startLabel={t("tests.startTest")}
                        questionLabel={t("tests.question")}
                        questionsLabel={t("tests.questions")}
                        onStart={handleStartTest}
                      />
                    ))}
                  </div>
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
