# sraswan.com

A personal website built with Angular.

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