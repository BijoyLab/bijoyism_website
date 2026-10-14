import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { hostLocale, siteConfig } from "@/site/site-config";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = hostLocale((await headers()).get('host'));
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: `${siteConfig.origins[locale]}/sitemap.xml`,
  };
}
