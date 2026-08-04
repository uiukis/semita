"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { StepSwap } from "@/components/motion";
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
import {
  getLatestBenchmarkAggregate,
  isBenchmarkSuiteModel,
  isLocalOllamaBenchmarkRun,
} from "@/data/benchmark";
import {
  modelsHrefFromAnswers,
  recommendModels,
  type RecommendAnswers,
  type RecommendBudget,
  type RecommendHost,
  type RecommendUse,
} from "@/lib/recommend";

const USES: RecommendUse[] = [
  "coding",
  "writing",
  "research",
  "reasoning",
  "vision",
  "general",
];
const HOSTS: RecommendHost[] = ["api", "local", "either"];
const BUDGETS: RecommendBudget[] = ["free", "cheap", "quality"];
const TIERS = ["entry", "mid", "heavy"] as const;

type Step = 0 | 1 | 2 | 3 | 4;

function OptionButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  const button = (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left transition-shadow duration-300 hover:shadow-md hover:shadow-black/20"
      onClick={onClick}
    >
      {label}
    </Button>
  );

  if (reduce) {
    return button;
  }

  return (
    <motion.div whileHover={{ scale: 1.015, x: 2 }} whileTap={{ scale: 0.985 }}>
      {button}
    </motion.div>
  );
}

export function RecommendWizard() {
  const t = useTranslations("recommend");
  const tu = useTranslations("useCases");
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<RecommendAnswers>({
    use: "general",
    host: "either",
    budget: "cheap",
    tier: "none",
  });

  const results = useMemo(
    () => (step === 4 ? recommendModels(answers, 3) : []),
    [answers, step],
  );

  const catalogHref = modelsHrefFromAnswers(answers);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((index) => (
          <Badge
            key={index}
            variant={step === index || (step === 4 && index === 3) ? "default" : "outline"}
            className="font-mono text-[11px]"
          >
            {t(`steps.${index}`)}
          </Badge>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <StepSwap stepKey={step} className="min-h-[12rem]">
          {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("qUse")}</CardTitle>
            <CardDescription>{t("qUseHelp")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {USES.map((use) => (
              <OptionButton
                key={use}
                active={answers.use === use}
                label={t(`uses.${use}`)}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, use }));
                  setStep(1);
                }}
              />
            ))}
          </CardContent>
        </Card>
          ) : null}

          {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("qHost")}</CardTitle>
            <CardDescription>{t("qHostHelp")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {HOSTS.map((host) => (
              <OptionButton
                key={host}
                active={answers.host === host}
                label={t(`hosts.${host}`)}
                onClick={() => {
                  setAnswers((prev) => ({
                    ...prev,
                    host,
                    tier: host === "api" ? "none" : prev.tier === "none" ? "entry" : prev.tier,
                  }));
                  setStep(2);
                }}
              />
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep(0)}>
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("qBudget")}</CardTitle>
            <CardDescription>{t("qBudgetHelp")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {BUDGETS.map((budget) => (
              <OptionButton
                key={budget}
                active={answers.budget === budget}
                label={t(`budgets.${budget}`)}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, budget }));
                  setStep(answers.host === "api" ? 4 : 3);
                }}
              />
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("qTier")}</CardTitle>
            <CardDescription>{t("qTierHelp")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {TIERS.map((tier) => (
              <OptionButton
                key={tier}
                active={answers.tier === tier}
                label={t(`tiers.${tier}`)}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, tier }));
                  setStep(4);
                }}
              />
            ))}
            <OptionButton
              active={answers.tier === "none"}
              label={t("tiers.skip")}
              onClick={() => {
                setAnswers((prev) => ({ ...prev, tier: "none" }));
                setStep(4);
              }}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep(2)}>
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 4 ? (
        <div className="space-y-6">
          <Card className="border-accent/20 bg-accent-soft">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-medium">{t("resultsTitle")}</p>
                <p className="mt-1 text-sm text-muted">{t("resultsBody")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={catalogHref}>{t("seeFiltered")}</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep(0);
                    setAnswers({
                      use: "general",
                      host: "either",
                      budget: "cheap",
                      tier: "none",
                    });
                  }}
                >
                  {t("restart")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.length === 0 ? (
            <p className="text-sm text-muted">{t("empty")}</p>
          ) : (
            <div className="grid gap-3">
              {results.map((row, index) => (
                <Card key={row.model.slug}>
                  <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 p-5 pb-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          #{index + 1}
                        </Badge>
                        <span className="text-xs text-muted">
                          {t("matchScore", { score: Math.round(row.score) })}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{row.model.name}</CardTitle>
                      <CardDescription>
                        {row.model.provider} · {row.model.communityScore} ★
                      </CardDescription>
                      {isBenchmarkSuiteModel(row.model.slug) ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[11px]">
                            {t("miniBenchSuite")}
                          </Badge>
                          {isLocalOllamaBenchmarkRun() &&
                          getLatestBenchmarkAggregate(row.model.slug) ? (
                            <Badge variant="secondary" className="text-[11px]">
                              {t("miniBenchLocalBadge")}
                            </Badge>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/models/${row.model.slug}`}>{t("openModel")}</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5 p-5 pt-0">
                    {row.model.useCases.slice(0, 4).map((useCase) => (
                      <Badge key={useCase} variant="secondary" className="text-[11px]">
                        {tu(useCase)}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
          ) : null}
        </StepSwap>
      </AnimatePresence>
    </div>
  );
}
