import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getModelBySlug } from "../src/data/models";
import {
  BenchmarkRunSchema,
  type BenchmarkRun,
  type TrialResult,
} from "../src/data/benchmark/types";
import { configV1 } from "../src/data/benchmark/config-v1";
import { getConfigHash, getPromptHash } from "./hash";
import {
  aggregateModel,
  combineQualityScore,
  recomputeTrialQuality,
  scoreDeterministic,
} from "./scoring";
import { tasksV1 } from "../src/data/benchmark/tasks-v1";

function parseArgs(argv: string[]): { runDir: string } {
  const index = argv.indexOf("--run");
  if (index === -1 || !argv[index + 1]) {
    throw new Error("Usage: pnpm benchmark:publish --run .benchmark-runs/<id>");
  }
  return { runDir: path.resolve(argv[index + 1]) };
}

type HumanReviewFile = {
  runId: string;
  reviews: Array<{
    reviewId: string;
    trialId: string;
    humanReviewScore: number | null;
    humanReviewNotes: string | null;
  }>;
};

async function loadTrials(runDir: string): Promise<TrialResult[]> {
  const draftPath = path.join(runDir, "draft.json");
  try {
    const draft = JSON.parse(await readFile(draftPath, "utf8")) as {
      trials: TrialResult[];
    };
    return draft.trials;
  } catch {
    const files = await readdir(runDir);
    const trialFiles = files.filter(
      (file) => file.endsWith(".json") && file.includes("__"),
    );
    const trials: TrialResult[] = [];
    for (const file of trialFiles) {
      trials.push(
        JSON.parse(await readFile(path.join(runDir, file), "utf8")) as TrialResult,
      );
    }
    return trials;
  }
}

async function main() {
  const { runDir } = parseArgs(process.argv.slice(2));
  let trials = await loadTrials(runDir);

  const reviewPath = path.join(runDir, "human-review.json");
  let reviewFile: HumanReviewFile | null = null;
  try {
    reviewFile = JSON.parse(
      await readFile(reviewPath, "utf8"),
    ) as HumanReviewFile;
  } catch {
    reviewFile = null;
  }

  const subjectiveTasks = new Set(
    tasksV1.filter((task) => task.requiresHumanReview).map((task) => task.id),
  );
  const subjectiveTrials = trials.filter((trial) =>
    subjectiveTasks.has(trial.taskId),
  );

  if (subjectiveTrials.length > 0) {
    if (!reviewFile) {
      throw new Error(
        `Missing ${reviewPath}. Copy human-review.template.json and fill scores.`,
      );
    }
    const byTrial = new Map(
      reviewFile.reviews.map((review) => [review.trialId, review]),
    );
    for (const trial of subjectiveTrials) {
      const review = byTrial.get(trial.trialId);
      if (
        !review ||
        review.humanReviewScore == null ||
        !Number.isFinite(review.humanReviewScore) ||
        review.humanReviewScore < 0 ||
        review.humanReviewScore > 1
      ) {
        throw new Error(`Incomplete human review for ${trial.trialId}`);
      }
      trial.humanReviewScore = review.humanReviewScore;
      trial.humanReviewNotes = review.humanReviewNotes;
    }
  }

  trials = trials.map((trial) => {
    const task = tasksV1.find((entry) => entry.id === trial.taskId);
    if (!task) {
      throw new Error(`Unknown task ${trial.taskId}`);
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
  });

  const models = configV1.models.map((model) => {
    const catalog = getModelBySlug(model.catalogSlug);
    const modelTrials = trials.filter(
      (trial) => trial.catalogSlug === model.catalogSlug,
    );
    return aggregateModel(
      model.catalogSlug,
      model.gatewayModelId,
      catalog?.name ?? model.catalogSlug,
      catalog?.provider ?? "Other",
      model.pricing,
      modelTrials,
    );
  });

  const runId = path.basename(runDir);
  const published: BenchmarkRun = {
    runId,
    benchmarkVersion: "v1",
    status: "published",
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    gitSha: process.env.GITHUB_SHA ?? null,
    promptHash: getPromptHash(),
    configHash: getConfigHash(),
    settings: {
      temperature: configV1.temperature,
      maxOutputTokens: configV1.maxOutputTokens,
      repetitions: configV1.repetitions,
      timeoutMs: configV1.timeoutMs,
    },
    models,
    trials: trials.map((trial) => recomputeTrialQuality(trial)),
    notes: [
      "Official Semita Mini Benchmark run. Quality, latency and cost are reported separately.",
    ],
    limitations: configV1.limitations,
  };

  const parsed = BenchmarkRunSchema.parse(published);
  const resultsDir = path.join(
    process.cwd(),
    "src/data/benchmark/results",
    "v1",
  );
  await mkdir(resultsDir, { recursive: true });
  const outFile = path.join(resultsDir, `${parsed.runId}.json`);
  await writeFile(outFile, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");

  const latestTs = `import type { BenchmarkRun } from "../types";
import run from "./v1/${parsed.runId}.json";

export const latestBenchmarkRun = run as BenchmarkRun;
export const hasPublishedBenchmarkRun = true;
`;
  await writeFile(
    path.join(process.cwd(), "src/data/benchmark/results/latest.ts"),
    latestTs,
    "utf8",
  );

  console.log(`Published ${outFile}`);
  console.log("Updated src/data/benchmark/results/latest.ts");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
