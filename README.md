# Semita

A community-driven hub that shows how to use AI to **leverage — not replace** — learning and work.

MVP focus: **Choose** — compare LLMs by cost per token, context window, local hardware fit, benchmarks and an editorial [Semita score](https://semita-nu.vercel.app/score). Growing **Apply** + **Learn** with recipes and a progressive guide.

- Production: [https://semita-nu.vercel.app](https://semita-nu.vercel.app)
- Repo: [https://github.com/uiukis/semita](https://github.com/uiukis/semita)
- Languages: English and Portuguese on the same URLs (cookie-based)
- License: [MIT](LICENSE)
- Paths: [/recommend](https://semita-nu.vercel.app/recommend) · [/hardware](https://semita-nu.vercel.app/hardware) · [/apply](https://semita-nu.vercel.app/apply) · [/learn](https://semita-nu.vercel.app/learn) · [/guide](https://semita-nu.vercel.app/guide) · [/contribute](https://semita-nu.vercel.app/contribute)
- Contribute: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/adding-a-model.md](docs/adding-a-model.md) · [docs/keeping-data-fresh.md](docs/keeping-data-fresh.md) · [docs/benchmark-methodology.md](docs/benchmark-methodology.md) · [docs/custom-domain.md](docs/custom-domain.md)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + Motion
- next-intl (EN / PT-BR)
- Vercel Analytics + Speed Insights
- pnpm

## Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

```bash
pnpm lint
pnpm catalog:check
pnpm benchmark:check
pnpm build
```

## Catalog freshness

Diff the Semita local catalog against [Ollama’s library](https://ollama.com/library):

```bash
pnpm catalog:check
pnpm catalog:add --tag gemma3:12b
```

Details: [docs/keeping-data-fresh.md](docs/keeping-data-fresh.md).

## Semita Mini Benchmark

- Public page: [/benchmark](https://semita-nu.vercel.app/benchmark)
- Methodology: [docs/benchmark-methodology.md](docs/benchmark-methodology.md)
- Maintainer-only runner (AI Gateway key in `.env.local`):

```bash
pnpm benchmark:run --dry-run --max-usd 2
pnpm benchmark:run --max-usd 2
pnpm benchmark:publish --run .benchmark-runs/<id>
pnpm benchmark:check
```

The site never executes models. Only published JSON under `src/data/benchmark/results/` is rendered.

## Data honesty (MVP)

- Prices and benchmarks are verified against public docs when updated (`lastUpdated` per model).
- Always re-check the linked official source before making cost decisions.
- The Semita score is **editorial** in the MVP — see [/score](https://semita-nu.vercel.app/score). Live community voting is Phase 4.
- The Semita Mini Benchmark is a **small maintainer-run suite** — see [/benchmark](https://semita-nu.vercel.app/benchmark). No invented demo results.
- Fastest way to fix a price: open a [Data update](https://github.com/uiukis/semita/issues/new?template=data_update.md) issue.

## Custom domain

Point your DNS at Vercel when ready (A/CNAME for the `semita` project). Until then production stays on `semita-nu.vercel.app`.

## Observability

- **Analytics / Web Vitals**: `@vercel/analytics` + `@vercel/speed-insights` (enabled in production).
- **Errors**: use Vercel Runtime Logs / Observability for the project; add a dedicated error tracker (e.g. Sentry) when volume justifies it.

## Roadmap

1. **Choose** (live) — catalog, compare, recommender, hardware recipes, Mini Benchmark methodology
2. **Apply** (started) — practical recipes linking goals → models (MCP directory later)
3. **Learn** (started) — [/guide](https://semita-nu.vercel.app/guide) beginner → advanced
4. **Community validates** — truthfulness voting after critical mass

**Blocked for first Mini Benchmark publish:** Vercel AI Gateway needs a credit card on file to unlock free credits (auth can be OIDC via `vercel env pull`). Then dry-run → run → human review → publish — never invent results.
