# Contributing to Semita

Thanks for helping build a clearer path through AI.

## Ways to contribute

- **Code** — UI, filters, i18n, SEO, tooling
- **Model data** — pricing, context, benchmarks, sources
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

1. Edit `src/data/models.ts` (or follow [docs/adding-a-model.md](docs/adding-a-model.md)).
2. Fill **both** `en` and `pt-br` content blocks.
3. Set `pricing`, `sources` and `lastUpdated` from official docs.
4. Keep `communityScore` as an **editorial Semita score** for the MVP (not live votes).
5. Run `pnpm lint && pnpm build`.

## Pull requests

- Keep PRs focused and small.
- Prefer conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.
- Describe what changed and how you verified it.
- Do not invent benchmarks or prices — cite sources.

## Code of conduct

Be kind. Critique ideas and data, not people. AI should leverage humans — same for this community.
