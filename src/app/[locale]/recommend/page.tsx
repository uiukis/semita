import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { RecommendWizard } from "@/components/recommend-wizard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recommend" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RecommendPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("recommend");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-10">
        <RecommendWizard />
      </FadeIn>

      <FadeIn delay={0.12} className="mt-10 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/hardware">{t("hardwareLink")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/guide">{t("guideLink")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/models">{t("catalogLink")}</Link>
        </Button>
      </FadeIn>
    </div>
  );
}
