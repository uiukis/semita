import type { LlmModel } from "../../src/data/types";

const LIBRARY_URL = "https://ollama.com/library";
const STALE_DAYS = 60;
const USER_AGENT = "semita-catalog-check/1.0 (+https://github.com/uiukis/semita)";

export { STALE_DAYS, LIBRARY_URL };

export function baseTag(tag: string): string {
  return tag.split(":")[0]?.trim().toLowerCase() ?? "";
}

export function catalogOllamaBases(models: LlmModel[]): Set<string> {
  const bases = new Set<string>();
  for (const model of models) {
    if (model.local?.ollamaTag) {
      bases.add(baseTag(model.local.ollamaTag));
    }
    for (const source of model.sources) {
      const match = source.url.match(/ollama\.com\/library\/([a-zA-Z0-9._-]+)/i);
      if (match?.[1]) {
        bases.add(match[1].toLowerCase());
      }
    }
    if (model.local?.weightsUrl) {
      const match = model.local.weightsUrl.match(
        /ollama\.com\/library\/([a-zA-Z0-9._-]+)/i,
      );
      if (match?.[1]) {
        bases.add(match[1].toLowerCase());
      }
    }
  }
  return bases;
}

export async function fetchOllamaLibraryFamilies(): Promise<string[]> {
  const response = await fetch(LIBRARY_URL, {
    headers: { "user-agent": USER_AGENT, accept: "text/html" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${LIBRARY_URL}: HTTP ${response.status}`);
  }
  const html = await response.text();
  const families = new Set<string>();
  for (const match of html.matchAll(/href="\/library\/([a-zA-Z0-9._-]+)"/g)) {
    const name = match[1]?.toLowerCase();
    if (name) {
      families.add(name);
    }
  }
  return [...families].sort();
}

export function daysSince(isoDate: string, now = new Date()): number {
  const then = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(then.getTime())) {
    return Number.POSITIVE_INFINITY;
  }
  const ms = now.getTime() - then.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function todayIso(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function inferParamCount(tag: string): string {
  const lower = tag.toLowerCase();
  const match =
    lower.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)b\b/) ??
    lower.match(/(\d+(?:\.\d+)?)b\b/) ??
    lower.match(/:(\d+(?:\.\d+)?)b\b/);
  if (match?.[2]) {
    return `${match[1]}x${match[2]}B MoE`;
  }
  if (match?.[1]) {
    return `${match[1]}B`;
  }
  if (/\d+m\b/.test(lower)) {
    const m = lower.match(/(\d+)m\b/);
    return m ? `${m[1]}M` : "unknown";
  }
  return "unknown";
}

export function inferHardwarePreset(paramCount: string): {
  comfort: ("entry" | "mid" | "heavy")[];
  preset: "tiny" | "entry" | "mid" | "heavy" | "cluster";
} {
  const lower = paramCount.toLowerCase();
  if (lower.includes("m") && !lower.includes("b")) {
    return { comfort: ["entry", "mid", "heavy"], preset: "tiny" };
  }
  const num = Number.parseFloat(lower.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(num)) {
    return { comfort: ["mid", "heavy"], preset: "mid" };
  }
  if (lower.includes("moe") || lower.includes("x")) {
    if (num >= 100) {
      return { comfort: ["heavy"], preset: "cluster" };
    }
    return { comfort: ["heavy"], preset: "heavy" };
  }
  if (num <= 4) {
    return { comfort: ["entry", "mid", "heavy"], preset: "tiny" };
  }
  if (num <= 9) {
    return { comfort: ["entry", "mid", "heavy"], preset: "entry" };
  }
  if (num <= 14) {
    return { comfort: ["mid", "heavy"], preset: "mid" };
  }
  if (num <= 34) {
    return { comfort: ["heavy"], preset: "heavy" };
  }
  return { comfort: ["heavy"], preset: "cluster" };
}

export function slugFromTag(tag: string): string {
  return baseTag(tag)
    .replace(/\./g, "-")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export function displayNameFromTag(tag: string): string {
  const base = baseTag(tag);
  const size = tag.includes(":") ? tag.split(":")[1] : "";
  const prettyBase = base
    .split("-")
    .map((part) => {
      if (/^qwen\d/i.test(part) || /^llama\d/i.test(part) || /^gemma\d/i.test(part)) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      if (/^\d/.test(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
  if (!size || size === "latest") {
    return prettyBase;
  }
  return `${prettyBase} ${size.toUpperCase()}`;
}
