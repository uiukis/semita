# Semita

A community-driven hub that shows how to use AI to **leverage — not replace** — learning and work.

MVP focus: **Choose** — compare LLMs by cost per token, context window, benchmarks and an editorial Semita score.

- Live locally: [http://localhost:3100](http://localhost:3100)
- Locales: `/en`, `/pt-br`
- License: [MIT](LICENSE)
- Contribute: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/adding-a-model.md](docs/adding-a-model.md)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + Motion
- next-intl (EN / PT-BR)
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
- The Semita score is **editorial** in the MVP — live community voting is Phase 4.

## Roadmap

1. **Choose** (MVP) — LLM comparison hub
2. **Apply** — skills & MCPs directory
3. **Learn** — progressive articles + leverages vs replaces
4. **Community validates** — truthfulness voting after critical mass
