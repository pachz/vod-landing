import { getPanelUrl } from "@/lib/panelUrl";
import LangHomePageClient from "@/components/home/LangHomePageClient";

type Params = Promise<{ lang: string }>;

export default async function LangHomePage({
  params,
}: {
  params: Params;
}) {
  const { lang } = await params;
  const panelUrl = getPanelUrl(lang === "ar" ? "ar" : "en");
  return <LangHomePageClient panelUrl={panelUrl} />;
}
