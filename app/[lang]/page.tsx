import { redirect } from "next/navigation";
import { getPanelUrl } from "@/lib/panelUrl";
import LangHomePageClient from "@/components/home/LangHomePageClient";
import { USE_COURSES_AS_HOME } from "@/lib/featureFlags";

type Params = Promise<{ lang: string }>;

export default async function LangHomePage({
  params,
}: {
  params: Params;
}) {
  const { lang } = await params;

  if (USE_COURSES_AS_HOME) {
    redirect(`/${lang}/courses`);
  }

  const panelUrl = getPanelUrl(lang === "ar" ? "ar" : "en");
  return <LangHomePageClient panelUrl={panelUrl} />;
}
