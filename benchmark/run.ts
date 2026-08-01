import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateText } from "ai";
import { getModelBySlug } from "../src/data/models";
import type { TrialResult } from "../src/data/benchmark/types";
import {
  assertOllamaReady,
  generateWithOllama,
  listOllamaTags,
  resolveInstalledTag,
} from "./ollama";
import { getConfigHash, getPromptHash } from "./hash";
import {
  combineQualityScore,
  estimateCostUsd,
  scoreDeterministic,
} from "./scoring";
import { getSuiteConfig, profileNote, type SuiteProfile } from "./suite";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";
import { ollamaTagFromGatewayId } from "../src/data/benchmark/config-local-v1";

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
  profile: SuiteProfile;
  repetitions: number | null;
} {
  let profile: SuiteProfile = "gateway";
  let dryRun = false;
  let maxUsd: number | null = null;
  let repetitions: number | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
    }
    if (arg === "--local-ollama") {
      profile = "local-ollama";
    }
    if (arg === "--profile") {
      const next = argv[i + 1];
      if (next !== "gateway" && next !== "local-ollama") {
        throw new Error("--profile must be gateway or local-ollama");
      }
      profile = next;
      i += 1;
    }
    if (arg === "--max-usd") {
      const next = Number(argv[i + 1]);
      if (!Number.isFinite(next) || next < 0) {
        throw new Error("--max-usd must be a number >= 0");
      }
      maxUsd = next;
      i += 1;
    }
    if (arg === "--reps") {
      const next = Number(argv[i + 1]);
      if (!Number.isInteger(next) || next < 1) {
        throw new Error("--reps must be a positive integer");
      }
      repetitions = next;
      i += 1;
    }
  }

  const config = getSuiteConfig(profile);
  return {
    profile,
    dryRun,
    maxUsd: maxUsd ?? config.defaultMaxUsd,
    repetitions,
  };
}

function buildSchedule(
  profile: SuiteProfile,
  repetitions: number,
) {
  const config = getSuiteConfig(profile);
  const schedule: Array<{
    catalogSlug: string;
    gatewayModelId: string;
    taskId: string;
    repetition: number;
  }> = [];

  for (let repetition = 1; repetition <= repetitions; repetition += 1) {
    for (const task of tasksV1) {
      for (const model of config.models) {
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

function estimateWorstCaseCost(profile: SuiteProfile, maxUsd: number): number {
  const config = getSuiteConfig(profile);
  if (profile === "local-ollama") {
    return 0;
  }

  const promptChars = tasksV1.reduce((sum, task) => sum + task.prompt.length, 0);
  const approxInputTokens = Math.ceil(promptChars / 4) * config.repetitions;
  const approxOutputTokens =
    config.maxOutputTokens * tasksV1.length * config.repetitions;

  let total = 0;
  for (const model of config.models) {
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
  const parsed = parseArgs(process.argv.slice(2));
  const config = getSuiteConfig(parsed.profile);
  const repetitions = parsed.repetitions ?? config.repetitions;

  if (parsed.profile === "gateway") {
    const hasGatewayAuth = Boolean(
      process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
    );
    if (!hasGatewayAuth && !parsed.dryRun) {
      throw new Error(
        "Gateway auth required, or use free mode: pnpm benchmark:run --local-ollama",
      );
    }
  } else if (!parsed.dryRun) {
    await assertOllamaReady(
      "ollamaBaseUrl" in config ? config.ollamaBaseUrl : undefined,
    );
    const installed = await listOllamaTags(
      "ollamaBaseUrl" in config ? config.ollamaBaseUrl : undefined,
    );
    const missing: string[] = [];
    for (const model of config.models) {
      const wanted = ollamaTagFromGatewayId(model.gatewayModelId);
      if (!resolveInstalledTag(wanted, installed)) {
        missing.push(wanted);
      }
    }
    if (missing.length > 0) {
      throw new Error(
        `Missing Ollama models:\n${missing.map((tag) => `  ollama pull ${tag}`).join("\n")}`,
      );
    }
  }

  const worstCase = estimateWorstCaseCost(parsed.profile, parsed.maxUsd);
  const schedule = buildSchedule(parsed.profile, repetitions);
  const runId = `${parsed.profile === "local-ollama" ? "local" : "v1"}-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}`;
  const outDir = path.join(process.cwd(), ".benchmark-runs", runId);
  await mkdir(outDir, { recursive: true });

  console.log(`Run ${runId}`);
  console.log(`Profile: ${parsed.profile}`);
  console.log(`Calls: ${schedule.length}`);
  console.log(
    parsed.profile === "local-ollama"
      ? "Cost: $0 (local Ollama)"
      : `Worst-case estimate: $${worstCase.toFixed(4)} (cap $${parsed.maxUsd})`,
  );
  if (parsed.dryRun) {
    console.log("Dry run only — no model calls.");
    return;
  }

  let spent = 0;
  const trials: TrialResult[] = [];
  const resolvedIds = new Map<string, string>();

  if (parsed.profile === "local-ollama") {
    const installed = await listOllamaTags(
      "ollamaBaseUrl" in config ? config.ollamaBaseUrl : undefined,
    );
    for (const model of config.models) {
      const wanted = ollamaTagFromGatewayId(model.gatewayModelId);
      const resolved = resolveInstalledTag(wanted, installed);
      if (!resolved) {
        throw new Error(`Missing Ollama model ${wanted}`);
      }
      resolvedIds.set(model.gatewayModelId, `ollama/${resolved}`);
    }
  }

  for (const item of schedule) {
    const task = tasksV1.find((entry) => entry.id === item.taskId);
    const model = config.models.find(
      (entry) => entry.catalogSlug === item.catalogSlug,
    );
    if (!task || !model) {
      throw new Error("Invalid schedule item");
    }

    const gatewayModelId =
      resolvedIds.get(item.gatewayModelId) ?? item.gatewayModelId;

    if (parsed.profile === "gateway") {
      const remainingBudget = parsed.maxUsd - spent;
      const nextWorst =
        estimateCostUsd(800, config.maxOutputTokens, model.pricing) * 1.25;
      if (nextWorst > remainingBudget) {
        throw new Error(
          `Aborting before exceeding budget. Spent $${spent.toFixed(4)} / $${parsed.maxUsd}`,
        );
      }
    }

    const started = Date.now();
    let text = "";
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      if (parsed.profile === "local-ollama") {
        const result = await generateWithOllama({
          gatewayModelId,
          prompt: task.prompt,
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          timeoutMs: config.timeoutMs,
          baseUrl:
            "ollamaBaseUrl" in config ? config.ollamaBaseUrl : undefined,
        });
        text = result.text;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
      } else {
        const result = await generateText({
          model: gatewayModelId,
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          prompt: task.prompt,
          maxRetries: config.maxRetries,
        });
        text = result.text;
        inputTokens = result.usage.inputTokens ?? 0;
        outputTokens = result.usage.outputTokens ?? 0;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      text = "";
      console.error(
        `FAIL ${gatewayModelId} ${task.id}#${item.repetition}: ${message}`,
      );
    }

    const latencyMs = Date.now() - started;
    const estimatedCostUsd =
      parsed.profile === "local-ollama"
        ? 0
        : estimateCostUsd(inputTokens, outputTokens, model.pricing);
    spent += estimatedCostUsd;

    const { score, notes } = scoreDeterministic(task, text);
    const trial: TrialResult = {
      trialId: `${item.catalogSlug}__${task.id}__r${item.repetition}`,
      taskId: task.id,
      category: task.category,
      catalogSlug: item.catalogSlug,
      gatewayModelId,
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
      qualityScore: Number(combineQualityScore(task, score, null).toFixed(4)),
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

  const catalogModels = config.models.map((model) => {
    const catalog = getModelBySlug(model.catalogSlug);
    const gatewayModelId =
      resolvedIds.get(model.gatewayModelId) ?? model.gatewayModelId;
    return {
      catalogSlug: model.catalogSlug,
      gatewayModelId,
      modelName: catalog?.name ?? model.catalogSlug,
      provider: catalog?.provider ?? "Other",
      pricing: model.pricing,
    };
  });

  const draft = {
    runId,
    benchmarkVersion: config.version,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    publishedAt: null,
    gitSha: process.env.GITHUB_SHA ?? null,
    promptHash: getPromptHash(),
    configHash: getConfigHash(config),
    settings: {
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
      repetitions,
      timeoutMs: config.timeoutMs,
    },
    models: catalogModels,
    trials,
    spentUsd: Number(spent.toFixed(6)),
    notes: [
      profileNote(parsed.profile),
      "Human review still required for writing and pt-br before publish.",
      parsed.profile === "local-ollama"
        ? "Free local Ollama suite — not interchangeable with Gateway cloud results."
        : "Cloud Gateway suite.",
    ],
    limitations: config.limitations,
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
