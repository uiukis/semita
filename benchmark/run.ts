import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateText } from "ai";
import { getModelBySlug } from "../src/data/models";
import type { TrialResult } from "../src/data/benchmark/types";
import { configV1 } from "../src/data/benchmark/config-v1";
import { getConfigHash, getPromptHash } from "./hash";
import {
  combineQualityScore,
  estimateCostUsd,
  scoreDeterministic,
} from "./scoring";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";

async function loadEnvLocal() {
  try {
    const raw = await readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional
  }
}

function parseArgs(argv: string[]): {
  maxUsd: number;
  dryRun: boolean;
} {
  let maxUsd = configV1.defaultMaxUsd;
  let dryRun = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
    }
    if (arg === "--max-usd") {
      const next = Number(argv[i + 1]);
      if (!Number.isFinite(next) || next <= 0) {
        throw new Error("--max-usd must be a positive number");
      }
      maxUsd = next;
      i += 1;
    }
  }
  return { maxUsd, dryRun };
}

function buildSchedule() {
  const schedule: Array<{
    catalogSlug: string;
    gatewayModelId: string;
    taskId: string;
    repetition: number;
  }> = [];

  for (let repetition = 1; repetition <= configV1.repetitions; repetition += 1) {
    for (const task of tasksV1) {
      for (const model of configV1.models) {
        schedule.push({
          catalogSlug: model.catalogSlug,
          gatewayModelId: model.gatewayModelId,
          taskId: task.id,
          repetition,
        });
      }
    }
  }
  return schedule;
}

function estimateWorstCaseCost(maxUsd: number): number {
  const promptChars = tasksV1.reduce((sum, task) => sum + task.prompt.length, 0);
  const approxInputTokens = Math.ceil(promptChars / 4) * configV1.repetitions;
  const approxOutputTokens =
    configV1.maxOutputTokens * tasksV1.length * configV1.repetitions;

  let total = 0;
  for (const model of configV1.models) {
    total += estimateCostUsd(
      approxInputTokens,
      approxOutputTokens,
      model.pricing,
    );
  }

  if (total > maxUsd) {
    throw new Error(
      `Estimated worst-case cost $${total.toFixed(4)} exceeds --max-usd ${maxUsd}`,
    );
  }
  return total;
}

async function main() {
  await loadEnvLocal();
  const { maxUsd, dryRun } = parseArgs(process.argv.slice(2));

  if (!process.env.AI_GATEWAY_API_KEY && !dryRun) {
    throw new Error(
      "AI_GATEWAY_API_KEY is required. Set it in .env.local (never NEXT_PUBLIC_*).",
    );
  }

  const worstCase = estimateWorstCaseCost(maxUsd);
  const schedule = buildSchedule();
  const runId = `v1-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const outDir = path.join(process.cwd(), ".benchmark-runs", runId);
  await mkdir(outDir, { recursive: true });

  console.log(`Run ${runId}`);
  console.log(`Calls: ${schedule.length}`);
  console.log(`Worst-case estimate: $${worstCase.toFixed(4)} (cap $${maxUsd})`);
  if (dryRun) {
    console.log("Dry run only — no model calls.");
    return;
  }

  let spent = 0;
  const trials: TrialResult[] = [];

  for (const item of schedule) {
    const task = tasksV1.find((entry) => entry.id === item.taskId);
    const model = configV1.models.find(
      (entry) => entry.catalogSlug === item.catalogSlug,
    );
    if (!task || !model) {
      throw new Error("Invalid schedule item");
    }

    const remainingBudget = maxUsd - spent;
    const nextWorst =
      estimateCostUsd(800, configV1.maxOutputTokens, model.pricing) * 1.25;
    if (nextWorst > remainingBudget) {
      throw new Error(
        `Aborting before exceeding budget. Spent $${spent.toFixed(4)} / $${maxUsd}`,
      );
    }

    const started = Date.now();
    let text = "";
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      const result = await generateText({
        model: model.gatewayModelId,
        temperature: configV1.temperature,
        maxOutputTokens: configV1.maxOutputTokens,
        prompt: task.prompt,
        maxRetries: configV1.maxRetries,
      });
      text = result.text;
      inputTokens = result.usage.inputTokens ?? 0;
      outputTokens = result.usage.outputTokens ?? 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      text = "";
      console.error(
        `FAIL ${model.gatewayModelId} ${task.id}#${item.repetition}: ${message}`,
      );
    }

    const latencyMs = Date.now() - started;
    const estimatedCostUsd = estimateCostUsd(
      inputTokens,
      outputTokens,
      model.pricing,
    );
    spent += estimatedCostUsd;

    const { score, notes } = scoreDeterministic(task, text);
    const trial: TrialResult = {
      trialId: `${item.catalogSlug}__${task.id}__r${item.repetition}`,
      taskId: task.id,
      category: task.category,
      catalogSlug: item.catalogSlug,
      gatewayModelId: item.gatewayModelId,
      repetition: item.repetition,
      responseText: text,
      latencyMs,
      inputTokens,
      outputTokens,
      estimatedCostUsd: Number(estimatedCostUsd.toFixed(8)),
      deterministicScore: Number(score.toFixed(4)),
      objectiveNotes: notes,
      humanReviewScore: null,
      humanReviewNotes: null,
      qualityScore: Number(
        combineQualityScore(task, score, null).toFixed(4),
      ),
      finishedAt: new Date().toISOString(),
    };
    trials.push(trial);

    await writeFile(
      path.join(outDir, `${trial.trialId}.json`),
      `${JSON.stringify(trial, null, 2)}\n`,
      "utf8",
    );

    console.log(
      `OK ${trial.trialId} q=${trial.qualityScore} ${latencyMs}ms $${trial.estimatedCostUsd.toFixed(5)}`,
    );
  }

  const catalogModels = configV1.models.map((model) => {
    const catalog = getModelBySlug(model.catalogSlug);
    return {
      catalogSlug: model.catalogSlug,
      gatewayModelId: model.gatewayModelId,
      modelName: catalog?.name ?? model.catalogSlug,
      provider: catalog?.provider ?? "Other",
      pricing: model.pricing,
    };
  });

  const draft = {
    runId,
    benchmarkVersion: configV1.version,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    publishedAt: null,
    gitSha: process.env.GITHUB_SHA ?? null,
    promptHash: getPromptHash(),
    configHash: getConfigHash(),
    settings: {
      temperature: configV1.temperature,
      maxOutputTokens: configV1.maxOutputTokens,
      repetitions: configV1.repetitions,
      timeoutMs: configV1.timeoutMs,
    },
    models: catalogModels,
    trials,
    spentUsd: Number(spent.toFixed(6)),
    notes: [
      "Human review still required for writing and pt-br before publish.",
    ],
    limitations: configV1.limitations,
  };

  await writeFile(
    path.join(outDir, "draft.json"),
    `${JSON.stringify(draft, null, 2)}\n`,
    "utf8",
  );

  const reviewQueue = trials
    .filter((trial) => {
      const task = tasksV1.find((entry) => entry.id === trial.taskId);
      return task?.requiresHumanReview;
    })
    .map((trial, index) => ({
      reviewId: `R${String(index + 1).padStart(3, "0")}`,
      trialId: trial.trialId,
      taskId: trial.taskId,
      category: trial.category,
      responseText: trial.responseText,
      humanReviewScore: null,
      humanReviewNotes: null,
    }))
    .sort(() => Math.random() - 0.5);

  await writeFile(
    path.join(outDir, "human-review.template.json"),
    `${JSON.stringify(
      {
        runId,
        instructions:
          "Fill humanReviewScore (0-1) and optional notes. Keep reviewId order blinded — do not look up trialId model names while scoring.",
        reviews: reviewQueue,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Draft written to ${outDir}`);
  console.log(`Spent $${spent.toFixed(6)}`);
  console.log(
    "Next: fill human-review.template.json then run pnpm benchmark:publish --run <dir>",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
