# Adding a model

Semita has two catalog files:

| Kind | File |
|------|------|
| Cloud / API (`deployment: "api"` or `"both"`) | [`src/data/models.ts`](../src/data/models.ts) → `cloudModels` |
| Local / Ollama (`deployment: "local"` or `"both"`) | [`src/data/local-models.ts`](../src/data/local-models.ts) → `localModels` |

Shared types: [`src/data/types.ts`](../src/data/types.ts). Local hardware helpers: [`src/data/local-helpers.ts`](../src/data/local-helpers.ts).

## Cloud checklist

- [ ] Unique `slug` (kebab-case)
- [ ] Official `name`, `provider`, `releaseDate`
- [ ] `contextWindow`, `maxOutputTokens`
- [ ] `pricing.inputPerMillion` / `outputPerMillion` in USD from the provider’s pricing page
- [ ] `sources` with a pricing URL
- [ ] At least one benchmark with `sourceUrl`
- [ ] `content.en` and `content.pt-br` (summary, goodFor, strengths, communityNotes)
- [ ] `lastUpdated` set to the verification date (`YYYY-MM-DD`)
- [ ] `communityScore` is editorial for MVP (1.0–5.0) — see public `/score` methodology page
- [ ] `deployment: "api"` (or `"both"` if open weights + API)

## Local checklist

- [ ] Unique `slug`; prefer matching an Ollama library family when applicable
- [ ] `deployment: "local"` (or `"both"`)
- [ ] `local` via `localQ4(...)` (or custom) with `parameterCount`, `quantization`, `weightsUrl`, `comfortTiers`, `hardware`
- [ ] `ollamaTag` when the model is on [ollama.com/library](https://ollama.com/library)
- [ ] `sources` with a weights URL (Ollama and/or Hugging Face)
- [ ] Bilingual `content` EN + PT-BR
- [ ] Honest `communityScore` — no invented leaderboard numbers
- [ ] `lastUpdated` = verification date

### Scaffold from an Ollama tag

```bash
pnpm catalog:check          # see what's missing
pnpm catalog:add --tag qwen3:8b
```

Paste the stub into `local-models.ts`, replace TODOs, fix `provider` / modalities / score.

## Example cloud skeleton

```ts
{
  slug: "example-model",
  name: "Example Model",
  provider: "OpenAI",
  releaseDate: "2026-01-01",
  contextWindow: 128000,
  maxOutputTokens: 8192,
  pricing: { inputPerMillion: 1, outputPerMillion: 4, currency: "USD" },
  modalities: ["text", "code"],
  useCases: ["coding", "writing"],
  communityScore: 4.0,
  benchmarks: [
    { name: "MMLU", score: "~80%", sourceUrl: "https://example.com" },
  ],
  sources: [{ kind: "pricing", url: "https://example.com/pricing" }],
  lastUpdated: "2026-07-18",
  deployment: "api",
  content: {
    en: {
      summary: "...",
      goodFor: "...",
      strengths: ["..."],
      communityNotes: "...",
    },
    "pt-br": {
      summary: "...",
      goodFor: "...",
      strengths: ["..."],
      communityNotes: "...",
    },
  },
}
```

After editing, run `pnpm catalog:check && pnpm lint && pnpm build`.
