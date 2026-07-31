import { getTranslations } from "next-intl/server";
import { MotionCardLink } from "@/components/motion-link";
import { StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModelContent } from "@/data/models";
import type { LlmModel, Locale } from "@/data/types";
import { formatContextWindow, formatUsdPerMillion } from "@/lib/format";

export async function ModelCard({
  model,
  locale,
}: {
  model: LlmModel;
  locale: Locale;
}) {
  const t = await getTranslations("card");
  const tu = await getTranslations("useCases");
  const td = await getTranslations("deployment");
  const content = getModelContent(model, locale);
  const isLocal = model.deployment === "local" || model.deployment === "both";

  return (
    <StaggerItem className="h-full">
      <MotionCardLink href={`/models/${model.slug}`} className="group block h-full">
        <Card className="h-full border-line bg-surface p-0 transition-colors group-hover:border-accent/40 group-hover:bg-surface-raised group-hover:shadow-lg group-hover:shadow-black/20">
          <CardHeader className="p-5 pb-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="transition-colors group-hover:text-accent">
                  {model.name}
                </CardTitle>
                <p className="text-xs text-muted">{model.provider}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge>
                  {model.communityScore.toFixed(1)} ★
                </Badge>
                {isLocal ? (
                  <Badge variant="secondary" className="text-[10px]">
                    {td(model.deployment)}
                  </Badge>
                ) : null}
              </div>
            </div>
            <CardDescription className="mt-3 line-clamp-2">
              {content.summary}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5">
            <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
              <div>
                <dt className="text-xs text-muted">{t("input")}</dt>
                <dd className="font-medium">
                  {formatUsdPerMillion(model.pricing.inputPerMillion, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t("output")}</dt>
                <dd className="font-medium">
                  {formatUsdPerMillion(model.pricing.outputPerMillion, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t("context")}</dt>
                <dd className="font-medium">
                  {formatContextWindow(model.contextWindow, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">
                  {isLocal && model.local ? t("params") : t("useCases")}
                </dt>
                <dd className="font-medium">
                  {isLocal && model.local
                    ? model.local.parameterCount
                    : model.useCases.length}
                </dd>
              </div>
            </dl>

            {isLocal && model.local ? (
              <p className="mt-3 text-xs text-muted">
                {t("quant")}: {model.local.quantization}
                {model.local.ollamaTag ? ` · ${model.local.ollamaTag}` : ""}
              </p>
            ) : null}
          </CardContent>

          <CardFooter className="mt-auto flex flex-wrap gap-1.5 border-0 p-5 pt-0">
            {model.useCases.slice(0, 4).map((useCase) => (
              <Badge key={useCase} variant="outline">
                {tu(useCase)}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </MotionCardLink>
    </StaggerItem>
  );
}
