/**
 * Generates dist/sraswan-com/browser/404.html from the *built* index.html.
 *
 * Vercel and GitHub Pages both serve 404.html for any path they have no file
 * for. Copying the unbuilt src/404.html (the original approach) shipped a page
 * with no script tags and the wrong <base href>, so deep links rendered a
 * blank screen — and on GitHub Pages every route was a deep link. This takes
 * the real built shell instead — correct base href, correct hashed bundles —
 * strips the prerendered homepage markup so the router renders the requested
 * URL client-side, and rewrites the inherited homepage metadata so a missing
 * page does not announce itself as the About page.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'dist', 'sraswan-com', 'browser');
const source = join(outDir, 'index.html');

if (!existsSync(source)) {
  console.error(`[emit-404] ${source} not found — did the build run?`);
  process.exit(1);
}

const TITLE = 'Page not found — Shaurya Raswan';
const DESCRIPTION = 'This page does not exist.';

/** Applies a replacement and fails the build if the pattern no longer matches. */
function required(html, pattern, replacement, what) {
  if (!pattern.test(html)) {
    console.error(`[emit-404] expected to find ${what} in the built index.html — Angular's output shape changed. Refusing to emit a wrong 404.html.`);
    process.exit(1);
  }
  return html.replace(pattern, replacement);
}

let html = readFileSync(source, 'utf-8');

// Drop prerendered homepage content; the client router fills this in.
html = required(html, /<app-root[^>]*>[\s\S]*?<\/app-root>/, '<app-root></app-root>', '<app-root>');

// This page is not the homepage — do not inherit its identity.
html = required(html, /<title>[^<]*<\/title>/, `<title>${TITLE}</title>`, '<title>');
html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`);
html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${TITLE}$2`);
html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${TITLE}$2`);
html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`);
html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${DESCRIPTION}$2`);

// og:url would point at the homepage from an arbitrary missing URL.
html = html.replace(/<meta property="og:url"[^>]*>\s*/g, '');

// Hydration/transfer state belongs to the homepage render, not this shell.
html = html.replace(/<script[^>]*id="ng-state"[^>]*>[\s\S]*?<\/script>/g, '');

// A canonical would contradict the noindex below and point every missing URL
// at the homepage, which reads as a soft 404.
html = html.replace(/<link[^>]*rel="canonical"[^>]*>\s*/g, '');

// A 404 shell should never be indexed on its own.
html = required(html, /<head>/, '<head>\n  <meta name="robots" content="noindex">', '<head>');

writeFileSync(join(outDir, '404.html'), html);
console.log('[emit-404] wrote dist/sraswan-com/browser/404.html');
