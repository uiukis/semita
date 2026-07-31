import type { HardwarePlatform, HardwareTier } from "./types";

export type HardwareRecipe = {
  id: string;
  tier: HardwareTier;
  platform: HardwarePlatform;
  exampleDevices: string[];
  featuredSlugs: string[];
};

export const hardwareRecipes: HardwareRecipe[] = [
  {
    id: "mac-16",
    tier: "entry",
    platform: "apple",
    exampleDevices: ["MacBook Air/Pro 16GB", "Mac mini M2 16GB"],
    featuredSlugs: [
      "gemma3-12b",
      "qwen3-8b",
      "phi4-mini",
      "granite3-3-8b",
      "smollm2-1-7b",
    ],
  },
  {
    id: "mac-32",
    tier: "mid",
    platform: "apple",
    exampleDevices: ["MacBook Pro 32GB", "Mac Studio 32GB+"],
    featuredSlugs: [
      "gemma4-26b",
      "qwen3-coder-30b",
      "llama4-scout",
      "magistral-24b",
      "devstral-24b",
    ],
  },
  {
    id: "rtx-3060-12",
    tier: "mid",
    platform: "nvidia",
    exampleDevices: ["RTX 3060 12GB", "RTX 4060 8–16GB class"],
    featuredSlugs: [
      "gemma3-12b",
      "qwen3-8b",
      "gpt-oss-20b",
      "qwen2-5vl-7b",
      "phi4-mini",
    ],
  },
  {
    id: "rtx-4090-24",
    tier: "heavy",
    platform: "nvidia",
    exampleDevices: ["RTX 4090 24GB", "RTX 5090 class"],
    featuredSlugs: [
      "qwen3-coder-30b",
      "llama4-scout",
      "deepseek-v3-1",
      "magistral-24b",
      "devstral-24b",
    ],
  },
  {
    id: "cpu-only",
    tier: "entry",
    platform: "cpu",
    exampleDevices: ["Laptop CPU-only", "Mini PC without discrete GPU"],
    featuredSlugs: ["smollm2-1-7b", "phi4-mini", "qwen3-8b", "granite3-3-8b"],
  },
];

export function hardwareRecipeHref(recipe: HardwareRecipe): string {
  const params = new URLSearchParams({
    host: "local",
    tier: recipe.tier,
    platform: recipe.platform,
    sort: "recommended",
  });
  return `/models?${params.toString()}`;
}
