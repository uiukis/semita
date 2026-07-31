import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { SuggestModelForm } from "@/components/suggest-model-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suggest" });
  return { title: t("pageTitle"), description: t("subtitle") };
}

export default async function ContributePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("suggest");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {t("pageIntro")}
        </p>
      </FadeIn>
      <FadeIn delay={0.08} className="mt-8">
        <SuggestModelForm />
      </FadeIn>
    </div>
  );
}
