import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { pageHtml, pageInfo, routes, products, playIdeas, productPath } from "@/site/content";
import { Website } from "@/components/website";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
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
  const path = `${route}${route ? "/" : ""}`;
  const product = products.find((p) => route === productPath(p) || route === `collections/${p.slug}`);
  const idea = playIdeas.find((item) => route === `play-ideas/${item.id}`);
  const relatedProduct = idea && idea.mode !== "mix" ? products.find((item) => item.id === idea.productIds[0]) : undefined;
  const image = product?.shareImages?.[locale] || product?.image || relatedProduct?.shareImages?.[locale] || relatedProduct?.image || "/assets/hero.webp";
  const title = route ? `${page.title} | BIJOYISM` : page.title;
  return {
    title, description: page.description,
    alternates: { canonical: `/${locale}/${path}`, languages: { en: `/en/${path}`, "zh-CN": `/zh/${path}`, "x-default": `/en/${path}` } },
    openGraph: { title, description: page.description, url: `/${locale}/${path}`, type: idea ? "article" : "website", images: [image] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image] },
  };
}
export default async function Page(props: Props) {
  const { locale, route, search } = await context(props);
  const page = pageInfo(locale, route, search);
  const url = `https://bijoyism.cc/${locale}/${route}${route ? "/" : ""}`;
  const organization = { "@type": "Organization", "@id": "https://bijoyism.cc/#organization", name: "BIJOYISM", url: "https://bijoyism.cc", email: "support@bijoyism.cc", logo: "https://bijoyism.cc/assets/logo-red-v01.svg" };
  const graph: Record<string, unknown>[] = [organization, { "@type": "WebSite", "@id": "https://bijoyism.cc/#website", name: "BIJOYISM", url: "https://bijoyism.cc", publisher: { "@id": organization["@id"] } }, { "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: locale === "zh" ? "zh-CN" : "en" }];
  if (route) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "zh" ? "首页" : "Home", item: `https://bijoyism.cc/${locale}/` }, { "@type": "ListItem", position: 2, name: page.title, item: url }] });
  const product = products.find((p) => route === productPath(p));
  if (product) graph.push({ "@type": "Product", name: `BIJOYISM ${product.name[locale]}`, sku: product.id.toUpperCase(), url, description: page.description, image: `https://bijoyism.cc${product.image}`, brand: { "@type": "Brand", name: "BIJOYISM" }, material: "PVC / TPE", additionalProperty: [{ "@type": "PropertyValue", name: "Tiles per set", value: product.pieceCount }, { "@type": "PropertyValue", name: "Recommended age", value: `${product.ageMin}+` }] });
  const idea = playIdeas.find((item) => route === `play-ideas/${item.id}`);
  if (idea) graph.push({ "@type": "Article", headline: page.title, description: page.description, author: { "@id": organization["@id"] }, publisher: { "@id": organization["@id"] }, mainEntityOfPage: `${url}#webpage` });
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\u003c") }} />
    <Website html={pageHtml(locale, route, search)} locale={locale} route={route} />
  </>;
}
