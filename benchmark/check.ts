import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  BenchmarkRunSchema,
  type BenchmarkRun,
} from "../src/data/benchmark/types";
import { configV1 } from "../src/data/benchmark/config-v1";
import { getConfigHash, getPromptHash } from "./hash";
import {
  aggregateModel,
  recomputeTrialQuality,
  scoreDeterministic,
} from "./scoring";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";

const SECRETISH = /(api[_-]?key|sk-|bearer\s+[a-z0-9]|authorization)/i;

async function loadPublishedRuns(): Promise<BenchmarkRun[]> {
  const dir = path.join(process.cwd(), "src/data/benchmark/results/v1");
  let files: string[] = [];
  try {
    files = (await readdir(dir)).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }

  const runs: BenchmarkRun[] = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    runs.push(BenchmarkRunSchema.parse(raw));
  }
  return runs;
}

function assertAlmostEqual(a: number, b: number, label: string) {
  if (Math.abs(a - b) > 1e-6) {
    throw new Error(`${label}: expected ${b}, got ${a}`);
  }
}

function validateRun(run: BenchmarkRun) {
  if (run.benchmarkVersion !== "v1") {
    throw new Error(`Unexpected version ${run.benchmarkVersion}`);
  }
  if (run.promptHash !== getPromptHash()) {
    throw new Error(`promptHash mismatch for ${run.runId}`);
  }
  if (run.configHash !== getConfigHash()) {
    throw new Error(`configHash mismatch for ${run.runId}`);
  }

  const expectedCalls =
    configV1.models.length * tasksV1.length * configV1.repetitions;
  if (run.trials.length !== expectedCalls) {
    throw new Error(
      `${run.runId}: expected ${expectedCalls} trials, got ${run.trials.length}`,
    );
  }

  const ids = new Set<string>();
  for (const trial of run.trials) {
    if (ids.has(trial.trialId)) {
      throw new Error(`Duplicate trialId ${trial.trialId}`);
    }
    ids.add(trial.trialId);

    if (SECRETISH.test(trial.responseText) || SECRETISH.test(JSON.stringify(trial))) {
      throw new Error(`Secret-like content in trial ${trial.trialId}`);
    }

    const recomputed = recomputeTrialQuality(trial);
    assertAlmostEqual(
      recomputed.deterministicScore,
      trial.deterministicScore,
      `${trial.trialId} deterministicScore`,
    );
    assertAlmostEqual(
      recomputed.qualityScore,
      trial.qualityScore,
      `${trial.trialId} qualityScore`,
    );

    const task = tasksV1.find((entry) => entry.id === trial.taskId);
    if (!task) {
      throw new Error(`Unknown task ${trial.taskId}`);
    }
    if (task.requiresHumanReview) {
      if (trial.humanReviewScore == null) {
        throw new Error(`Missing human review for ${trial.trialId}`);
      }
    }
  }

  for (const model of run.models) {
    const modelTrials = run.trials.filter(
      (trial) => trial.catalogSlug === model.catalogSlug,
    );
    const agg = aggregateModel(
      model.catalogSlug,
      model.gatewayModelId,
      model.modelName,
      model.provider,
      model.pricing,
      modelTrials,
    );
    assertAlmostEqual(
      agg.qualityOverall,
      model.qualityOverall,
      `${model.catalogSlug} qualityOverall`,
    );
    assertAlmostEqual(
      agg.totalEstimatedCostUsd,
      model.totalEstimatedCostUsd,
      `${model.catalogSlug} cost`,
    );
  }
}

function smokeScoreFixtures() {
  const coding = tasksV1.find((task) => task.id === "coding-complexity");
  if (!coding) {
    throw new Error("Missing coding-complexity task");
  }
  const ok = scoreDeterministic(coding, "O(n^2)");
  assertAlmostEqual(ok.score, 1, "coding complexity fixture");

  const extraction = tasksV1.find((task) => task.id === "extraction-invoice");
  if (!extraction?.expectedJson) {
    throw new Error("Missing extraction task");
  }
  const extractionOk = scoreDeterministic(
    extraction,
    JSON.stringify(extraction.expectedJson),
  );
  assertAlmostEqual(extractionOk.score, 1, "extraction fixture");
}

async function main() {
  smokeScoreFixtures();

  const taskIds = new Set(tasksV1.map((task) => task.id));
  if (taskIds.size !== tasksV1.length) {
    throw new Error("Duplicate task ids");
  }
  if (tasksV1.length !== 10) {
    throw new Error("Expected 10 tasks in v1");
  }

  z.object({
    version: z.literal("v1"),
    models: z.array(z.object({ catalogSlug: z.string(), gatewayModelId: z.string() })),
  }).parse({
    version: configV1.version,
    models: configV1.models,
  });

  const runs = await loadPublishedRuns();
  for (const run of runs) {
    validateRun(run);
  }

  const latestModule = await import(
    "../src/data/benchmark/results/latest"
  );
  if (runs.length === 0) {
    if (latestModule.hasPublishedBenchmarkRun) {
      throw new Error("latest.ts claims published run but no JSON exists");
    }
  } else if (!latestModule.hasPublishedBenchmarkRun) {
    throw new Error("Published JSON exists but latest.ts is not published");
  } else {
    const latest = BenchmarkRunSchema.parse(latestModule.latestBenchmarkRun);
    if (!runs.some((run) => run.runId === latest.runId)) {
      throw new Error("latest.ts points to missing run");
    }
  }

  console.log(
    `benchmark:check passed (${runs.length} published run(s), promptHash=${getPromptHash().slice(0, 12)}…)`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
