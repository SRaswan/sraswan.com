## Commands

```bash
npm start                  # dev server at localhost:4200 (no SSR)
npm run build              # production browser bundle → dist/sraswan-com/browser/
npm run build:ssr          # browser + SSR server bundle
npm run serve:ssr          # serve already-built SSR bundle on :4000
npm run start:ssr          # build SSR + serve in one step
npm test                   # Karma unit tests
```

For a quick static preview of a production build:
```bash
npm run build && npx http-server dist/sraswan-com/browser -p 4200 -c-1
```

## Deployment

Pushing to `main` triggers two automatic deploys:
- **Vercel** (`sraswan.vercel.app`) — **the canonical host.** Reads `vercel.json`; output is `dist/sraswan-com/browser`. `trailingSlash: true` matches the prerendered `<route>/index.html` layout.
  The catch-all rewrite points at **`/404.html`, not `/index.html`**. Rewrites are evaluated after the filesystem, so every prerendered page and asset still wins; only genuinely missing paths hit it. This is load-bearing: without an explicit rewrite Vercel falls back to `index.html` on its own, which served the **homepage** at every bogus URL — a soft 404. Verified by contrast: the identical build 404s correctly on GitHub Pages, so the fallback is Vercel's, not the build's. A rewrite cannot set a status code, so these still return 200; what keeps them out of the index is the `noindex` that `scripts/emit-404.mjs` bakes into `404.html`. **Never point this rewrite at `/index.html`.**
- **GitHub Pages** (`sraswan.github.io/sraswan.com`) — `.github/workflows/gh-pages.yml`; built with `--base-href=/sraswan.com/`. A secondary copy that canonicalises back to Vercel, so search engines consolidate onto the Vercel URL. Safe to disable without affecting SEO.

The public address is defined once, as `SITE_URL` in `src/app/seo.service.ts` (re-exported to `app.routes.ts`). Moving to a custom domain means changing that line plus `src/robots.txt` and `src/sitemap.xml`.

## Architecture

### Content is JSON-driven — no code changes for routine updates

All page content lives in `public/` and is fetched at runtime via `HttpClient`. The files are:

| File | Powers |
|---|---|
| `public/about.json` | About page — profile, bio, socials, education, experience |
| `public/projects.json` | Projects grid (`items[]` with `title`, `skills`, `description`, `image`, `links`) |
| `public/artworks.json` | Art gallery (`filename` + `include` boolean toggle) |
| `public/blogs.json` | Blog index (`items[]` with `slug`, `title`, `excerpt`, `date`, `tags`, `markdownFile`) |
| `public/blog/*.md` | Blog post bodies, rendered by `ngx-markdown` |
| `public/resumes/YY-MM-DD.pdf` | Resume PDF; update `filename` in `resume.ts` to switch versions |

### Bootstrap is bundled, not CDN

Bootstrap JS/CSS and Popper are listed in `angular.json` under `scripts`/`styles` and bundled at build time. **Do not add a Bootstrap CDN `<script>` tag** — it will load it twice.

### SEO service

`src/app/seo.service.ts` reads `data.seo` from the active route on every `NavigationEnd` and updates `<title>`, `<link rel="canonical">`, and the Open Graph/Twitter meta tags. Each route in `app.routes.ts` carries a `data: { seo: { title, description, url, image? } }` block. Routes without one fall back to the defaults defined in `SeoService`.

The canonical is derived from the live router URL (`SITE_URL` + path + trailing slash), not from route data, so parameterised routes get distinct canonicals instead of all pointing at one URL. The trailing slash matches what static hosts serve for `<route>/index.html`, avoiding a canonical→redirect chain. The tags in `src/index.html` are defaults only; `SeoService` overwrites them per route, including during prerender.

A route can set `seo.noindex: true` to stay out of search results — currently only `blog/:slug`, so individual posts never compete with the About page for "Shaurya Raswan". Such pages emit `robots: noindex, follow` and **no canonical** (the two are contradictory signals), keep their Open Graph tags for link previews, and must be left out of `src/sitemap.xml`. The `/blog` index itself stays indexed. Never express this with `Disallow` in `robots.txt` instead: blocking the crawl stops Google from ever reading the `noindex`, and blocked URLs can still be indexed title-only.

`seo.noimageindex: true` keeps a page's images out of Google Images while the page itself stays indexed (it keeps its canonical). Set on `/blog`, whose post thumbnails would otherwise be indexable even though the posts themselves are `noindex`. The two flags compose: posts carry `noindex, follow, noimageindex`.

`blog/:slug` gets its title/description/image per post from `blog-post-seo.resolver.ts` (`resolve: { seo }`, which overrides a route's static `data.seo`). It has to be a **resolver**, not something the component sets: `NavigationEnd` fires *after* component activation, so a component writing SEO tags in `ngOnInit` gets overwritten by the route's own data a moment later. Resolvers run before activation and work during prerendering.

### Sidebar animation

The desktop sidebar in `app.html` sets `[attr.data-active-index]` from `App.activeIndex` (updated on `mouseover`). `app.css` uses attribute selectors (`#menu[data-active-index="N"]`) to animate the background image position — no JS animation involved.

### SSR render modes

`src/app/app.routes.server.ts` controls per-route render mode. **Every route is `RenderMode.Prerender`** — the production build sets `outputMode: "static"` in `angular.json`, so `npm run build` emits fully-rendered HTML per route. This is what makes the site indexable; don't move routes back to `RenderMode.Client`.

Adding a route to `app.routes.ts` requires a matching entry here or **the build fails**. Parameterised routes need `getPrerenderParams` (see `blog/:slug`, which enumerates slugs from `blogs.json`).

Prerendering runs the app in Node, where the components' relative content fetches (`./about.json`) can't resolve. `src/app/server-content.interceptor.ts` intercepts those and reads the files off disk instead. It is registered **only** in `app.config.server.ts`, which is why its `node:*` imports never reach the browser bundle — don't import it from anywhere else.

Because components now render on the server, guard any browser-only API (`window`, `document`) with `isPlatformBrowser` — but do *not* guard the data fetch itself, or the page prerenders empty.

### 404 / GitHub Pages SPA fallback

Every real route is prerendered to its own `index.html`, so deep links are served as genuine 200s and never touch the 404 path.

`dist/sraswan-com/browser/404.html` is generated by `scripts/emit-404.mjs`, which npm runs automatically as `postbuild`. It takes the *built* `index.html` (correct base href, correct hashed bundles), strips the prerendered homepage markup and hydration state, drops the canonical, and adds `noindex`. It only serves genuinely nonexistent URLs.

**Deploy commands must go through `npm run build`, not `npx ng build`** — otherwise the `postbuild` step is skipped and no 404.html is produced. Extra flags pass through: `npm run build -- --base-href=/sraswan.com/`.
