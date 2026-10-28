import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { playRedirects } from "./site/play-content";
import { routeAliases } from "./site/seo";
import { hostLocale, siteConfig } from "./site/site-config";
import { httpsRedirectUrl } from "./site/transport";

const internationalize = createMiddleware(routing);
const oldInfo: Record<string, string> = routeAliases;
export default function proxy(request: NextRequest) {
  const secureUrl = httpsRedirectUrl(request.nextUrl, request.headers);
  if (secureUrl) return NextResponse.redirect(secureUrl, 308);
  const host = request.headers.get('host')?.split(':')[0].toLowerCase() || '';
  if (host === 'www.bijoyism.cc' || host === 'www.bijoyism.cn' || host === 'bijoyism.cn') {
    const url = request.nextUrl.clone();
    url.host = 'bijoyism.cc'; url.port = ''; url.protocol = 'https:';
    if (host.endsWith('bijoyism.cn') && url.pathname === '/') url.pathname = '/zh/';
    // The .cn fallback is temporary; it only works once a request reaches this app.
    const response = NextResponse.redirect(url, 308);
    response.headers.set('Cache-Control', 'public, max-age=3600');
    return response;
  }
  if (request.nextUrl.pathname === '/' && /^bijoyism\.(cn|cc)$/.test(host)) {
    const country = request.headers.get('cf-ipcountry');
    const preferred = request.cookies.get('NEXT_LOCALE')?.value;
    const marketLocale = country === 'CN' ? 'zh' : country && country !== 'XX' ? 'en' : hostLocale(host);
    const locale = preferred === 'en' || preferred === 'zh' ? preferred : marketLocale;
    const url = new URL(`/${locale}/`, siteConfig.origins[marketLocale]);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  // Transport enforcement also covers XML, assets and APIs, but these paths
  // must not be rewritten by locale routing after the HTTPS check.
  if (/^\/(?:api|trpc|_next|_vercel)(?:\/|$)/.test(request.nextUrl.pathname) || request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = segments[0];
  if (locale === "zh-cn") {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.replace(/^\/zh-cn(?=\/|$)/, "/zh");
    return NextResponse.redirect(url, 308);
  }
  if (routing.locales.some((item) => item === locale)) {
    const route = segments.slice(1).join("/");
    const oldGame = route.startsWith("play-ideas/") ? route.slice("play-ideas/".length) : "";
    const gameTarget = (playRedirects as Record<string, string>)[oldGame];
    const target = oldInfo[route] || (gameTarget ? `play-ideas/${gameTarget}` : undefined);
    if (target) {
      const url = request.nextUrl.clone();
      const [path, hash] = target.split("#");
      url.pathname = `/${locale}/${path}/`;
      if (hash) url.hash = hash;
      return NextResponse.redirect(url, 301);
    }
  }
  const response = internationalize(request);
  // HTML carries canonical hreflang; keep proxy defaults from conflicting with it.
  response.headers.delete('link');
  return response;
}
export const config = { matcher: "/:path*" };
