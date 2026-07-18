# Semita

A community-driven hub that shows how to use AI to **leverage — not replace** — learning and work.

MVP focus: **Choose** — compare LLMs by cost per token, context window, benchmarks and an editorial [Semita score](https://semita-nu.vercel.app/score).

- Production: [https://semita-nu.vercel.app](https://semita-nu.vercel.app)
- Repo: [https://github.com/uiukis/semita](https://github.com/uiukis/semita)
- Languages: English and Portuguese on the same URLs (cookie-based)
- License: [MIT](LICENSE)
- Contribute: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/adding-a-model.md](docs/adding-a-model.md) · [docs/keeping-data-fresh.md](docs/keeping-data-fresh.md)

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
pnpm build
```

## Data honesty (MVP)

- Prices and benchmarks are verified against public docs when updated (`lastUpdated` per model).
- Always re-check the linked official source before making cost decisions.
- The Semita score is **editorial** in the MVP — see [/score](https://semita-nu.vercel.app/score). Live community voting is Phase 4.
- Fastest way to fix a price: open a [Data update](https://github.com/uiukis/semita/issues/new?template=data_update.md) issue.

## Custom domain

Point your DNS at Vercel when ready (A/CNAME for the `semita` project). Until then production stays on `semita-nu.vercel.app`.

## Observability

- **Analytics / Web Vitals**: `@vercel/analytics` + `@vercel/speed-insights` (enabled in production).
- **Errors**: use Vercel Runtime Logs / Observability for the project; add a dedicated error tracker (e.g. Sentry) when volume justifies it.

## Roadmap

1. **Choose** (MVP) — LLM comparison hub
2. **Apply** — skills & MCPs directory
3. **Learn** — progressive articles + leverages vs replaces
4. **Community validates** — truthfulness voting after critical mass
