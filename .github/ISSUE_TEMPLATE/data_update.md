---
name: Data update
about: Correct pricing, benchmarks, local hardware notes, or request a missing model — no code required
labels: data
---

## Model

- Slug / name:
- Provider:
- Ollama tag (if local): <!-- e.g. gemma3:12b -->
- Kind: <!-- cloud pricing / local hardware / new local model / other -->

## What is wrong / missing

<!-- e.g. input price listed as $2.50 but official page shows $2.00 -->
<!-- or: this Ollama model is popular and missing from Semita -->

## Correct value / proposed addition

<!-- exact field + number/string, or short pitch for a new local entry -->

## Hardware (local models only)

- Tier: <!-- entry / mid / heavy -->
- Platform: <!-- nvidia / amd / apple / cpu -->
- Notes (VRAM / unified memory):

## Official source

- URL:
- Checked on (YYYY-MM-DD):

## Optional

- [ ] I can open a PR against `src/data/models.ts` or `src/data/local-models.ts` if maintainers prefer
- [ ] I ran `pnpm catalog:check` and this showed up as missing
