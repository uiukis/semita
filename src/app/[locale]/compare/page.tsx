import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompareSelector } from "@/components/compare-selector";
import { FadeIn, ScaleIn } from "@/components/motion";
import { ShareCompareButton } from "@/components/share-compare-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Card className="border-dashed bg-transparent">
            <CardContent className="p-10 text-center text-muted">
              {t("empty")}
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <ScaleIn>
          <>
            <div className="grid gap-4 md:hidden">
              {selected.map((model) => (
                <Card key={model.slug}>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle>
                      <Link
                        href={`/models/${model.slug}`}
                        className="underline-offset-4 hover:text-accent hover:underline"
                      >
                        {model.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <dl className="space-y-2 text-sm">
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
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="hidden md:block">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>{t("attribute")}</TableHead>
                    {selected.map((model) => (
                      <TableHead key={model.slug} className="text-foreground">
                        <Link
                          href={`/models/${model.slug}`}
                          className="font-semibold underline-offset-4 transition-colors hover:text-accent hover:underline"
                        >
                          {model.name}
                        </Link>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium text-muted">
                        {row.label}
                      </TableCell>
                      {selected.map((model) => (
                        <TableCell key={model.slug}>
                          {row.render(model)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        </ScaleIn>
      )}
    </div>
  );
}
