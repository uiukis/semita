# Semita Mini Benchmark — methodology

A small, transparent task suite for Phase 1 (Choose). Maintainers run it privately; the site only renders versioned results checked into Git.

## What it is

- 10 short prompts across 5 categories: coding, reasoning, extraction, writing, pt-BR
- Same prompts and settings for every model
- Quality, latency and estimated cost reported **separately**
- No public live execution endpoint (credentials never leave maintainer machines)

## Models in v1

Pinned Vercel AI Gateway IDs (see `src/data/benchmark/config-v1.ts`):

| Catalog slug | Gateway model ID |
| --- | --- |
| `gpt-5` | `openai/gpt-5` |
| `claude-sonnet-5` | `anthropic/claude-sonnet-5` |
| `gemini-2-5-flash` | `google/gemini-2.5-flash` |
| `gpt-4o-mini` | `openai/gpt-4o-mini` |

## Settings

- Temperature `0`
- Max output tokens `512`
- `2` repetitions per model × task
- Interleaved schedule (task-major, models rotated)
- Default budget cap `--max-usd 2`

## Scoring

### Deterministic

- **Coding**: normalized exact match against the expected fix / Big-O answer
- **Reasoning**: exact name match or numeric tolerance
- **Extraction**: valid JSON + per-field accuracy

### Constrained + human (writing, pt-BR)

- 40% objective checks (required/forbidden phrases, word count, structure)
- 60% blinded human review (`0–1`) after responses are shuffled without model names
- Official runs require a completed `human-review.json` before publish

Macro quality is the equal-weight average of the five category averages. Latency uses median wall-clock ms on the maintainer network. Cost uses snapshotted list prices × reported tokens for that run only.

## Maintainer workflow

1. Create an AI Gateway key and put it in `.env.local` as `AI_GATEWAY_API_KEY` (never `NEXT_PUBLIC_*`).
2. Dry-run budget check:

```bash
pnpm benchmark:run --dry-run --max-usd 2
```

3. Execute:

```bash
pnpm benchmark:run --max-usd 2
```

4. Copy `.benchmark-runs/<id>/human-review.template.json` → `human-review.json`, fill scores blindly.
5. Publish:

```bash
pnpm benchmark:publish --run .benchmark-runs/<id>
```

6. Verify offline:

```bash
pnpm benchmark:check
```

Staging files under `.benchmark-runs/` are gitignored. Only sanitized JSON under `src/data/benchmark/results/` is committed.

## Limitations

- Tiny sample — not a substitute for public leaderboards
- Latency is not a provider SLA
- Writing / pt-BR include subjective human judgment
- Results apply only to pinned Gateway IDs and frozen prices in that run

## Contributing

- Propose prompt/rubric changes via PR against `src/data/benchmark/tasks-v1.ts`
- Challenge published scores with sources via a GitHub issue
- Do not open PRs that invent unpublished “demo” results
