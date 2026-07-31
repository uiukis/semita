# Keeping model data fresh

Semita’s catalog lives in Git:

- Cloud / API models → [`src/data/models.ts`](../src/data/models.ts) (`cloudModels`)
- Local / Ollama models → [`src/data/local-models.ts`](../src/data/local-models.ts)

## Weekly: discover new Ollama models

```bash
pnpm catalog:check
```

This fetches [ollama.com/library](https://ollama.com/library) (no API key) and reports:

- **missing** — in the Ollama library, not covered by Semita (`ollamaTag` or `ollama.com/library/…` URLs)
- **stale local** — local/both entries with `lastUpdated` older than 60 days
- **stale cloud** — api/both entries with `lastUpdated` older than 60 days (pricing/context refresh cue)

Faster contribution UX: [/contribute](https://semita-nu.vercel.app/contribute) prefills a GitHub data-update issue.

To scaffold a stub for a missing tag:

```bash
pnpm catalog:add --tag gemma3:12b
```

Paste into `local-models.ts`, fill TODOs (EN + PT-BR), set an honest `communityScore`, then `pnpm lint && pnpm build`.

Optional CI gate later: `pnpm catalog:check --fail-on-missing` (not enabled by default).

## Monthly checklist (pricing + sources)

1. Open each cloud model’s `sources[].url` (pricing) and re-check list prices.
2. Update `pricing.inputPerMillion` / `outputPerMillion` if they changed.
3. Refresh at least one `benchmarks[]` entry when the provider publishes new numbers.
4. For local models: confirm `ollamaTag` still pulls, and hardware comfort tiers still match the listed quantization.
5. Set `lastUpdated` to today’s date (`YYYY-MM-DD`).
6. Adjust `communityScore` only if the editorial take clearly changed — and update the score page rationale if needed.
7. Run `pnpm catalog:check && pnpm lint && pnpm build`.
8. Open a focused PR (`docs:` or `chore:` for data-only).

## Faster path (no code)

Use the [Data update](https://github.com/uiukis/semita/issues/new?template=data_update.md) issue template with:

- model slug / Ollama tag
- wrong value → correct value (or “missing from catalog”)
- official URL + date checked
- for local models: VRAM tier / platform notes if relevant

Maintainers can land the change in `models.ts` or `local-models.ts` from the issue.

## Adding a brand-new model

Follow [adding-a-model.md](./adding-a-model.md) — both `en` and `pt-br` content blocks are required. Never invent benchmark numbers.
