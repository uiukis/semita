import { getAllModels } from "../src/data/models";
import {
  STALE_DAYS,
  catalogOllamaBases,
  daysSince,
  fetchOllamaLibraryFamilies,
} from "./lib/catalog-shared";

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main(): Promise<void> {
  const failOnMissing = hasFlag("--fail-on-missing");
  const models = getAllModels();
  const bases = catalogOllamaBases(models);
  const library = await fetchOllamaLibraryFamilies();

  const missing = library.filter((name) => !bases.has(name));
  const covered = library.filter((name) => bases.has(name));

  const localish = models.filter(
    (model) => model.deployment === "local" || model.deployment === "both",
  );
  const cloudish = models.filter(
    (model) => model.deployment === "api" || model.deployment === "both",
  );
  const staleLocal = localish
    .map((model) => ({
      slug: model.slug,
      lastUpdated: model.lastUpdated,
      ageDays: daysSince(model.lastUpdated),
      ollamaTag: model.local?.ollamaTag ?? null,
    }))
    .filter((row) => row.ageDays > STALE_DAYS)
    .sort((a, b) => b.ageDays - a.ageDays);

  const staleCloud = cloudish
    .map((model) => ({
      slug: model.slug,
      lastUpdated: model.lastUpdated,
      ageDays: daysSince(model.lastUpdated),
      provider: model.provider,
    }))
    .filter((row) => row.ageDays > STALE_DAYS)
    .sort((a, b) => b.ageDays - a.ageDays);

  console.log("Semita catalog × Ollama library");
  console.log("================================");
  console.log(`Ollama library families : ${library.length}`);
  console.log(`Covered by Semita       : ${covered.length}`);
  console.log(`Missing in Semita       : ${missing.length}`);
  console.log(`Local/both models       : ${localish.length}`);
  console.log(`Cloud/both models       : ${cloudish.length}`);
  console.log(`Stale local (>${STALE_DAYS}d)     : ${staleLocal.length}`);
  console.log(`Stale cloud (>${STALE_DAYS}d)     : ${staleCloud.length}`);
  console.log("");

  if (missing.length > 0) {
    console.log("Missing (in Ollama, not in Semita)");
    console.log("----------------------------------");
    for (const name of missing) {
      console.log(`  - ${name}   https://ollama.com/library/${name}`);
    }
    console.log("");
    console.log(
      "Tip: scaffold with  pnpm catalog:add --tag <name>[:size]  then paste into src/data/local-models.ts",
    );
    console.log("");
  }

  if (staleLocal.length > 0) {
    console.log(`Stale local/both entries (lastUpdated > ${STALE_DAYS} days)`);
    console.log("-------------------------------------------------------");
    for (const row of staleLocal) {
      const tag = row.ollamaTag ? ` · ${row.ollamaTag}` : "";
      console.log(
        `  - ${row.slug}${tag}  (${row.lastUpdated}, ${row.ageDays}d)`,
      );
    }
    console.log("");
  }

  if (staleCloud.length > 0) {
    console.log(`Stale cloud/both entries (lastUpdated > ${STALE_DAYS} days)`);
    console.log("-------------------------------------------------------");
    for (const row of staleCloud) {
      console.log(
        `  - ${row.slug} · ${row.provider}  (${row.lastUpdated}, ${row.ageDays}d)`,
      );
    }
    console.log("");
    console.log(
      "Tip: refresh pricing/context from the provider page, bump lastUpdated, open a data_update issue if unsure.",
    );
    console.log("");
  }

  console.log(
    `ok: ${covered.length} covered · ${missing.length} missing · ${staleLocal.length} stale local · ${staleCloud.length} stale cloud`,
  );

  if (failOnMissing && missing.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
