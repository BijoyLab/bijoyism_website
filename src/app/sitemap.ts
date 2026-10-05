import type { MetadataRoute } from "next";
import { routes } from "@/site/content";
import { routing } from "@/i18n/routing";
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => routes.map((route) => ({ url: `https://bijoyism.cc/${locale}/${route}${route ? "/" : ""}` })));
}
