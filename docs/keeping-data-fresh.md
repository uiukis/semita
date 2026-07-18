# Keeping model data fresh

Semita’s catalog lives in Git: [`src/data/models.ts`](../src/data/models.ts).

## Monthly checklist

1. Open each model’s `sources[].url` (pricing) and re-check list prices.
2. Update `pricing.inputPerMillion` / `outputPerMillion` if they changed.
3. Refresh at least one `benchmarks[]` entry when the provider publishes new numbers.
4. Set `lastUpdated` to today’s date (`YYYY-MM-DD`).
5. Adjust `communityScore` only if the editorial take clearly changed — and update the score page rationale if needed.
6. Run `pnpm lint && pnpm build`.
7. Open a focused PR (`docs:` or `chore:` for data-only).

## Faster path (no code)

Use the [Data update](https://github.com/uiukis/semita/issues/new?template=data_update.md) issue template with:

- model slug
- wrong value → correct value
- official URL + date checked

Maintainers can land the change in `models.ts` from the issue.

## Adding a brand-new model

Follow [adding-a-model.md](./adding-a-model.md) — both `en` and `pt-br` content blocks are required.
