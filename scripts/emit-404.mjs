/**
 * Generates dist/sraswan-com/browser/404.html from the *built* index.html.
 *
 * Vercel and GitHub Pages both serve 404.html for any path they have no file
 * for. Copying the unbuilt src/404.html (the previous approach) shipped a page
 * with no script tags and the wrong <base href>, so deep links rendered a
 * blank screen — and on GitHub Pages every route was a deep link. This
 * takes the real built shell instead — correct base href, correct hashed
 * bundles — and strips the prerendered homepage markup so the router renders
 * the requested URL client-side rather than showing homepage content under
 * some other address.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'dist', 'sraswan-com', 'browser');
const source = join(outDir, 'index.html');

if (!existsSync(source)) {
  console.error(`[emit-404] ${source} not found — did the build run?`);
  process.exit(1);
}

const html = readFileSync(source, 'utf-8')
  // Drop prerendered homepage content; the client router fills this in.
  .replace(/<app-root[^>]*>[\s\S]*?<\/app-root>/, '<app-root></app-root>')
  // Hydration/transfer state belongs to the homepage render, not this shell.
  .replace(/<script[^>]*id="ng-state"[^>]*>[\s\S]*?<\/script>/g, '')
  // A canonical would contradict the noindex below and point every missing
  // URL at the homepage, which reads as a soft 404.
  .replace(/<link[^>]*rel="canonical"[^>]*>\s*/g, '')
  // A 404 shell should never be indexed on its own.
  .replace(/<head>/, '<head>\n  <meta name="robots" content="noindex">');

writeFileSync(join(outDir, '404.html'), html);
console.log('[emit-404] wrote dist/sraswan-com/browser/404.html');
