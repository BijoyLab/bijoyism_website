import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bijoyism.cc"),
  robots: { index: false, follow: false },
  icons: { icon: "/assets/favicon.svg" },
};

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <html lang={locale === "zh" ? "zh-CN" : locale} data-theme="light">
      <body>
        <a className="skip" href="#main">{locale === "zh" ? "跳至正文" : "Skip to content"}</a>
        {children}
        <dialog id="modal" aria-labelledby="modal-title">
          <button className="close" aria-label={locale === "zh" ? "关闭" : "Close"}>×</button>
          <div id="modal-content" />
        </dialog>
      </body>
    </html>
  );
}
