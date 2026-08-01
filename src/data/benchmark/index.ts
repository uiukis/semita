import { configLocalV1 } from "./config-local-v1";
import { configV1 } from "./config-v1";
import { tasksV1 } from "./tasks-v1";
import type { ModelAggregate } from "./types";
import {
  hasPublishedBenchmarkRun,
  latestBenchmarkRun,
} from "./results/latest";

export function getBenchmarkTasks() {
  return tasksV1;
}

export function getBenchmarkConfig() {
  const run = getLatestBenchmarkRun();
  if (run?.notes.some((note) => note.includes("profile:local-ollama"))) {
    return configLocalV1;
  }
  return configV1;
}

export function getLatestBenchmarkRun() {
  return hasPublishedBenchmarkRun ? latestBenchmarkRun : null;
}

export function getBenchmarkModelTargets() {
  return getBenchmarkConfig().models;
}

export function isBenchmarkSuiteModel(catalogSlug: string): boolean {
  return (
    configV1.models.some((model) => model.catalogSlug === catalogSlug) ||
    configLocalV1.models.some((model) => model.catalogSlug === catalogSlug)
  );
}

export function getLatestBenchmarkAggregate(
  catalogSlug: string,
): ModelAggregate | null {
  const run = getLatestBenchmarkRun();
  if (!run) {
    return null;
  }
  return (
    run.models.find((model) => model.catalogSlug === catalogSlug) ?? null
  );
}
