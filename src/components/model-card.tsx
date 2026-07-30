import { getTranslations } from "next-intl/server";
import { MotionCardLink } from "@/components/motion-link";
import { StaggerItem } from "@/components/motion";
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
      <MotionCardLink
        href={`/models/${model.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-surface-raised hover:shadow-lg hover:shadow-black/20"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold transition-colors group-hover:text-accent">
              {model.name}
            </h3>
            <p className="text-xs text-muted">{model.provider}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
              {model.communityScore.toFixed(1)} ★
            </span>
            {isLocal ? (
              <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                {td(model.deployment)}
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {content.summary}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
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

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {model.useCases.slice(0, 4).map((useCase) => (
            <span
              key={useCase}
              className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
            >
              {tu(useCase)}
            </span>
          ))}
        </div>
      </MotionCardLink>
    </StaggerItem>
  );
}
