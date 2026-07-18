import { createHash } from "node:crypto";
import type { DeterministicTask } from "../src/data/benchmark/types";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";
import { configV1 } from "../src/data/benchmark/config-v1";

export function hashPayload(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function getPromptHash(tasks: DeterministicTask[] = tasksV1): string {
  return hashPayload(
    tasks.map((task) => ({
      id: task.id,
      category: task.category,
      prompt: task.prompt,
      expected: task.expected ?? null,
      expectedJson: task.expectedJson ?? null,
      numericTolerance: task.numericTolerance ?? null,
      requiredPhrases: task.requiredPhrases ?? [],
      forbiddenPhrases: task.forbiddenPhrases ?? [],
      maxWords: task.maxWords ?? null,
      minWords: task.minWords ?? null,
      requiresHumanReview: task.requiresHumanReview,
      humanWeight: task.humanWeight,
    })),
  );
}

export function getConfigHash(
  config: typeof configV1 = configV1,
): string {
  return hashPayload({
    version: config.version,
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
    repetitions: config.repetitions,
    timeoutMs: config.timeoutMs,
    concurrency: config.concurrency,
    maxRetries: config.maxRetries,
    defaultMaxUsd: config.defaultMaxUsd,
    models: config.models.map((model) => ({
      catalogSlug: model.catalogSlug,
      gatewayModelId: model.gatewayModelId,
    })),
  });
}
