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
import {
  getLearnArticleContent,
  learnArticles,
} from "@/data/learn-articles";
import type { Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LearnIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations("learn");

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

      <div className="mt-10 space-y-4">
        {learnArticles.map((article, index) => {
          const content = getLearnArticleContent(article, typedLocale);
          return (
            <FadeIn key={article.slug} delay={0.04 * index}>
              <Card>
                <CardHeader className="p-5 pb-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {t(`levels.${article.level}`)}
                    </Badge>
                    {article.leverages ? (
                      <Badge variant="secondary" className="text-[11px]">
                        {t("leveragesBadge")}
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="mt-2 text-lg">
                    <Link
                      href={`/learn/${article.slug}`}
                      className="hover:text-accent"
                    >
                      {content.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{content.summary}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/learn/${article.slug}`}>{t("read")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2} className="mt-10 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/guide">{t("guideLink")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/apply">{t("applyLink")}</Link>
        </Button>
      </FadeIn>
    </div>
  );
}
