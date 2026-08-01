import { configLocalV1 } from "../src/data/benchmark/config-local-v1";
import { configV1 } from "../src/data/benchmark/config-v1";

export type SuiteProfile = "gateway" | "local-ollama";

export type SuiteConfig = typeof configV1 | typeof configLocalV1;

export function getSuiteConfig(profile: SuiteProfile): SuiteConfig {
  return profile === "local-ollama" ? configLocalV1 : configV1;
}

export function detectProfileFromDraft(draft: {
  notes?: string[];
  models?: Array<{ gatewayModelId?: string }>;
  configHash?: string;
}): SuiteProfile {
  if (draft.notes?.some((note) => note.includes("profile:local-ollama"))) {
    return "local-ollama";
  }
  const firstId = draft.models?.[0]?.gatewayModelId ?? "";
  if (firstId.startsWith("ollama/")) {
    return "local-ollama";
  }
  return "gateway";
}

export function profileNote(profile: SuiteProfile): string {
  return `profile:${profile}`;
}
