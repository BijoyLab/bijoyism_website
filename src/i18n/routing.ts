import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});
export type Locale = (typeof routing.locales)[number];
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
};
