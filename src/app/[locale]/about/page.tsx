import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title") };
}
export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("About");
  return (
    <section className="mx-auto min-h-[60dvh] max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="mb-5 text-sm font-bold tracking-widest text-primary">BIJOYISM</p>
      <h1 className="text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-relaxed opacity-75">{t("description")}</p>
      <Link href="/" className="btn btn-primary mt-8">{t("back")}</Link>
    </section>
  );
}
