# Adding a model

Models live in [`src/data/models.ts`](../src/data/models.ts).

## Checklist

- [ ] Unique `slug` (kebab-case)
- [ ] Official `name`, `provider`, `releaseDate`
- [ ] `contextWindow`, `maxOutputTokens`
- [ ] `pricing.inputPerMillion` / `outputPerMillion` in USD from the provider’s pricing page
- [ ] `sources` with a pricing URL
- [ ] At least one benchmark with `sourceUrl`
- [ ] `content.en` and `content.pt-br` (summary, goodFor, strengths, communityNotes)
- [ ] `lastUpdated` set to the verification date (`YYYY-MM-DD`)
- [ ] `communityScore` is editorial for MVP (1.0–5.0) — see public `/score` methodology page

## Example skeleton

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

After editing, run `pnpm lint && pnpm build`.
