"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label={t("language")}
      className="select select-bordered w-auto max-w-36 text-sm"
      value={locale}
      disabled={pending}
      onChange={(event) => {
        const nextLocale = event.target.value as Locale;
        const query = searchParams.toString();
        const href = `${pathname}${query ? `?${query}` : ""}${window.location.hash}`;
        startTransition(() => router.replace(href, { locale: nextLocale }));
      }}
    >
      {routing.locales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}
    </select>
  );
}
