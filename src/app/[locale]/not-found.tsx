import { getLocale } from "next-intl/server";
import { pageHtml } from "@/site/content";
import { Website } from "@/components/website";
export default async function NotFound() {
  const locale = await getLocale();
  return <Website html={pageHtml(locale, "404")} locale={locale} route="404" />;
}
