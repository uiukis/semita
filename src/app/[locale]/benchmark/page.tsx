import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { ScoreBar } from "@/components/score-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

      <FadeIn delay={0.08} className="mt-8">
        <Card className="border-accent/20 bg-accent-soft">
          <CardContent className="p-5 sm:p-6">
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
          </CardContent>
        </Card>
      </FadeIn>

      {!run ? (
        <FadeIn delay={0.12} className="mt-10">
          <Card className="border-dashed">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
              <CardTitle className="text-xl">{t("pendingTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="leading-relaxed text-muted">{t("pendingBody")}</p>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-foreground/90">
                <li>{t("pendingStep1")}</li>
                <li>{t("pendingStep2")}</li>
                <li>{t("pendingStep3")}</li>
              </ol>
            </CardContent>
          </Card>
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
                <Card className="h-full">
                  <CardHeader className="p-5 pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted">
                          #{index + 1} · {model.provider}
                        </p>
                        <CardTitle className="mt-1 text-lg">
                          {model.modelName}
                        </CardTitle>
                      </div>
                      <Badge>
                        {(model.qualityOverall * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-5">
                    <ScoreBar
                      value={model.qualityOverall}
                      label={t("metricQuality")}
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
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.16} as="section" className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">{t("byCategory")}</h2>
            <Card>
              <Table className="min-w-[40rem]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">
                      {t("model")}
                    </TableHead>
                    {categories.map((category) => (
                      <TableHead
                        key={category}
                        className="px-2 text-xs uppercase tracking-wider"
                      >
                        {t(`categories.${category}`)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranked.map((model) => (
                    <TableRow key={model.catalogSlug}>
                      <TableCell className="font-medium">
                        {model.modelName}
                      </TableCell>
                      {categories.map((category) => (
                        <TableCell
                          key={category}
                          className="px-2 font-mono text-muted"
                        >
                          {(model.qualityByCategory[category] * 100).toFixed(0)}
                          %
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </FadeIn>
        </>
      )}

      <FadeIn delay={0.18} as="section" className="mt-12">
        <h2 className="text-xl font-semibold">{t("tasksTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("tasksSubtitle")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="p-4 pb-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {t(`categories.${task.category}`)}
                </p>
                <CardTitle className="mt-1 text-base font-medium">
                  {task.title[typedLocale] ?? task.title.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="line-clamp-4 text-xs leading-relaxed text-muted">
                  {task.prompt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.22} as="section" className="mt-12">
        <h2 className="text-xl font-semibold">{t("modelsTitle")}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {config.models.map((model) => (
            <li key={model.catalogSlug}>
              <Card>
                <CardContent className="px-4 py-3 text-sm">
                  <Link
                    href={`/models/${model.catalogSlug}`}
                    className="font-medium transition-colors hover:text-accent"
                  >
                    {model.catalogSlug}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {model.gatewayModelId}
                  </p>
                </CardContent>
              </Card>
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
