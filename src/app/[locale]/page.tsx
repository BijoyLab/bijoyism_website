import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-6 text-sm font-bold tracking-[0.2em] text-primary">BIJOYISM</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-75">{t("description")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-primary">{t("cta")}</Link>
            <a href="#explore" className="btn btn-outline">{t("explore")}</a>
          </div>
        </div>
        <div className="card min-h-72 justify-center bg-base-200 p-8 sm:min-h-96 sm:p-12">
          <span className="badge badge-outline mb-8">{t("previewLabel")}</span>
          <p className="text-3xl font-medium leading-snug sm:text-4xl">{t("previewTitle")}</p>
          <p className="mt-4 max-w-sm leading-relaxed opacity-70">{t("previewDescription")}</p>
        </div>
      </section>
      <section id="explore" className="scroll-mt-8 pt-16 lg:pt-24" aria-labelledby="explore-title">
        <h2 id="explore-title" className="text-2xl font-semibold sm:text-3xl">{t("sectionTitle")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(["discover", "inspire", "connect"] as const).map((key, index) => (
            <article key={key} className="card border border-base-300 bg-base-100">
              <div className="card-body p-6 sm:p-8">
                <span className="mb-4 text-sm font-semibold text-primary">0{index + 1}</span>
                <h3 className="card-title text-xl">{t(`${key}.title`)}</h3>
                <p className="mt-2 leading-relaxed opacity-70">{t(`${key}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
