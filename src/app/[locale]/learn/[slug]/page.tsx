import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getLearnArticle,
  getLearnArticleContent,
  learnArticles,
} from "@/data/learn-articles";
import type { Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    learnArticles.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) {
    return { title: "Not found" };
  }
  const content = getLearnArticleContent(article, locale as Locale);
  return { title: content.title, description: content.summary };
}

export default async function LearnArticlePage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getLearnArticle(slug);
  if (!article) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = await getTranslations("learn");
  const content = getLearnArticleContent(article, typedLocale);

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn>
        <Link
          href="/learn"
          className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          {t("back")}
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-[11px]">
            {t(`levels.${article.level}`)}
          </Badge>
          {article.leverages ? (
            <Badge variant="secondary" className="text-[11px]">
              {t("leveragesBadge")}
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{content.summary}</p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </FadeIn>

      <FadeIn delay={0.12} className="mt-8 rounded-lg border border-accent/20 bg-accent-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("takeaway")}
        </p>
        <p className="mt-2 leading-relaxed">{content.takeaway}</p>
      </FadeIn>

      <FadeIn delay={0.16} className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link href={article.relatedHref}>{t("relatedCta")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/guide">{t("guideLink")}</Link>
        </Button>
      </FadeIn>
    </article>
  );
}
