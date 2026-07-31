# Custom domain

Production currently ships on `https://semita-nu.vercel.app`.

Also required for Mini Benchmark calls: a credit card on the [AI Gateway](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card) page (auth can be OIDC via `vercel env pull`; the card unlocks free credits).

## Availability check (2026-07-31)

| Domain | Status |
|--------|--------|
| `semita.app` | Not available |
| `semita.ai` | Not available |
| `semita.dev` | Not available |
| `getsemita.com` | Available (~$11.25/yr on Vercel Domains) |
| `usesemita.com` | Available (~$11.25/yr on Vercel Domains) |

Purchase links:

- https://vercel.com/domains/search?q=getsemita.com
- https://vercel.com/domains/search?q=usesemita.com

Buying a domain spends money — only purchase when a maintainer explicitly approves the name and budget.

## After purchase

1. In the Vercel project **semita**, add the domain under **Settings → Domains**.
2. Point DNS as Vercel instructs (usually A/CNAME).
3. Set `NEXT_PUBLIC_SITE_URL` in Vercel Production to `https://<your-domain>` (no trailing slash).
4. Redeploy so sitemap, canonicals and OG URLs use the new origin.

## Until then

Keep `NEXT_PUBLIC_SITE_URL=https://semita-nu.vercel.app` in production and `http://localhost:3100` locally (see `.env.example`).
