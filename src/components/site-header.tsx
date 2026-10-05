"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [{ href: "/", label: t("home") }, { href: "/about", label: t("about") }];
  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex-1 text-xl font-black tracking-widest" onClick={() => setOpen(false)}>BIJOYISM</Link>
        <nav aria-label={t("main")} className="hidden md:block">
          <ul className="menu menu-horizontal gap-2">
            {links.map(({ href, label }) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link></li>)}
          </ul>
        </nav>
        <Suspense fallback={<span className="loading loading-spinner loading-sm" />}><LanguageSwitcher /></Suspense>
        <button type="button" className="btn btn-ghost px-3 md:hidden" aria-label={t(open ? "closeMenu" : "openMenu")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav id="mobile-navigation" aria-label={t("main")} hidden={!open} className="w-full md:hidden">
          <ul className="menu w-full p-0 pb-3">
            {links.map(({ href, label }) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link></li>)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
