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
import { applyRecipes, getApplyRecipeContent } from "@/data/apply-recipes";
import { getModelBySlug } from "@/data/models";
import { getSkillContent, skillEntries } from "@/data/skills";
import type { Locale } from "@/data/types";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations("apply");

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

      <FadeIn delay={0.06} as="section" className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">{t("skillsTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("skillsSubtitle")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {skillEntries.map((skill) => {
            const content = getSkillContent(skill, typedLocale);
            return (
              <Card key={skill.id} className="h-full">
                <CardHeader className="p-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {t(`skillKinds.${skill.kind}`)}
                    </Badge>
                    <Badge variant="secondary" className="text-[11px]">
                      {t(`audiences.${skill.audience}`)}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-base">{content.title}</CardTitle>
                  <CardDescription>{content.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <p className="text-xs text-muted">{content.when}</p>
                  {"install" in content && content.install ? (
                    <p className="text-xs text-foreground/80">{content.install}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={skill.href}>{t("openSkill")}</Link>
                    </Button>
                    {skill.installUrl ? (
                      <Button asChild size="sm" variant="ghost">
                        <a
                          href={skill.installUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("installSkill")}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{t("recipesTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("recipesSubtitle")}</p>
      </FadeIn>

      <div className="mt-6 space-y-5">
        {applyRecipes.map((recipe, index) => {
          const content = getApplyRecipeContent(recipe, typedLocale);
          const models = recipe.modelSlugs
            .map((slug) => getModelBySlug(slug))
            .filter((model): model is NonNullable<typeof model> => Boolean(model));

          return (
            <FadeIn key={recipe.id} delay={0.04 * index}>
              <Card>
                <CardHeader className="p-5 pb-2">
                  <Badge variant="outline" className="w-fit text-[11px]">
                    {t(`audiences.${recipe.audience}`)}
                  </Badge>
                  <CardTitle className="mt-2 text-lg">{content.title}</CardTitle>
                  <CardDescription>{content.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-2">
                  <ol className="space-y-2 text-sm text-foreground/90">
                    {content.steps.map((step) => (
                      <li key={step} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm text-muted">{content.tip}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    {models.map((model) => (
                      <Link
                        key={model.slug}
                        href={`/models/${model.slug}`}
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        {model.name}
                      </Link>
                    ))}
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={recipe.catalogHref}>{t("openCatalog")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2} className="mt-10 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/recommend">{t("recommendLink")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/guide">{t("guideLink")}</Link>
        </Button>
      </FadeIn>
    </div>
  );
}
