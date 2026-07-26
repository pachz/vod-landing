import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogsPage } from "@/components/blogs";
import { buildBlogsListingMetadata } from "@/lib/blogsMetadata";

interface LangBlogsPageProps {
  params: Promise<{ lang: string }>;
}

function BlogsPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white pt-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
    </div>
  );
}

export async function generateMetadata({
  params,
}: LangBlogsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "ar" ? "ar" : "en";
  return buildBlogsListingMetadata(locale);
}

export default function LangBlogsPage() {
  return (
    <Suspense fallback={<BlogsPageFallback />}>
      <BlogsPage />
    </Suspense>
  );
}
