# itsj.im

Jim Liu's site. Static [Astro](https://astro.build) site: content in Markdown/MDX, two CSS skins over the same HTML, votes stored in the browser.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

Node 22.12 or newer.

## Content

All editable copy lives in `src/content/`. Presentation reads it; don't hardcode bios or markets into pages.

`src/content.config.ts` is the schema. A bad frontmatter field fails the build.

### About

One file: `src/content/about/jim.md`.

- Frontmatter feeds the home hero, the facts list, JSON-LD, the footer, and `/llms.txt`.
- The markdown body is the about-page prose.
- Keep the prose and the `roles` / `talk` fields in agreement.
- `positioning` is the home page `<h1>`. Leave it as the one-line bio.

### Markets

Add `src/content/markets/your-slug.md` (or `.mdx`). The filename is the URL: `/markets/your-slug`.

```yaml
---
title: Will this question be a real market someday?
thesis: One or two sentences. This is what the card shows.
status: open          # open | resolved
# resolution: Required when status is resolved. Shown on the card.
yesProbability: 0.42  # 0 to 1. 0.42 renders as 42% yes. This is the seed, not a live price.
featured: true        # home shows up to 3 featured markets, newest first
publishedAt: 2026-11-14
example: false        # true marks placeholder copy. Remove it on real entries.
draft: false          # true hides the entry from production builds
---

Longer writeup. Rendered only on the market page.
```

`yesProbability` is the number on the card. Votes do not change it.

### Writing

Add `src/content/writing/your-slug.md` (or `.mdx`). URL: `/writing/your-slug`. Included in the RSS feed at `/rss.xml`.

```yaml
---
title: Post title
description: One sentence for the index, RSS, and meta description.
publishedAt: 2026-11-14
updatedAt: 2026-11-20   # optional
example: false
draft: false
---
```

The current markets and the sample post are placeholders (`example: true`). Replace the files. Don't ship them as if they were Jim's positions.

## Skins

Skins are CSS only. Every page is the same semantic HTML, server-rendered, readable with JavaScript off (that visitor gets the clean skin).

Two ship:

- `default` — clean reading column. Label in the switcher: Clean.
- `polymarket` — dark board, market grid, probability bars, Yes/No buttons.

The switcher is a radiogroup in the header. Choice is stored in `localStorage` under `itsjim:skin`. A blocking script in `<head>` applies it before first paint, so a saved skin doesn't flash the other one.

### Add a skin

1. Register it in `src/lib/skins.ts`:

   ```ts
   { id: 'newsprint', label: 'Newsprint', themeColor: '#f3efe4' },
   ```

   `id` is the `data-skin` value and the localStorage value. `label` is the switcher text. `themeColor` sets `<meta name="theme-color">`. The switcher, the boot script, and persistence pick the new entry up with no other JavaScript changes.

2. Add a `[data-skin="newsprint"]` block in `src/styles/skins.css` (or a new file imported next to it from `src/layouts/Base.astro`). Override the custom properties (`--bg`, `--text`, `--muted`, `--line`, `--yes`, `--no`, fonts, …) and any layout rules (`.market-list` grid, `.vote-btn` chrome, `.wrap` measure). Properties you leave alone fall through to `:root`, which is the clean skin.

Don't branch the markup per skin. If a layout needs a new element, add it for every skin and style it.

## Votes

Yes/No on a market card is a small client script in `src/components/VoteWidget.astro`. It talks only to `voteStore` in `src/lib/votes.ts`.

```ts
interface VoteStore {
  getVote(marketId: string): Promise<'yes' | 'no' | null>;
  setVote(marketId: string, choice: 'yes' | 'no'): Promise<void>;
  clearVote(marketId: string): Promise<void>;
}
```

`localVoteStore` keeps a JSON map in `localStorage` under `itsjim:votes:v1`. Clicking the active choice again clears it. The percentage on the card stays the seed from frontmatter.

To put a backend behind it later (Supabase or otherwise), implement `VoteStore` and change the `voteStore` export. No SDK and no secrets are wired up now. Don't derive the displayed probability from stored votes unless you also change the copy that calls it a seed.

## Deploy on Vercel

The site is static. Vercel detects Astro.

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables
- No `@astrojs/vercel` adapter. Add one only if you introduce server routes.

`vercel.json` is redirects only. Domains (`itsj.im`, `www.itsj.im`) stay on the Vercel project; they are not declared in the repo.

`astro.config.mjs` redirects `/home` and `/canceled` so `npm run dev` matches production for those. The legacy `*.html` paths are only in `vercel.json`. Astro's static redirect for `/checkout.html` emits a `checkout.html/` directory, and the preview server then serves that redirect at `/checkout` instead of the real page.

## Legacy checkout and `now.json`

`/checkout`, `/success`, and `/cancel` still exist. `/canceled` (the old Stripe cancel URL — the route was `/cancel`) 301s to `/cancel`. `/home` 301s to `/`. The old `*.html` paths redirect to the clean URLs.

The checkout button is gone. It was a 2020 example ("My Sunday Hustle") using Stripe.js `redirectToCheckout({ lineItems })`. Stripe removed that method, including the client-only integration, in Stripe.js as of the 2025-09-30 Clover release. Making it charge again would need a server-side Checkout Session and a secret key. This site has neither. Success and cancel keep their original lines so an old return URL still says something sensible. All three pages are `noindex` and out of the sitemap.

`now.json` was the legacy Now/Vercel v2 config (`@now/static` builds, domain aliases, and shortlinks). Vercel builds this Astro project with no `builds` block, and aliases belong to the project, so that file is not how you configure a deploy anymore. Shortlinks that are not redirected anymore:

| Path | Old target | Why it was dropped |
| --- | --- | --- |
| `/twitter` | `twitter.com/jimcalliu` | Old handle. The site links `twitter.com/0xitsjim`. |
| `/github` | `github.com/jimcal/jimcal` | Footer links `github.com/jimcal`. |
| `/linkedin` | LinkedIn | Footer links it directly. |
| `/work` | `medium.com/@techatnordstrom` | Old Nordstrom blog. |
| `/hiring` | A specific Nordstrom req | Dead job post. |
| `/cascadiajs`, `/cascadia` | `2020.cascadiajs.com` | 2020 event site. |
| `/ticket` | A 2020 Tito discount | Expired promo. |
| `/fizbuz` | `fizbuz.com/u/jim` | Removed from the homepage in 2024. |
| `/dweb` | `@DwebSeattle` | Not part of this site. |
| `/zen-twitter` | `zen-twitter.itsj.im` | Separate project. |
| `/jobs` | `itsjim.pallet.xyz/jobs` | Old job board. |

Put any you still want in the `redirects` array in `vercel.json`.

Fathom (`GWAARPAL`) and the third-party badge script are not loaded. The pages are static HTML plus the skin switcher and the vote buttons.

## SEO files

Generated at build from the content collections:

- `/sitemap-index.xml` via `@astrojs/sitemap` (checkout, success, cancel, and the 404 are excluded)
- `/robots.txt`
- `/rss.xml` for writing
- `/llms.txt` and `/llms-full.txt`
- Canonical, description, Open Graph, and Twitter card tags on every page
- JSON-LD: `WebSite` + `Person` on the home page, `Person` on about, `BlogPosting` on posts, `Question` on markets

`<link rel="describedby" href="/llms.txt">` is in the document head.
