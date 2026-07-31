import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn, ScaleIn } from "@/components/motion";
import { MotionLink } from "@/components/motion-link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllModels, getModelBySlug, getModelContent } from "@/data/models";
import type { Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  formatContextWindow,
  formatDate,
  formatUsdPerMillion,
} from "@/lib/format";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllModels().map((model) => ({ locale, slug: model.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) {
    const t = await getTranslations({ locale, namespace: "model" });
    return { title: t("notFound") };
  }
  return {
    title: model.name,
    description: getModelContent(model, locale as Locale).summary,
  };
}

export default async function ModelDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const model = getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const t = await getTranslations("model");
  const tu = await getTranslations("useCases");
  const tm = await getTranslations("modalities");
  const td = await getTranslations("deployment");
  const th = await getTranslations("hardware");
  const tr = await getTranslations("runtimes");
  const typedLocale = locale as Locale;
  const content = getModelContent(model, typedLocale);
  const local = model.local;

  const stats = [
    {
      label: t("input"),
      value: formatUsdPerMillion(model.pricing.inputPerMillion, typedLocale),
    },
    {
      label: t("output"),
      value: formatUsdPerMillion(model.pricing.outputPerMillion, typedLocale),
    },
    {
      label: t("context"),
      value: formatContextWindow(model.contextWindow, typedLocale),
    },
    {
      label: t("maxOutput"),
      value: formatContextWindow(model.maxOutputTokens, typedLocale),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <Link
          href="/models"
          className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {t("back")}
        </Link>
      </FadeIn>

      <FadeIn
        as="header"
        delay={0.05}
        className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {model.name}
          </h1>
          <p className="mt-1 text-muted">
            {t("releasedOn", {
              provider: model.provider,
              date: formatDate(model.releaseDate, typedLocale),
            })}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Badge className="px-3.5 py-1.5 text-sm font-semibold">
            {t("community", { score: model.communityScore.toFixed(1) })}
          </Badge>
          <div className="flex items-center gap-3">
            <Link
              href="/score"
              className="text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {t("scoreLink")}
            </Link>
            <MotionLink
              href={`/compare?models=${model.slug}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {t("compare")}
            </MotionLink>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-6 text-lg leading-relaxed text-foreground/90">
          {content.summary}
        </p>
      </FadeIn>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((item, index) => (
          <ScaleIn key={item.label} delay={0.12 + index * 0.05}>
            <Card className="transition-colors hover:border-accent/40">
              <CardContent className="p-4">
                <div className="text-xs text-muted">{item.label}</div>
                <div className="mt-1 text-base font-semibold sm:text-lg">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          </ScaleIn>
        ))}
      </section>

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <FadeIn delay={0.16}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("goodFor")}
          </h2>
          <p className="mt-2 leading-relaxed text-foreground/90">
            {content.goodFor}
          </p>
        </FadeIn>
        <FadeIn delay={0.22}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("strengths")}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {content.strengths.map((strength) => (
              <li key={strength} className="flex gap-2 text-foreground/90">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {strength}
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      <FadeIn delay={0.2} as="section" className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("modalities")}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {model.modalities.map((modality) => (
              <Badge key={modality} variant="outline" className="px-2.5 py-1 text-sm">
                {tm(modality)}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("useCases")}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {model.useCases.map((useCase) => (
              <Badge key={useCase} variant="outline" className="px-2.5 py-1 text-sm">
                {tu(useCase)}
              </Badge>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.24} as="section" className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("benchmarks")}
        </h2>
        <ul className="mt-2 space-y-2">
          {model.benchmarks.map((benchmark) => (
            <li key={benchmark.name}>
              <Card className="transition-colors hover:border-accent/40">
                <CardContent className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <span className="font-medium">{benchmark.name}</span>
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-sm">{benchmark.score}</span>
                    <a
                      href={benchmark.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                    >
                      {t("source")}
                    </a>
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </FadeIn>

      {local ? (
        <FadeIn delay={0.26} as="section" className="mt-10">
          <Card>
            <CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t("localTitle")}
                </CardTitle>
                <Badge className="text-[11px]">{td(model.deployment)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-muted">
                {local.tips[typedLocale] ?? local.tips.en}
              </p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted">{t("params")}</dt>
                  <dd className="font-medium">{local.parameterCount}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{t("quant")}</dt>
                  <dd className="font-medium">{local.quantization}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{t("runtimes")}</dt>
                  <dd className="font-medium">
                    {local.runtimes.map((runtime) => tr(runtime)).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">{t("ollamaTag")}</dt>
                  <dd className="font-mono text-sm">
                    {local.ollamaTag ?? "—"}
                  </dd>
                </div>
              </dl>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
                {t("hardwareGuides")}
              </h3>
              <ul className="mt-3 space-y-3">
                {local.hardware.map((guide) => (
                  <li
                    key={`${guide.platform}-${guide.tier}-${guide.exampleDevices[0]}`}
                    className="rounded-xl border border-line bg-background/40 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold">
                        {th(`platforms.${guide.platform}`)}
                      </span>
                      <Badge variant="outline" className="text-[11px]">
                        {th(`tiers.${guide.tier}`)}
                      </Badge>
                      {guide.minVramGb != null ? (
                        <span className="text-xs text-muted">
                          {t("minVram", { gb: guide.minVramGb })}
                        </span>
                      ) : null}
                      {guide.minUnifiedMemoryGb != null ? (
                        <span className="text-xs text-muted">
                          {t("minUnified", { gb: guide.minUnifiedMemoryGb })}
                        </span>
                      ) : null}
                      <span className="text-xs text-muted">
                        {t("minRam", { gb: guide.minRamGb })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/90">
                      {guide.exampleDevices.join(" · ")}
                    </p>
                    {guide.notes ? (
                      <p className="mt-1 text-xs text-muted">
                        {guide.notes[typedLocale] ?? guide.notes.en}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              <a
                href={local.weightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm text-accent underline-offset-4 hover:underline"
              >
                {t("weightsLink")}
              </a>
            </CardContent>
          </Card>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.28} as="section" className="mt-10">
        <Card className="border-accent/20 bg-accent-soft">
          <CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t("communityTake")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 leading-relaxed text-foreground/90 sm:p-6">
            {content.communityNotes}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.32} as="section" className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("sources")}
        </h2>
        <ul className="mt-2 space-y-1.5">
          {model.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
              >
                {source.kind === "pricing"
                  ? t("pricingSource", { provider: model.provider })
                  : source.kind === "weights"
                    ? t("weightsSource", { provider: model.provider })
                    : t("docsSource", { provider: model.provider })}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          {t("lastUpdated", {
            date: formatDate(model.lastUpdated, typedLocale),
          })}
        </p>
        <p className="mt-2 text-xs text-muted">{t("localDisclaimer")}</p>
      </FadeIn>
    </div>
  );
}
