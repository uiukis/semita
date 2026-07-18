import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { ScoreBar } from "@/components/score-bar";
import {
  getBenchmarkConfig,
  getBenchmarkTasks,
  getLatestBenchmarkRun,
} from "@/data/benchmark";
import type { TaskCategory } from "@/data/benchmark/types";
import type { Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "benchmark" });
  return { title: t("title"), description: t("subtitle") };
}

function formatMs(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUsd(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "pt-br" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value);
}

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("benchmark");
  const typedLocale = locale as Locale;
  const tasks = getBenchmarkTasks();
  const config = getBenchmarkConfig();
  const run = getLatestBenchmarkRun();

  const categories: TaskCategory[] = [
    "coding",
    "reasoning",
    "extraction",
    "writing",
    "pt-br",
  ];

  const ranked = run
    ? [...run.models].sort((a, b) => b.qualityOverall - a.qualityOverall)
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8 rounded-2xl border border-accent/20 bg-accent-soft p-5 sm:p-6">
        <p className="leading-relaxed text-foreground/90">{t("honesty")}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/uiukis/semita/blob/main/docs/benchmark-methodology.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {t("methodologyLink")}
          </a>
          <Link
            href="/score"
            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {t("scoreLink")}
          </Link>
        </div>
      </FadeIn>

      {!run ? (
        <FadeIn delay={0.12} className="mt-10 rounded-2xl border border-dashed border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold">{t("pendingTitle")}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t("pendingBody")}</p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-foreground/90">
            <li>{t("pendingStep1")}</li>
            <li>{t("pendingStep2")}</li>
            <li>{t("pendingStep3")}</li>
          </ol>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.12} className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{t("resultsTitle")}</h2>
                <p className="mt-1 text-sm text-muted">
                  {t("resultsMeta", {
                    runId: run.runId,
                    date: run.publishedAt
                      ? new Intl.DateTimeFormat(
                          locale === "pt-br" ? "pt-BR" : "en-US",
                          { dateStyle: "medium" },
                        ).format(new Date(run.publishedAt))
                      : "—",
                  })}
                </p>
              </div>
            </div>
          </FadeIn>

          <Stagger className="mt-6 grid gap-4 lg:grid-cols-3" stagger={0.06}>
            {ranked.map((model, index) => (
              <StaggerItem key={model.catalogSlug}>
                <div className="h-full rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">
                        #{index + 1} · {model.provider}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {model.modelName}
                      </h3>
                    </div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                      {(model.qualityOverall * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <ScoreBar
                      value={model.qualityOverall}
                      label={t("metricQuality")}
                      delay={0.05}
                    />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted">{t("metricLatency")}</p>
                        <p className="font-medium">
                          {formatMs(model.latencyMsMedian, locale)} ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">{t("metricCost")}</p>
                        <p className="font-medium">
                          {formatUsd(model.totalEstimatedCostUsd, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.16} as="section" className="mt-10 overflow-x-auto">
            <h2 className="mb-4 text-xl font-semibold">{t("byCategory")}</h2>
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th className="py-3 pr-4 font-medium">{t("model")}</th>
                  {categories.map((category) => (
                    <th key={category} className="px-2 py-3 font-medium">
                      {t(`categories.${category}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map((model) => (
                  <tr key={model.catalogSlug} className="border-b border-line/70">
                    <td className="py-3 pr-4 font-medium">{model.modelName}</td>
                    {categories.map((category) => (
                      <td key={category} className="px-2 py-3 font-mono text-muted">
                        {(model.qualityByCategory[category] * 100).toFixed(0)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </>
      )}

      <FadeIn delay={0.18} as="section" className="mt-12">
        <h2 className="text-xl font-semibold">{t("tasksTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("tasksSubtitle")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {t(`categories.${task.category}`)}
              </p>
              <h3 className="mt-1 font-medium">
                {task.title[typedLocale] ?? task.title.en}
              </h3>
              <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted">
                {task.prompt}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.22} as="section" className="mt-12">
        <h2 className="text-xl font-semibold">{t("modelsTitle")}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {config.models.map((model) => (
            <li
              key={model.catalogSlug}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-sm"
            >
              <Link
                href={`/models/${model.catalogSlug}`}
                className="font-medium transition-colors hover:text-accent"
              >
                {model.catalogSlug}
              </Link>
              <p className="mt-1 font-mono text-xs text-muted">
                {model.gatewayModelId}
              </p>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn delay={0.26} as="section" className="mt-12">
        <h2 className="text-xl font-semibold">{t("limitsTitle")}</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {config.limitations.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
