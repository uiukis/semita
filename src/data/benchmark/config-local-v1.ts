import type { BenchmarkModelConfig } from "./config-v1";

const freePricing = {
  inputPerMillion: 0,
  outputPerMillion: 0,
  currency: "USD" as const,
  sourceUrl: "https://ollama.com",
  asOf: "2026-07-31",
};

export const configLocalV1 = {
  version: "v1" as const,
  profile: "local-ollama" as const,
  temperature: 0,
  maxOutputTokens: 512,
  repetitions: 1,
  timeoutMs: 120_000,
  concurrency: 1,
  maxRetries: 1,
  defaultMaxUsd: 0,
  ollamaBaseUrl: "http://127.0.0.1:11434",
  models: [
    {
      catalogSlug: "smollm2-1-7b",
      gatewayModelId: "ollama/smollm2:1.7b",
      pricing: freePricing,
    },
    {
      catalogSlug: "phi4-mini",
      gatewayModelId: "ollama/phi4-mini:3.8b",
      pricing: freePricing,
    },
    {
      catalogSlug: "qwen3-8b",
      gatewayModelId: "ollama/qwen3:8b",
      pricing: freePricing,
    },
  ] satisfies BenchmarkModelConfig[],
  limitations: [
    "Local Ollama suite: $0 API spend. Quality is not comparable 1:1 to the cloud Gateway suite.",
    "Small sample: 10 prompts × 1 repetition. Not a scientific leaderboard.",
    "Latency is wall-clock on Wilker Quirino's MacBook Pro 14\" (Apple M2 Pro, 16GB RAM) running Ollama.",
    "Writing and pt-BR scores include blinded human review for the official run.",
    "Results apply only to the pinned Ollama tags pulled at run time.",
  ],
};

export function ollamaTagFromGatewayId(gatewayModelId: string): string {
  if (gatewayModelId.startsWith("ollama/")) {
    return gatewayModelId.slice("ollama/".length);
  }
  return gatewayModelId;
}
