import type { Metadata } from 'next';
import { siteConfig } from './site-config';

type SeoInfo = {
 title: string;
 description: string;
 image: string;
 url: string;
 languages: Record<string, string>;
};

// One framework adapter for the shared route metadata and JSON-LD source.
export function pageMetadata(info: SeoInfo, locale: 'en' | 'zh', article: boolean): Metadata {
 const image = new URL(info.image, siteConfig.origin).href;
 return {
  title: info.title,
  description: info.description,
  robots: { index: true, follow: true },
  alternates: { canonical: info.url, languages: info.languages },
  openGraph: {
   title: info.title, description: info.description, url: info.url,
   siteName: 'BIJOYISM', type: article ? 'article' : 'website',
   locale: locale === 'zh' ? 'zh_CN' : 'en_US',
   alternateLocale: [locale === 'zh' ? 'en_US' : 'zh_CN'],
   images: [image],
  },
  twitter: { card: 'summary_large_image', title: info.title, description: info.description, images: [image] },
 };
}
