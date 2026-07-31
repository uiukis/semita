import {
  displayNameFromTag,
  inferHardwarePreset,
  inferParamCount,
  slugFromTag,
  todayIso,
} from "./lib/catalog-shared";

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function hardwareBlock(preset: ReturnType<typeof inferHardwarePreset>["preset"]): string {
  switch (preset) {
    case "tiny":
      return `[
        cpuOnly(8, ["Any modern laptop"]),
        nvidiaEntry8(),
        appleEntry16(),
      ]`;
    case "entry":
      return `[
        nvidiaEntry8(),
        amdMid16(),
        appleEntry16(),
        cpuOnly(16, ["Desktop/laptop 16GB+ RAM (slow)"]),
      ]`;
    case "mid":
      return `[
        nvidiaMid12(),
        amdMid16(),
        appleMid32(),
      ]`;
    case "heavy":
      return `[
        nvidiaHeavy24(),
        appleHeavy64(),
        amdMid16(),
      ]`;
    case "cluster":
      return `[
        hw("heavy", "nvidia", 256, ["Multi-GPU workstation / cloud GPUs"], {
          minVramGb: 80,
          notesEn: "Not a laptop model — needs serious VRAM or a hosted endpoint.",
          notesPt: "Não é modelo de notebook — precisa de VRAM séria ou endpoint hospedado.",
        }),
      ]`;
  }
}

function main(): void {
  const tag = readArg("--tag");
  if (!tag) {
    console.error("Usage: pnpm catalog:add --tag <ollamaTag>");
    console.error("Example: pnpm catalog:add --tag gemma3:12b");
    process.exitCode = 1;
    return;
  }

  const base = tag.split(":")[0]!;
  const paramCount = inferParamCount(tag);
  const { comfort, preset } = inferHardwarePreset(paramCount);
  const slug = slugFromTag(tag.includes(":") ? tag : `${tag}`);
  const name = displayNameFromTag(tag);
  const today = todayIso();
  const comfortLiteral = comfort.map((tier) => `"${tier}"`).join(", ");
  const libraryUrl = `https://ollama.com/library/${base}`;

  const stub = `  {
    slug: "${slug}${tag.includes(":") && !tag.endsWith(":latest") ? `-${tag.split(":")[1]?.replace(/\./g, "-")}` : ""}",
    name: "${name}",
    provider: "Other",
    releaseDate: "${today}",
    contextWindow: 128000,
    maxOutputTokens: 8192,
    pricing: { inputPerMillion: 0, outputPerMillion: 0, currency: "USD" },
    modalities: ["text", "code"],
    useCases: ["local", "cost-effective"],
    communityScore: 4.0,
    benchmarks: [
      {
        name: "Ollama library",
        score: "See model card",
        sourceUrl: "${libraryUrl}",
      },
    ],
    sources: [
      { kind: "weights", url: "${libraryUrl}" },
    ],
    lastUpdated: "${today}",
    deployment: "local",
    local: localQ4(
      "${paramCount}",
      "${libraryUrl}",
      [${comfortLiteral}],
      ${hardwareBlock(preset)},
      {
        ollamaTag: "${tag.includes(":") ? tag : `${tag}:latest`}",
        tipsEn: "TODO: practical local tip in English.",
        tipsPt: "TODO: dica prática local em português.",
      },
    ),
    content: {
      en: {
        summary: "TODO: one-sentence English summary.",
        goodFor: "TODO: who should pick this locally.",
        strengths: ["TODO strength 1", "TODO strength 2", "TODO strength 3"],
        communityNotes: "TODO: honest editorial note.",
      },
      "pt-br": {
        summary: "TODO: resumo em uma frase.",
        goodFor: "TODO: para quem faz sentido localmente.",
        strengths: ["TODO força 1", "TODO força 2", "TODO força 3"],
        communityNotes: "TODO: nota editorial honesta.",
      },
    },
  },`;

  console.log("// Paste into src/data/local-models.ts (inside localModels array)");
  console.log("// Then fill TODOs, fix provider/modalities/score, run pnpm lint && pnpm build");
  console.log("");
  console.log(stub);
}

main();
