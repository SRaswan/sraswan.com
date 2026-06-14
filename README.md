# sraswan.com

A personal website built with Angular.

## Managing content

All page content lives in plain JSON/Markdown files under `public/` — edit these,
then commit and push. No code changes needed for routine updates.

| What | File | Notes |
| --- | --- | --- |
| About page (bio, education, experience, socials) | `public/about.json` | Add an entry to `education` / `experience`; socials use Font Awesome icon classes. |
| Projects | `public/projects.json` | Each item has `title`, `skills`, `description`, `image` (under `public/proj/`), and optional `links`. |
| Art gallery | `public/artworks.json` | Add `{ "filename": "art/your-image.png", "include": true }`. Drop the image in `public/art/`. Set `include: false` to hide without deleting. |
| Blog index | `public/blogs.json` | Metadata for each post (`slug`, `title`, `excerpt`, `date`, `tags`, `image`, `markdownFile`). |
| Blog post body | `public/blog/<markdownFile>` | The Markdown rendered at `/blog/<slug>`. |
| Resume PDF | `public/resumes/YY-MM-DD.pdf` | Add the new PDF, then update `filename` in `src/app/resume/resume.ts`. The "Updated" date is parsed from the file name. |

Per-page titles and social/SEO meta tags come from the route `data.seo` blocks in
`src/app/app.routes.ts` and are applied automatically by `src/app/seo.service.ts`.

## Commands

### Install dependencies

```bash
npm install
```

Installs all project packages.

### Start dev server

```bash
npm start
```

Runs Angular dev mode at `http://localhost:4200`.

### Start dev server (Angular CLI)

```bash
ng serve
```

Same local non-SSR dev server at `http://localhost:4200`.

### Build production bundle

```bash
npm run build
```

Builds the production browser bundle.

### Build and preview locally (without SSR)

```bash
npm run build
npx http-server dist/sraswan-com/browser -p 4200 -c-1
```

Serves the built static site locally at `http://localhost:4200`.

### Build in watch mode

```bash
npm run watch
```

Continuously rebuilds in development configuration.

### Run tests

```bash
npm test
```

Runs Karma tests.

### Build SSR output

```bash
npm run build:ssr
```

Builds browser + server bundles for SSR.

### Serve built SSR app

```bash
npm run serve:ssr
```

Starts the built SSR server at `http://localhost:4000`.

### Build and run SSR in one command

```bash
npm run start:ssr
```

Builds SSR output and starts the SSR server.

## To vercel and github pages

just commit and push!
- https://sraswan.vercel.app/
- https://sraswan.github.io/sraswan.com/