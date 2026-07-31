import {
  getAllModels,
  modelMatchesDeployment,
  modelMatchesHardware,
} from "@/data/models";
import type {
  DeploymentMode,
  HardwareTier,
  LlmModel,
  UseCase,
} from "@/data/types";

export type RecommendUse =
  | "coding"
  | "writing"
  | "research"
  | "reasoning"
  | "vision"
  | "general";

export type RecommendHost = "api" | "local" | "either";
export type RecommendBudget = "free" | "cheap" | "quality";

export type RecommendAnswers = {
  use: RecommendUse;
  host: RecommendHost;
  budget: RecommendBudget;
  tier: HardwareTier | "none";
};

export type Recommendation = {
  model: LlmModel;
  score: number;
  reasons: string[];
};

const USE_MAP: Record<RecommendUse, UseCase | null> = {
  coding: "coding",
  writing: "writing",
  research: "research",
  reasoning: "reasoning",
  vision: "vision",
  general: null,
};

function hostMode(host: RecommendHost): DeploymentMode | "any" {
  if (host === "either") {
    return "any";
  }
  return host;
}

export function recommendModels(
  answers: RecommendAnswers,
  limit = 3,
): Recommendation[] {
  const useCase = USE_MAP[answers.use];
  const mode = hostMode(answers.host);

  const scored = getAllModels()
    .filter((model) => modelMatchesDeployment(model, mode))
    .filter((model) => {
      if (answers.host === "api" || answers.tier === "none") {
        return true;
      }
      if (answers.host === "either" && model.deployment === "api") {
        return true;
      }
      return modelMatchesHardware(model, answers.tier);
    })
    .map((model) => scoreModel(model, answers, useCase))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

function scoreModel(
  model: LlmModel,
  answers: RecommendAnswers,
  useCase: UseCase | null,
): Recommendation {
  let score = model.communityScore * 10;
  const reasons: string[] = [];

  if (useCase && model.useCases.includes(useCase)) {
    score += 18;
    reasons.push(`use:${useCase}`);
  } else if (!useCase) {
    score += 6;
    reasons.push("use:general");
  } else if (model.useCases.includes("cost-effective") && answers.budget !== "quality") {
    score += 4;
  } else {
    score -= 8;
  }

  const isLocal =
    model.deployment === "local" || model.deployment === "both";
  const isFreeLocal = isLocal && model.pricing.inputPerMillion === 0;

  if (answers.host === "local" && isLocal) {
    score += 14;
    reasons.push("host:local");
  }
  if (answers.host === "api" && (model.deployment === "api" || model.deployment === "both")) {
    score += 10;
    reasons.push("host:api");
  }

  if (answers.budget === "free") {
    if (isFreeLocal) {
      score += 20;
      reasons.push("budget:free-local");
    } else if (model.useCases.includes("cost-effective")) {
      score += 8;
      reasons.push("budget:cheap-api");
    } else {
      score -= 12;
    }
  } else if (answers.budget === "cheap") {
    if (isFreeLocal || model.pricing.inputPerMillion <= 0.5) {
      score += 14;
      reasons.push("budget:cheap");
    } else if (model.pricing.inputPerMillion <= 2) {
      score += 6;
    } else {
      score -= 6;
    }
  } else if (answers.budget === "quality") {
    if (model.communityScore >= 4.5) {
      score += 12;
      reasons.push("budget:quality");
    }
    if (model.pricing.inputPerMillion === 0 && model.deployment === "local") {
      score += 4;
    }
  }

  if (
    answers.tier !== "none" &&
    model.local?.comfortTiers.includes(answers.tier)
  ) {
    score += 10;
    reasons.push(`tier:${answers.tier}`);
  }

  if (model.useCases.includes("local") && answers.host !== "api") {
    score += 3;
  }

  return { model, score, reasons };
}

export function modelsHrefFromAnswers(answers: RecommendAnswers): string {
  const params = new URLSearchParams();
  const useCase = USE_MAP[answers.use];
  if (useCase) {
    params.set("use", useCase);
  }
  if (answers.host === "local") {
    params.set("host", "local");
  } else if (answers.host === "api") {
    params.set("host", "api");
  }
  if (answers.tier !== "none" && answers.host !== "api") {
    params.set("tier", answers.tier);
  }
  if (answers.budget === "cheap" || answers.budget === "free") {
    params.set("sort", "cheapest");
  } else {
    params.set("sort", "recommended");
  }
  const query = params.toString();
  return query ? `/models?${query}` : "/models";
}
