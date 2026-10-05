"use client";

import { useEffect, useRef } from "react";
import { mountSite } from "@/site/interactions";

// The source renderer is shared by server HTML and browser filters. The browser
// owns only this container; global event listeners are removed on unmount.
export function Website({ html, locale, route }: { html: string; locale: string; route: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountSite(ref.current, { lang: locale, route });
  }, [locale, route, html]);
  return <div id="app" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
