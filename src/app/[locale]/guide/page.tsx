import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const PERSONAS = [
  "student",
  "builder",
  "writer",
  "lead",
  "private",
] as const;

const LEVELS = [
  {
    id: "beginner",
    tips: ["tip1", "tip2", "tip3", "tip4", "tip5"] as const,
  },
  {
    id: "intermediate",
    tips: ["tip1", "tip2", "tip3", "tip4", "tip5"] as const,
  },
  {
    id: "advanced",
    tips: ["tip1", "tip2", "tip3", "tip4", "tip5"] as const,
  },
] as const;

const TOPICS = [
  "prompts",
  "context",
  "cloudLocal",
  "cost",
  "privacy",
  "eval",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");

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

      <FadeIn delay={0.06} className="mt-8">
        <nav
          aria-label={t("tocLabel")}
          className="flex flex-wrap gap-2 text-sm"
        >
          <a
            href="#for-whom"
            className="rounded-md border border-line bg-surface px-3 py-1.5 text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent"
          >
            {t("tocForWhom")}
          </a>
          <a
            href="#path"
            className="rounded-md border border-line bg-surface px-3 py-1.5 text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent"
          >
            {t("tocPath")}
          </a>
          <a
            href="#topics"
            className="rounded-md border border-line bg-surface px-3 py-1.5 text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent"
          >
            {t("tocTopics")}
          </a>
        </nav>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <Card className="border-accent/20 bg-accent-soft">
          <CardContent className="space-y-3 p-5 leading-relaxed text-foreground/90 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t("mindsetTitle")}
            </p>
            <p>{t("mindsetBody")}</p>
            <p className="text-sm text-muted">{t("mindsetBadge")}</p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.12} as="section" id="for-whom" className="mt-14 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">{t("forWhomTitle")}</h2>
        <p className="mt-2 text-muted">{t("forWhomSubtitle")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PERSONAS.map((persona, index) => (
            <FadeIn key={persona} delay={0.04 * index}>
              <Card className="h-full">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base">
                    {t(`personas.${persona}.title`)}
                  </CardTitle>
                  <p className="text-xs font-medium text-accent">
                    {t(`personas.${persona}.aim`)}
                  </p>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <CardDescription>
                    {t(`personas.${persona}.body`)}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <section id="path" className="mt-14 scroll-mt-24">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">{t("pathTitle")}</h2>
          <p className="mt-2 text-muted">{t("pathSubtitle")}</p>
        </FadeIn>

        <ol className="mt-8 space-y-10">
          {LEVELS.map((level, levelIndex) => (
            <FadeIn
              key={level.id}
              as="li"
              delay={0.06 * levelIndex}
              className="relative border-l border-line pl-5 sm:pl-6"
            >
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px]">
                  {t(`levels.${level.id}.badge`)}
                </Badge>
                <h3 className="text-lg font-semibold">
                  {t(`levels.${level.id}.title`)}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`levels.${level.id}.for`)}
              </p>
              <ul className="mt-4 space-y-2.5">
                {level.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-sm leading-relaxed text-foreground/90"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t(`levels.${level.id}.${tip}`)}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </ol>
      </section>

      <section id="topics" className="mt-14 scroll-mt-24">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("topicsTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("topicsSubtitle")}</p>
        </FadeIn>
        <div className="mt-6 space-y-4">
          {TOPICS.map((topic, index) => (
            <FadeIn key={topic} delay={0.04 * index}>
              <Card>
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base">
                    {t(`topics.${topic}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <CardDescription className="leading-relaxed">
                    {t(`topics.${topic}.body`)}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <FadeIn delay={0.08} as="section" className="mt-14">
        <Card className="border-accent/25 bg-accent-soft/40">
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-md">
              <h2 className="text-lg font-semibold">{t("nextTitle")}</h2>
              <p className="mt-2 text-sm text-muted">{t("nextBody")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/models">{t("browseModels")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/compare">{t("compare")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
