import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { playRedirects } from "./site/play-content";

const internationalize = createMiddleware(routing);
const oldInfo: Record<string, string> = {
  "our-products": "products", "our-products/care": "products#care",
  "our-products/testing": "products#testing", "our-products/liquid-sensory-tiles": "products#product-facts",
};
export default function proxy(request: NextRequest) {
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
  return internationalize(request);
}
export const config = { matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)" };
