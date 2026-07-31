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
  hardwareRecipeHref,
  hardwareRecipes,
} from "@/data/hardware-recipes";
import { getModelBySlug } from "@/data/models";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hardwarePage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function HardwarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hardwarePage");
  const th = await getTranslations("hardware");

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

      <div className="mt-10 space-y-5">
        {hardwareRecipes.map((recipe, index) => {
          const models = recipe.featuredSlugs
            .map((slug) => getModelBySlug(slug))
            .filter((model): model is NonNullable<typeof model> => Boolean(model));

          return (
            <FadeIn key={recipe.id} delay={0.05 * index}>
              <Card>
                <CardHeader className="p-5 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {th(`tiers.${recipe.tier}`)}
                    </Badge>
                    <Badge variant="secondary" className="text-[11px]">
                      {th(`platforms.${recipe.platform}`)}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">
                    {t(`recipes.${recipe.id}.title`)}
                  </CardTitle>
                  <CardDescription>
                    {t(`recipes.${recipe.id}.body`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-2">
                  <p className="text-xs text-muted">
                    {recipe.exampleDevices.join(" · ")}
                  </p>
                  <ul className="flex flex-wrap gap-2 text-sm">
                    {models.map((model) => (
                      <li key={model.slug}>
                        <Link
                          href={`/models/${model.slug}`}
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          {model.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="sm">
                    <Link href={hardwareRecipeHref(recipe)}>
                      {t("browseFiltered")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2} className="mt-10 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/recommend">{t("recommendLink")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/models?host=local">{t("allLocal")}</Link>
        </Button>
      </FadeIn>
    </div>
  );
}
