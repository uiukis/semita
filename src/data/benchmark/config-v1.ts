import type { PricingSnapshot } from "./types";

export type BenchmarkModelConfig = {
  catalogSlug: string;
  gatewayModelId: string;
  pricing: PricingSnapshot;
};

export const configV1 = {
  version: "v1" as const,
  temperature: 0,
  maxOutputTokens: 512,
  repetitions: 2,
  timeoutMs: 60_000,
  concurrency: 1,
  maxRetries: 1,
  defaultMaxUsd: 2,
  models: [
    {
      catalogSlug: "gpt-5",
      gatewayModelId: "openai/gpt-5",
      pricing: {
        inputPerMillion: 1.25,
        outputPerMillion: 10,
        currency: "USD",
        sourceUrl: "https://developers.openai.com/api/docs/pricing",
        asOf: "2026-07-18",
      },
    },
    {
      catalogSlug: "claude-sonnet-5",
      gatewayModelId: "anthropic/claude-sonnet-5",
      pricing: {
        inputPerMillion: 2,
        outputPerMillion: 10,
        currency: "USD",
        sourceUrl: "https://www.anthropic.com/pricing",
        asOf: "2026-07-18",
      },
    },
    {
      catalogSlug: "gemini-2-5-flash",
      gatewayModelId: "google/gemini-2.5-flash",
      pricing: {
        inputPerMillion: 0.3,
        outputPerMillion: 2.5,
        currency: "USD",
        sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
        asOf: "2026-07-18",
      },
    },
    {
      catalogSlug: "gpt-4o-mini",
      gatewayModelId: "openai/gpt-4o-mini",
      pricing: {
        inputPerMillion: 0.15,
        outputPerMillion: 0.6,
        currency: "USD",
        sourceUrl: "https://developers.openai.com/api/docs/pricing",
        asOf: "2026-07-18",
      },
    },
  ] satisfies BenchmarkModelConfig[],
  limitations: [
    "Small sample: 10 prompts × 2 repetitions. Not a scientific leaderboard.",
    "Latency is wall-clock on the maintainer network, not a provider SLA.",
    "Writing and pt-BR scores include blinded human review for the official run.",
    "Results apply only to the pinned Gateway model IDs and snapshotted prices.",
  ],
};
