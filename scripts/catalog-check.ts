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
  const stale = localish
    .map((model) => ({
      slug: model.slug,
      lastUpdated: model.lastUpdated,
      ageDays: daysSince(model.lastUpdated),
      ollamaTag: model.local?.ollamaTag ?? null,
    }))
    .filter((row) => row.ageDays > STALE_DAYS)
    .sort((a, b) => b.ageDays - a.ageDays);

  console.log("Semita catalog × Ollama library");
  console.log("================================");
  console.log(`Ollama library families : ${library.length}`);
  console.log(`Covered by Semita       : ${covered.length}`);
  console.log(`Missing in Semita       : ${missing.length}`);
  console.log(`Local/both models       : ${localish.length}`);
  console.log(`Stale (>${STALE_DAYS}d)           : ${stale.length}`);
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

  if (stale.length > 0) {
    console.log(`Stale local/both entries (lastUpdated > ${STALE_DAYS} days)`);
    console.log("-------------------------------------------------------");
    for (const row of stale) {
      const tag = row.ollamaTag ? ` · ${row.ollamaTag}` : "";
      console.log(
        `  - ${row.slug}${tag}  (${row.lastUpdated}, ${row.ageDays}d)`,
      );
    }
    console.log("");
  }

  console.log(
    `ok: ${covered.length} covered · ${missing.length} missing · ${stale.length} stale`,
  );

  if (failOnMissing && missing.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
