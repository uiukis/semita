# Contributing to Semita

Thanks for helping build a clearer path through AI.

## Ways to contribute

- **Model data (easiest)** — open a [Data update issue](https://github.com/uiukis/semita/issues/new?template=data_update.md); no code required
- **Code** — UI, filters, i18n, SEO, tooling
- **Copy** — English / Portuguese (Brazil) strings in `messages/`
- **Issues** — bugs, outdated prices, missing models

## Quick start

```bash
pnpm install
pnpm dev
```

App runs at [http://localhost:3100](http://localhost:3100).

```bash
pnpm lint
pnpm build
```

## Adding or updating a model

**Prefer the issue template** if you only need a price/benchmark fix.

For a full PR:

1. Edit `src/data/models.ts` (see [docs/adding-a-model.md](docs/adding-a-model.md) and [docs/keeping-data-fresh.md](docs/keeping-data-fresh.md)).
2. Fill **both** `en` and `pt-br` content blocks.
3. Set `pricing`, `sources` and `lastUpdated` from official docs.
4. Keep `communityScore` as an **editorial Semita score** (methodology: `/score`) — not live votes.
5. Run `pnpm lint && pnpm build`.

## Pull requests

- Keep PRs focused and small.
- Prefer conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.
- Describe what changed and how you verified it.
- Do not invent benchmarks or prices — cite sources.

## Code of conduct

Be kind. Critique ideas and data, not people. AI should leverage humans — same for this community.
