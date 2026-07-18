import type {
  DeterministicTask,
  ModelAggregate,
  PricingSnapshot,
  TaskCategory,
  TrialResult,
} from "../src/data/benchmark/types";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";

export function normalizeText(value: string): string {
  return value
    .trim()
    .replace(/^```(?:\w+)?\n?/, "")
    .replace(/\n?```$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCode(value: string): string {
  return value
    .trim()
    .replace(/^```(?:\w+)?\n?/, "")
    .replace(/\n?```$/, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function wordCount(value: string): number {
  const words = value.trim().match(/\S+/g);
  return words?.length ?? 0;
}

export function estimateCostUsd(
  inputTokens: number,
  outputTokens: number,
  pricing: PricingSnapshot,
): number {
  return (
    (inputTokens / 1_000_000) * pricing.inputPerMillion +
    (outputTokens / 1_000_000) * pricing.outputPerMillion
  );
}

function scoreExact(response: string, expected: string): number {
  return normalizeText(response).toLowerCase() ===
    normalizeText(expected).toLowerCase()
    ? 1
    : 0;
}

function scoreCode(response: string, expected: string): number {
  return normalizeCode(response) === normalizeCode(expected) ? 1 : 0;
}

function scoreNumeric(
  response: string,
  expected: string,
  tolerance: number,
): number {
  const got = Number(normalizeText(response).replace(/[^0-9.-]/g, ""));
  const want = Number(expected);
  if (!Number.isFinite(got) || !Number.isFinite(want)) {
    return 0;
  }
  return Math.abs(got - want) <= tolerance ? 1 : 0;
}

function parseJsonObject(response: string): Record<string, unknown> | null {
  const trimmed = response.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => valuesEqual(item, b[index]));
  }
  if (typeof a === "string" && typeof b === "string") {
    return normalizeText(a).toLowerCase() === normalizeText(b).toLowerCase();
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

function scoreExtraction(
  response: string,
  expected: Record<string, unknown>,
): { score: number; notes: string[] } {
  const parsed = parseJsonObject(response);
  if (!parsed) {
    return { score: 0, notes: ["Invalid JSON object"] };
  }
  const keys = Object.keys(expected);
  let hits = 0;
  const notes: string[] = [];
  for (const key of keys) {
    if (!(key in parsed)) {
      notes.push(`Missing field: ${key}`);
      continue;
    }
    if (valuesEqual(parsed[key], expected[key])) {
      hits += 1;
    } else {
      notes.push(`Mismatch: ${key}`);
    }
  }
  return { score: hits / keys.length, notes };
}

function scoreConstrainedWriting(task: DeterministicTask, response: string): {
  score: number;
  notes: string[];
} {
  const text = response.trim();
  const lower = text.toLowerCase();
  const notes: string[] = [];
  let checks = 0;
  let passed = 0;

  const required = task.requiredPhrases ?? [];
  for (const phrase of required) {
    checks += 1;
    if (lower.includes(phrase.toLowerCase())) {
      passed += 1;
    } else {
      notes.push(`Missing required phrase: ${phrase}`);
    }
  }

  const forbidden = task.forbiddenPhrases ?? [];
  for (const phrase of forbidden) {
    checks += 1;
    if (!lower.includes(phrase.toLowerCase())) {
      passed += 1;
    } else {
      notes.push(`Forbidden phrase present: ${phrase}`);
    }
  }

  if (task.minWords != null || task.maxWords != null) {
    checks += 1;
    const words = wordCount(text);
    const minOk = task.minWords == null || words >= task.minWords;
    const maxOk = task.maxWords == null || words <= task.maxWords;
    if (minOk && maxOk) {
      passed += 1;
    } else {
      notes.push(`Word count ${words} outside ${task.minWords ?? 0}-${task.maxWords ?? "∞"}`);
    }
  }

  if (task.id === "writing-compare-brief") {
    checks += 1;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length === 2) {
      passed += 1;
    } else {
      notes.push(`Expected 2 paragraphs, got ${paragraphs.length}`);
    }
  }

  if (task.id === "ptbr-study-plan") {
    checks += 1;
    const hasSteps =
      /(^|\n)\s*1\./.test(text) &&
      /(^|\n)\s*2\./.test(text) &&
      /(^|\n)\s*3\./.test(text);
    if (hasSteps) {
      passed += 1;
    } else {
      notes.push("Missing numbered steps 1. 2. 3.");
    }
  }

  if (task.id === "writing-leverage" || task.id === "ptbr-explain-llm") {
    checks += 1;
    if (/\?\s*$/.test(text)) {
      passed += 1;
    } else {
      notes.push("Missing ending question");
    }
  }

  return {
    score: checks === 0 ? 0 : passed / checks,
    notes,
  };
}

export function scoreDeterministic(
  task: DeterministicTask,
  response: string,
): { score: number; notes: string[] } {
  if (task.category === "coding" && task.expected) {
    if (task.id === "coding-complexity") {
      const normalized = normalizeText(response)
        .toLowerCase()
        .replace(/\s+/g, "");
      const ok =
        normalized === "o(n^2)" ||
        normalized === "o(n²)" ||
        normalized === "θ(n^2)" ||
        normalized === "theta(n^2)";
      return {
        score: ok ? 1 : 0,
        notes: ok ? [] : [`Expected O(n^2), got ${normalizeText(response)}`],
      };
    }
    const score = scoreCode(response, task.expected);
    return {
      score,
      notes: score === 1 ? [] : ["Code did not match expected fix"],
    };
  }

  if (task.category === "reasoning" && task.expected) {
    if (task.numericTolerance != null) {
      const score = scoreNumeric(response, task.expected, task.numericTolerance);
      return {
        score,
        notes: score === 1 ? [] : [`Expected ${task.expected}`],
      };
    }
    const score = scoreExact(response, task.expected);
    return {
      score,
      notes: score === 1 ? [] : [`Expected ${task.expected}`],
    };
  }

  if (task.expectedJson) {
    return scoreExtraction(response, task.expectedJson);
  }

  if (task.category === "writing" || task.category === "pt-br") {
    return scoreConstrainedWriting(task, response);
  }

  return { score: 0, notes: ["Unsupported task"] };
}

export function combineQualityScore(
  task: DeterministicTask,
  deterministicScore: number,
  humanReviewScore: number | null,
): number {
  if (!task.requiresHumanReview) {
    return deterministicScore;
  }
  const human = humanReviewScore ?? 0;
  const humanWeight = task.humanWeight;
  const objectiveWeight = 1 - humanWeight;
  return objectiveWeight * deterministicScore + humanWeight * human;
}

export function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function aggregateModel(
  catalogSlug: string,
  gatewayModelId: string,
  modelName: string,
  provider: string,
  pricing: PricingSnapshot,
  trials: TrialResult[],
): ModelAggregate {
  const categories = [
    "coding",
    "reasoning",
    "extraction",
    "writing",
    "pt-br",
  ] as const satisfies TaskCategory[];

  const qualityByCategory = {} as Record<TaskCategory, number>;
  for (const category of categories) {
    const categoryTrials = trials.filter((trial) => trial.category === category);
    const avg =
      categoryTrials.length === 0
        ? 0
        : categoryTrials.reduce((sum, trial) => sum + trial.qualityScore, 0) /
          categoryTrials.length;
    qualityByCategory[category] = Number(avg.toFixed(4));
  }

  const qualityOverall = Number(
    (
      categories.reduce((sum, category) => sum + qualityByCategory[category], 0) /
      categories.length
    ).toFixed(4),
  );

  const latencies = trials.map((trial) => trial.latencyMs);

  return {
    catalogSlug,
    gatewayModelId,
    modelName,
    provider,
    qualityByCategory,
    qualityOverall,
    latencyMsMedian: Number(median(latencies).toFixed(1)),
    latencyMsMin: latencies.length ? Math.min(...latencies) : 0,
    latencyMsMax: latencies.length ? Math.max(...latencies) : 0,
    totalEstimatedCostUsd: Number(
      trials
        .reduce((sum, trial) => sum + trial.estimatedCostUsd, 0)
        .toFixed(6),
    ),
    totalInputTokens: trials.reduce((sum, trial) => sum + trial.inputTokens, 0),
    totalOutputTokens: trials.reduce(
      (sum, trial) => sum + trial.outputTokens,
      0,
    ),
    pricing,
  };
}

export function getTaskById(taskId: string): DeterministicTask | undefined {
  return tasksV1.find((task) => task.id === taskId);
}

export function recomputeTrialQuality(trial: TrialResult): TrialResult {
  const task = getTaskById(trial.taskId);
  if (!task) {
    throw new Error(`Unknown task: ${trial.taskId}`);
  }
  const { score, notes } = scoreDeterministic(task, trial.responseText);
  return {
    ...trial,
    deterministicScore: Number(score.toFixed(4)),
    objectiveNotes: notes,
    qualityScore: Number(
      combineQualityScore(task, score, trial.humanReviewScore).toFixed(4),
    ),
  };
}
