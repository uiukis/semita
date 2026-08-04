# Run the Semita Mini Benchmark locally (dev tutorial)

This guide is for **developers / maintainers** who want to reproduce or publish a **local Ollama** Mini Bench run on their own machine — **$0 API spend**.

The live site never calls your laptop. You run models offline, review writing/pt-BR by hand, then commit sanitized JSON under `src/data/benchmark/results/`.

> Prefer this path over Vercel AI Gateway (Gateway needs a credit card for free credits).

## What you get

- Same 10 public prompts as the suite (`src/data/benchmark/tasks-v1.ts`)
- Three small local models (see `src/data/benchmark/config-local-v1.ts`):
  - `smollm2:1.7b` (~1.8 GB)
  - `phi4-mini:3.8b` (~2.5 GB)
  - `qwen3:8b` (~5.2 GB)
- Draft under `.benchmark-runs/<id>/` (gitignored)
- Optional publish to Git so [/benchmark](https://semita-nu.vercel.app/benchmark) shows your machine + lab notes

## Prerequisites

| Need | Notes |
| --- | --- |
| Node 20+ / pnpm | Same as the Semita app |
| [Ollama](https://ollama.com/download) | Homebrew: `brew install ollama` |
| Disk | ~10 GB free for the three tags |
| Time | First pull is slow; a full run on Apple Silicon 16GB can take **tens of minutes** (larger tags can spike to minutes per prompt) |
| Honesty | Never invent scores. Empty / timeout trials are valid data — score them honestly |

Hardware reality check: on a **MacBook Pro M2 Pro 16GB**, SmolLM2 felt usable; Phi-4 Mini and Qwen3 8B often dragged or timed out. Your mileage will vary.

## 1. Clone and install the app

```bash
git clone https://github.com/uiukis/semita.git
cd semita
pnpm install
```

You do **not** need AI Gateway env vars for the local suite.

## 2. Install and start Ollama

```bash
# macOS (Homebrew)
brew install ollama
ollama serve
```

In another terminal, confirm:

```bash
ollama --version
curl -s http://127.0.0.1:11434/api/tags
```

## 3. Pull the suite tags

```bash
ollama pull smollm2:1.7b
ollama pull phi4-mini:3.8b
ollama pull qwen3:8b
ollama list
```

Exact tags are pinned in `config-local-v1.ts`. If you change tags, you are changing the exam — open a PR to the config, do not silently swap.

## 4. Dry-run, then execute

```bash
pnpm benchmark:run:local --dry-run
pnpm benchmark:run:local
```

Equivalent:

```bash
pnpm exec tsx benchmark/run.ts --local-ollama --dry-run
pnpm exec tsx benchmark/run.ts --local-ollama
```

Useful flags:

| Flag | Meaning |
| --- | --- |
| `--dry-run` | Plan only (no model calls) |
| `--reps N` | Override repetitions (local default is `1`) |

When finished you get something like:

```text
.benchmark-runs/local-2026-07-31T23-31-04-141Z/
  draft.json
  human-review.template.json
  …
```

Leave the laptop plugged in. Do not close the lid mid-run if that suspends Ollama.

## 5. Blinded human review (required)

Writing and pt-BR tasks need human scores before publish.

```bash
RUN=.benchmark-runs/local-<timestamp>   # use your real folder
cp "$RUN/human-review.template.json" "$RUN/human-review.json"
```

Edit `human-review.json`:

1. Read `responseText` **without** chasing which model wrote it (the template is shuffled).
2. Set `humanReviewScore` from `0` to `1`.
3. Optional short `humanReviewNotes` (e.g. `Empty response (timeout/failure)`).

Empty replies, timeouts, and garbage are still reviews — score them low and note why.

## 6. Describe your machine (recommended)

So the site shows **who ran it** and **on what**, instead of a raw run id, add two optional files next to the draft.

### `environment.json`

```json
{
  "runnerName": "Your Name",
  "runnerHandle": "@github",
  "machineLabel": "MacBook Pro 14\" (Mac14,9)",
  "chip": "Apple M2 Pro (12-core CPU · 19-core GPU)",
  "ramGb": 16,
  "accelerator": "Apple Silicon / Metal",
  "runtime": "Ollama (local)",
  "os": "macOS"
}
```

macOS helpers:

```bash
sysctl -n machdep.cpu.brand_string
sysctl -n hw.memsize   # divide by 1073741824 for GB
system_profiler SPHardwareDataType | rg "Model Name|Model Identifier|Chip|Memory"
```

### `observations.json` (optional but valuable)

Honest lab notes — what felt good vs what choked on **your** box:

```json
[
  {
    "kind": "stood-out",
    "modelSlug": "smollm2-1-7b",
    "title": {
      "en": "SmolLM2 felt usable on this Mac",
      "pt-br": "SmolLM2 ficou usável neste Mac"
    },
    "body": {
      "en": "Snappy median latency; extraction was the strength.",
      "pt-br": "Latência mediana ágil; extração foi o ponto forte."
    }
  },
  {
    "kind": "struggled",
    "modelSlug": "qwen3-8b",
    "title": {
      "en": "Qwen3 8B timed out",
      "pt-br": "Qwen3 8B estourou timeout"
    },
    "body": {
      "en": "Multi-minute peaks and an empty PT-BR trial after the timeout.",
      "pt-br": "Picos de vários minutos e um trial PT-BR vazio após o timeout."
    }
  }
]
```

`kind` must be one of: `stood-out` | `struggled` | `note`.

## 7. Publish into the repo

```bash
pnpm benchmark:publish --run .benchmark-runs/local-<timestamp>
pnpm benchmark:check
```

This writes:

- `src/data/benchmark/results/v1/<runId>.json`
- updates `src/data/benchmark/results/latest.ts`

Open a PR. Reviewers should see machine metadata + observations on `/benchmark`, not invent numbers in the UI.

## 8. Local preview

```bash
pnpm dev
```

Visit `http://localhost:3100/benchmark` (or your locale) and confirm:

- Runner name / handle
- Machine chip + RAM
- Lab observations
- Ranked quality / latency / $0 cost

## Troubleshooting

| Symptom | What to try |
| --- | --- |
| `ollama: command not found` | Install Ollama; reopen the terminal |
| Connection refused on `:11434` | Run `ollama serve` |
| Tag missing | `ollama pull <tag>` then `ollama list` |
| Publish complains about human review | Ensure `human-review.json` exists and every subjective trial has a `0–1` score |
| `configHash mismatch` | Do not edit suite settings casually; keep `config-local-v1.ts` aligned with the run you publish |
| Fans screaming / multi-minute prompts | Expected on 16GB for 8B-class tags; document it in observations — that **is** the result |
| Want to free disk later | `ollama rm smollm2:1.7b phi4-mini:3.8b qwen3:8b` (does not break the published site JSON) |

## Cloud Gateway path (optional, paid)

Only if you explicitly want the cloud suite in `config-v1.ts`:

```bash
npx vercel env pull .env.local --yes
# Vercel may require a card for Gateway credits
pnpm benchmark:run --dry-run --max-usd 0.5
pnpm benchmark:run --max-usd 0.5
```

Local and Gateway profiles are **not** interchangeable. Do not mix them as one leaderboard.

## Related docs

- [Methodology](./benchmark-methodology.md) — scoring, limitations, suite design
- [Keeping data fresh](./keeping-data-fresh.md) — catalog / Ollama library drift
- Public page: [/benchmark](https://semita-nu.vercel.app/benchmark)
