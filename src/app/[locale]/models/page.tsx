import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilterBar } from "@/components/filter-bar";
import { ModelCard } from "@/components/model-card";
import { FadeIn, Stagger } from "@/components/motion";
import { getAllModels, getProviders, getUseCases } from "@/data/models";
import type { LlmModel, Locale, ModelProvider, UseCase } from "@/data/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "models" });
  return { title: t("title"), description: t("subtitle") };
}

type SearchParams = Promise<{
  provider?: string;
  use?: string;
  sort?: string;
  q?: string;
}>;

function sortModels(items: LlmModel[], sort: string): LlmModel[] {
  const sorted = [...items];
  if (sort === "cheapest") {
    return sorted.sort(
      (a, b) => a.pricing.inputPerMillion - b.pricing.inputPerMillion,
    );
  }
  if (sort === "context") {
    return sorted.sort((a, b) => b.contextWindow - a.contextWindow);
  }
  return sorted.sort((a, b) => b.communityScore - a.communityScore);
}

export default async function ModelsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("models");
  const { provider, use, sort, q } = await searchParams;

  let filtered = getAllModels();
  if (provider) {
    filtered = filtered.filter(
      (model) => model.provider === (provider as ModelProvider),
    );
  }
  if (use) {
    filtered = filtered.filter((model) =>
      model.useCases.includes(use as UseCase),
    );
  }
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    filtered = filtered.filter((model) => {
      const content = model.content[locale as Locale] ?? model.content.en;
      return (
        model.name.toLowerCase().includes(needle) ||
        model.provider.toLowerCase().includes(needle) ||
        model.slug.toLowerCase().includes(needle) ||
        content.summary.toLowerCase().includes(needle)
      );
    });
  }
  filtered = sortModels(filtered, sort ?? "recommended");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn as="header" className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{t("subtitle")}</p>
      </FadeIn>

      <FadeIn delay={0.08} className="mb-8">
        <Suspense fallback={null}>
          <FilterBar providers={getProviders()} useCases={getUseCases()} />
        </Suspense>
      </FadeIn>

      {filtered.length === 0 ? (
        <FadeIn>
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            {t("empty")}
          </p>
        </FadeIn>
      ) : (
        <Stagger
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {filtered.map((model) => (
            <ModelCard
              key={model.slug}
              model={model}
              locale={locale as Locale}
            />
          ))}
        </Stagger>
      )}
    </div>
  );
}
