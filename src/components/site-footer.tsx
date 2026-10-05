import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© BIJOYISM. {t("rights")}</p>
        <Link href="/about" className="link link-hover">{t("about")}</Link>
      </div>
    </footer>
  );
}
