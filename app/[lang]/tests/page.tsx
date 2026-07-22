import { Suspense } from "react";
import { TestsPage } from "@/components/tests";

function TestsPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg pt-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
    </div>
  );
}

export default function LangTestsPage() {
  return (
    <Suspense fallback={<TestsPageFallback />}>
      <TestsPage />
    </Suspense>
  );
}
