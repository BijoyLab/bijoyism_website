import type { MetadataRoute } from "next";
import { routes } from "@/site/content";
import { headers } from "next/headers";
import { hostLocale } from "@/site/site-config";
import { sitemapEntries } from "@/site/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host');
  return sitemapEntries(hostLocale(host), routes);
}
