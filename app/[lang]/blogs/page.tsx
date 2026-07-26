import { Suspense } from "react";
import { BlogsPage } from "@/components/blogs";

function BlogsPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white pt-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
    </div>
  );
}

export default function LangBlogsPage() {
  return (
    <Suspense fallback={<BlogsPageFallback />}>
      <BlogsPage />
    </Suspense>
  );
}
