import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { pageHtml, pageInfo, routes, products, playIdeas, channels } from "@/site/content";
import { seoInfo, structuredGraph } from "@/site/seo";
import { pageMetadata } from "@/site/metadata";
import { Website } from "@/components/website";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export const revalidate = 3600;
function searchString(values: Record<string, string | string[] | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((item) => search.append(key, item));
    else if (value !== undefined) search.set(key, value);
  }
  return search.toString() ? `?${search}` : "";
}
async function context({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const route = slug?.join("/") || "";
  if (!hasLocale(routing.locales, locale) || !routes.includes(route)) notFound();
  return { locale, route, search: searchString(await searchParams) };
}
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => routes.map((route) => ({ locale, slug: route ? route.split("/") : [] })));
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, route, search } = await context(props);
  const page = pageInfo(locale, route, search);
  const info = seoInfo(locale, route, page, products, playIdeas);
  const idea = playIdeas.find((item) => route === `play-ideas/${item.id}`);
  return pageMetadata(info, locale, Boolean(idea || route.startsWith('guides/')));
}
export default async function Page(props: Props) {
  const { locale, route, search } = await context(props);
  const page = pageInfo(locale, route, search);
  const graph = structuredGraph(locale, route, page, products, playIdeas, channels);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />
    <Website html={pageHtml(locale, route, search)} locale={locale} route={route} />
  </>;
}
