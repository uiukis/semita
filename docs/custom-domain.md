# Custom domain

Production URL (current): **https://semita-nu.vercel.app**

No custom domain purchase planned for now — keep `NEXT_PUBLIC_SITE_URL=https://semita-nu.vercel.app` in Vercel Production.

When you do want a domain later, `getsemita.com` / `usesemita.com` were available (~$11/yr) at last check.

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
