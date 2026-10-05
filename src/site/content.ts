import products from "./data/products.json";
import channels from "./data/purchase-channels.json";
import { playIdeas } from "./play-content";
import { getRoutes, renderPage, productPath } from "./pages";
import { renderSite } from "./site-render";
import { copy } from "./copy";

export { products, channels, playIdeas, productPath };
export const routes: string[] = getRoutes(products, playIdeas);
export type SiteLocale = "en" | "zh";
export function pageInfo(locale: SiteLocale, route: string, search = "") {
  return route
    ? renderPage({ lang: locale, route, products, channels, ideas: playIdeas, search })
    : { title: `BIJOYISM — ${copy[locale].footer}`, description: copy[locale].intro };
}
export function pageHtml(locale: SiteLocale, route: string, search = "") {
  return renderSite({ lang: locale, route, products, channels, ideas: playIdeas, search });
}
