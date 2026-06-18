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
- **Vercel** (`sraswan.vercel.app`) — reads `vercel.json`; output is `dist/sraswan-com/browser`; all routes rewrite to `index.html`.
- **GitHub Pages** (`sraswan.github.io/sraswan.com`) — `.github/workflows/build-and-deploy.yml`; Angular is built with `--base-href=/sraswan.com/`.

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

`src/app/seo.service.ts` reads `data.seo` from the active route on every `NavigationEnd` and updates `<title>` plus Open Graph/Twitter meta tags. Each route in `app.routes.ts` carries a `data: { seo: { title, description, url, image? } }` block. Routes without one fall back to the defaults defined in `SeoService`.

### Sidebar animation

The desktop sidebar in `app.html` sets `[attr.data-active-index]` from `App.activeIndex` (updated on `mouseover`). `app.css` uses attribute selectors (`#menu[data-active-index="N"]`) to animate the background image position — no JS animation involved.

### SSR render modes

`src/app/app.routes.server.ts` controls per-route SSR mode. Most routes are `RenderMode.Client`. Change a route to `RenderMode.Server` or `RenderMode.Prerender` here if SSR is needed (e.g., for OG tag crawlers).

### 404 / GitHub Pages SPA fallback

`src/404.html` is a copy of `index.html` that GitHub Pages serves for unknown paths, allowing the Angular router to handle deep links. It is listed in `angular.json` assets so it is included in every build.
