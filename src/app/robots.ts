import type { MetadataRoute } from "next";
import { siteConfig } from "@/site/site-config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: `${siteConfig.origin}/sitemap.xml`,
  };
}
