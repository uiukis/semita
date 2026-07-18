import { z } from "zod";

export const BENCHMARK_VERSION = "v1" as const;

export const TaskCategorySchema = z.enum([
  "coding",
  "reasoning",
  "extraction",
  "writing",
  "pt-br",
]);

export type TaskCategory = z.infer<typeof TaskCategorySchema>;

export const PricingSnapshotSchema = z.object({
  inputPerMillion: z.number().nonnegative(),
  outputPerMillion: z.number().nonnegative(),
  currency: z.literal("USD"),
  sourceUrl: z.string().url(),
  asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const TrialResultSchema = z.object({
  trialId: z.string().min(1),
  taskId: z.string().min(1),
  category: TaskCategorySchema,
  catalogSlug: z.string().min(1),
  gatewayModelId: z.string().min(1),
  repetition: z.number().int().positive(),
  responseText: z.string(),
  latencyMs: z.number().nonnegative(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  estimatedCostUsd: z.number().nonnegative(),
  deterministicScore: z.number().min(0).max(1),
  objectiveNotes: z.array(z.string()),
  humanReviewScore: z.number().min(0).max(1).nullable(),
  humanReviewNotes: z.string().nullable(),
  qualityScore: z.number().min(0).max(1),
  finishedAt: z.string().datetime(),
});

export const ModelAggregateSchema = z.object({
  catalogSlug: z.string().min(1),
  gatewayModelId: z.string().min(1),
  modelName: z.string().min(1),
  provider: z.string().min(1),
  qualityByCategory: z.record(TaskCategorySchema, z.number().min(0).max(1)),
  qualityOverall: z.number().min(0).max(1),
  latencyMsMedian: z.number().nonnegative(),
  latencyMsMin: z.number().nonnegative(),
  latencyMsMax: z.number().nonnegative(),
  totalEstimatedCostUsd: z.number().nonnegative(),
  totalInputTokens: z.number().int().nonnegative(),
  totalOutputTokens: z.number().int().nonnegative(),
  pricing: PricingSnapshotSchema,
});

export const BenchmarkRunSchema = z.object({
  runId: z.string().min(1),
  benchmarkVersion: z.literal(BENCHMARK_VERSION),
  status: z.enum(["pending", "published"]),
  createdAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
  gitSha: z.string().nullable(),
  promptHash: z.string().min(1),
  configHash: z.string().min(1),
  settings: z.object({
    temperature: z.number(),
    maxOutputTokens: z.number().int().positive(),
    repetitions: z.number().int().positive(),
    timeoutMs: z.number().int().positive(),
  }),
  models: z.array(ModelAggregateSchema),
  trials: z.array(TrialResultSchema),
  notes: z.array(z.string()),
  limitations: z.array(z.string()),
});

export type PricingSnapshot = z.infer<typeof PricingSnapshotSchema>;
export type TrialResult = z.infer<typeof TrialResultSchema>;
export type ModelAggregate = z.infer<typeof ModelAggregateSchema>;
export type BenchmarkRun = z.infer<typeof BenchmarkRunSchema>;

export type DeterministicTask = {
  id: string;
  category: TaskCategory;
  title: { en: string; "pt-br": string };
  prompt: string;
  expected?: string;
  expectedJson?: Record<string, unknown>;
  numericTolerance?: number;
  requiredPhrases?: string[];
  forbiddenPhrases?: string[];
  maxWords?: number;
  minWords?: number;
  requiresHumanReview: boolean;
  humanWeight: number;
};
