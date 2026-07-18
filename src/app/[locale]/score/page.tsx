import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "score" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ScorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("score");

  const factors = [
    { title: t("factors.qualityTitle"), body: t("factors.qualityBody") },
    { title: t("factors.valueTitle"), body: t("factors.valueBody") },
    { title: t("factors.fitTitle"), body: t("factors.fitBody") },
    { title: t("factors.trustTitle"), body: t("factors.trustBody") },
  ];

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

      <FadeIn delay={0.08} className="mt-10 rounded-2xl border border-accent/20 bg-accent-soft p-5 sm:p-6">
        <p className="leading-relaxed text-foreground/90">{t("editorial")}</p>
      </FadeIn>

      <FadeIn delay={0.12} as="section" className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("scaleTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{t("scaleBody")}</p>
      </FadeIn>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {factors.map((factor, index) => (
          <FadeIn key={factor.title} delay={0.14 + index * 0.05}>
            <div className="h-full rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold text-foreground">{factor.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{factor.body}</p>
            </div>
          </FadeIn>
        ))}
      </section>

      <FadeIn delay={0.3} as="section" className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("notTitle")}
        </h2>
        <ul className="mt-3 space-y-2 text-foreground/90">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t("notVotes")}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t("notBenchmark")}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t("notGuarantee")}
          </li>
        </ul>
      </FadeIn>

      <FadeIn delay={0.36} className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/models"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06130a] transition-colors hover:bg-accent-dim"
        >
          {t("browseModels")}
        </Link>
        <Link
          href="/compare"
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/40"
        >
          {t("compare")}
        </Link>
      </FadeIn>
    </div>
  );
}
