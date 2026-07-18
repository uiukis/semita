import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompareSelector } from "@/components/compare-selector";
import { FadeIn, ScaleIn } from "@/components/motion";
import { ShareCompareButton } from "@/components/share-compare-button";
import { getAllModels, getModelBySlug } from "@/data/models";
import type { LlmModel, Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { formatContextWindow, formatUsdPerMillion } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return { title: t("title"), description: t("subtitle") };
}

type SearchParams = Promise<{ models?: string }>;

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compare");
  const tu = await getTranslations("useCases");
  const typedLocale = locale as Locale;

  const { models: modelsParam } = await searchParams;
  const allModels = getAllModels();

  const selected = (modelsParam ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .map((slug) => getModelBySlug(slug))
    .filter((model): model is LlmModel => Boolean(model));

  const rows: { label: string; render: (model: LlmModel) => string }[] = [
    { label: t("provider"), render: (m) => m.provider },
    {
      label: t("input"),
      render: (m) => formatUsdPerMillion(m.pricing.inputPerMillion, typedLocale),
    },
    {
      label: t("output"),
      render: (m) =>
        formatUsdPerMillion(m.pricing.outputPerMillion, typedLocale),
    },
    {
      label: t("context"),
      render: (m) => formatContextWindow(m.contextWindow, typedLocale),
    },
    {
      label: t("maxOutput"),
      render: (m) => formatContextWindow(m.maxOutputTokens, typedLocale),
    },
    {
      label: t("useCases"),
      render: (m) => m.useCases.map((u) => tu(u)).join(", "),
    },
    {
      label: t("community"),
      render: (m) => `${m.communityScore.toFixed(1)} ★`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn
        as="header"
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{t("subtitle")}</p>
        </div>
        {selected.length > 0 ? <ShareCompareButton /> : null}
      </FadeIn>

      <FadeIn delay={0.08} className="mb-8">
        <Suspense fallback={null}>
          <CompareSelector
            options={allModels.map((model) => ({
              slug: model.slug,
              name: model.name,
              provider: model.provider,
            }))}
          />
        </Suspense>
      </FadeIn>

      {selected.length === 0 ? (
        <FadeIn>
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            {t("empty")}
          </p>
        </FadeIn>
      ) : (
        <ScaleIn>
          <>
            <div className="grid gap-4 md:hidden">
              {selected.map((model) => (
                <div
                  key={model.slug}
                  className="rounded-2xl border border-line bg-surface p-4"
                >
                  <Link
                    href={`/models/${model.slug}`}
                    className="text-base font-semibold underline-offset-4 hover:text-accent hover:underline"
                  >
                    {model.name}
                  </Link>
                  <dl className="mt-3 space-y-2 text-sm">
                    {rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-3 border-b border-line/40 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-muted">{row.label}</dt>
                        <dd className="text-right font-medium">
                          {row.render(model)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface md:block">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="p-4 text-left font-medium text-muted">
                      {t("attribute")}
                    </th>
                    {selected.map((model) => (
                      <th key={model.slug} className="p-4 text-left">
                        <Link
                          href={`/models/${model.slug}`}
                          className="font-semibold underline-offset-4 transition-colors hover:text-accent hover:underline"
                        >
                          {model.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-line/50 transition-colors last:border-0 hover:bg-surface-raised"
                    >
                      <td className="p-4 font-medium text-muted">
                        {row.label}
                      </td>
                      {selected.map((model) => (
                        <td key={model.slug} className="p-4">
                          {row.render(model)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </ScaleIn>
      )}
    </div>
  );
}
