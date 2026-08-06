# Run the Semita Mini Benchmark locally (dev tutorial)

This guide is for **developers / maintainers** who want to reproduce or publish a **local Ollama** Mini Bench run on their own machine — **$0 API spend**.

Works on **macOS**, **Windows**, and **Linux**. The live site never calls your laptop: you run models offline, review writing/pt-BR by hand, then commit sanitized JSON under `src/data/benchmark/results/`.

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
| [Ollama](https://ollama.com/download) | Native installers for macOS / Windows / Linux (see below) |
| Disk | ~10 GB free for the three tags |
| Time | First pull is slow; a full run on 16GB RAM can take **tens of minutes** (8B tags may spike to minutes per prompt) |
| Honesty | Never invent scores. Empty / timeout trials are valid data — score them honestly |

Hardware reality check: on a **MacBook Pro M2 Pro 16GB**, SmolLM2 felt usable; Phi-4 Mini and Qwen3 8B often dragged or timed out. On Windows/Linux with NVIDIA, expect better latency if you have enough VRAM — still document what actually happened.

## 1. Clone and install the app

```bash
git clone https://github.com/uiukis/semita.git
cd semita
pnpm install
```

**Windows (PowerShell):** same commands work if Git + Node + pnpm are on `PATH`. Prefer PowerShell 7+ or Git Bash for the copy steps later.

You do **not** need AI Gateway env vars for the local suite.

## 2. Install and start Ollama

### macOS

```bash
# Homebrew
brew install ollama
# or download the app from https://ollama.com/download

ollama serve
```

If you installed the .app, opening **Ollama** from Applications also starts the local API.

### Windows

1. Download and install [Ollama for Windows](https://ollama.com/download) (installer).
2. Launch **Ollama** from the Start menu (tray icon = API up on `http://127.0.0.1:11434`).
3. Open **PowerShell** or **Windows Terminal** for the CLI:

```powershell
ollama --version
```

If `ollama` is not found, reopen the terminal after install, or use the full path from the Start Menu shortcut.

Optional explicit serve (usually unnecessary when the app is running):

```powershell
ollama serve
```

### Linux

Official install script (amd64; see Ollama docs for other arches):

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

Or install via your distro package if you already package Ollama. Keep a terminal running `ollama serve` unless a systemd user service is enabled (`ollama serve` / `systemctl --user enable --now ollama` depending on install).

NVIDIA: install a recent proprietary driver so Ollama can use the GPU. AMD/ROCm and CPU-only also work — expect slower tokens; say so in `observations.json`.

### Confirm the API (all OS)

```bash
ollama --version
curl -s http://127.0.0.1:11434/api/tags
```

**Windows PowerShell** alternative to `curl`:

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

## 3. Pull the suite tags

Same on every OS:

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

Leave the machine awake (disable sleep / “Modern Standby” surprises on Windows laptops). Closing the lid often suspends Ollama mid-run.

## 5. Blinded human review (required)

Writing and pt-BR tasks need human scores before publish.

**macOS / Linux / Git Bash:**

```bash
RUN=.benchmark-runs/local-<timestamp>   # use your real folder
cp "$RUN/human-review.template.json" "$RUN/human-review.json"
```

**Windows PowerShell:**

```powershell
$RUN = ".benchmark-runs\local-<timestamp>"   # use your real folder
Copy-Item "$RUN\human-review.template.json" "$RUN\human-review.json"
```

Edit `human-review.json`:

1. Read `responseText` **without** chasing which model wrote it (the template is shuffled).
2. Set `humanReviewScore` from `0` to `1`.
3. Optional short `humanReviewNotes` (e.g. `Empty response (timeout/failure)`).

Empty replies, timeouts, and garbage are still reviews — score them low and note why.

## 6. Describe your machine (recommended)

So the site shows **who ran it** and **on what**, instead of a raw run id, add two optional files next to the draft.

### `environment.json`

Examples — pick the shape that matches your box:

**macOS**

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

**Windows**

```json
{
  "runnerName": "Your Name",
  "runnerHandle": "@github",
  "machineLabel": "Desktop PC",
  "chip": "AMD Ryzen 7 5800X",
  "ramGb": 32,
  "accelerator": "NVIDIA RTX 4070 12GB / CUDA",
  "runtime": "Ollama (local)",
  "os": "Windows 11"
}
```

**Linux**

```json
{
  "runnerName": "Your Name",
  "runnerHandle": "@github",
  "machineLabel": "ThinkPad T14 Gen 3",
  "chip": "Intel Core i7-1260P",
  "ramGb": 32,
  "accelerator": "CPU-only (no discrete GPU)",
  "runtime": "Ollama (local)",
  "os": "Ubuntu 24.04"
}
```

### How to fill the fields

**macOS**

```bash
sysctl -n machdep.cpu.brand_string
sysctl -n hw.memsize   # divide by 1073741824 for GB
system_profiler SPHardwareDataType | rg "Model Name|Model Identifier|Chip|Memory"
```

**Windows (PowerShell)**

```powershell
Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model, TotalPhysicalMemory
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores
Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM
```

`TotalPhysicalMemory` / `AdapterRAM` are bytes — divide by `1GB` (`[math]::Round($bytes/1GB,0)`).

**Linux**

```bash
# Pretty summary when available
hostnamectl 2>/dev/null || true
lscpu | rg "Model name|Architecture|CPU\\(s\\)"
free -h
# NVIDIA
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>/dev/null || echo "no NVIDIA / CPU-only"
# AMD
rocminfo 2>/dev/null | head -20 || true
```

### `observations.json` (optional but valuable)

Honest lab notes — what felt good vs what choked on **your** box:

```json
[
  {
    "kind": "stood-out",
    "modelSlug": "smollm2-1-7b",
    "title": {
      "en": "SmolLM2 felt usable on this machine",
      "pt-br": "SmolLM2 ficou usável nesta máquina"
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

**Windows PowerShell** (path separators):

```powershell
pnpm benchmark:publish --run .benchmark-runs\local-<timestamp>
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
- Machine chip + RAM + OS
- Lab observations
- Ranked quality / latency / $0 cost

## Troubleshooting

| Symptom | What to try |
| --- | --- |
| `ollama: command not found` | Reinstall from [ollama.com/download](https://ollama.com/download); reopen the terminal; on Windows check Start Menu → Ollama |
| Connection refused on `:11434` | Start the Ollama app / `ollama serve` |
| Tag missing | `ollama pull <tag>` then `ollama list` |
| Publish complains about human review | Ensure `human-review.json` exists and every subjective trial has a `0–1` score |
| `configHash mismatch` | Do not edit suite settings casually; keep `config-local-v1.ts` aligned with the run you publish |
| Fans screaming / multi-minute prompts | Common on 16GB / CPU-only for 8B tags; document in observations — that **is** the result |
| Windows sleep kills the run | Settings → System → Power → keep awake while plugged in |
| Linux no GPU | Expected slower latency; set `accelerator` to `CPU-only` (or ROCm if configured) |
| Want to free disk later | `ollama rm smollm2:1.7b phi4-mini:3.8b qwen3:8b` (does not break published site JSON) |

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
- [Keeping data fresh](./keeping-data-fresh.md) — catalog / Ollama library drift (+ weekly GitHub Action)
- Public page: [/benchmark](https://semita-nu.vercel.app/benchmark)
