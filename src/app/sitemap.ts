import type { MetadataRoute } from "next";
import { routes } from "@/site/content";
import { routing } from "@/i18n/routing";
import { sitemapEntries } from "@/site/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap(locale => sitemapEntries(locale, routes));
}
