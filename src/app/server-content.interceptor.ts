import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Observable, of } from 'rxjs';

/**
 * SERVER ONLY — imported from `app.config.server.ts`, never from the browser
 * config, so the `node:*` imports above never reach the client bundle.
 *
 * Components fetch their content with relative URLs (`./about.json`,
 * `./blog/post.md`). Those resolve fine in a browser, but during prerendering
 * there is no request context to resolve them against, so HttpClient would
 * fail and every page would render empty. This interceptor short-circuits
 * those requests and reads the file straight off disk instead.
 */
@Injectable()
export class ServerContentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const path = toContentPath(req.url);

    if (req.method !== 'GET' || !path) {
      return next.handle(req);
    }

    const file = findContentFile(path);
    if (!file) {
      return next.handle(req);
    }

    const raw = readFileSync(file, 'utf-8');
    const body = req.responseType === 'json' ? JSON.parse(raw) : raw;

    return of(new HttpResponse({ body, status: 200, url: req.url }));
  }
}

/**
 * Reduces a request URL to a path relative to the content root, or returns
 * undefined for anything that isn't a local content file.
 */
function toContentPath(url: string): string | undefined {
  if (/^https?:\/\//i.test(url)) {
    return undefined;
  }

  const clean = url.split('?')[0].split('#')[0].replace(/^\.?\//, '');

  if (!/\.(json|md)$/i.test(clean) || clean.includes('..')) {
    return undefined;
  }

  return clean;
}

/** Content lives in `public/` at build time and alongside the browser bundle at runtime. */
function findContentFile(path: string): string | undefined {
  for (const root of contentRoots()) {
    const candidate = resolve(root, path);
    if (candidate.startsWith(resolve(root)) && existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

let roots: string[] | undefined;

function contentRoots(): string[] {
  if (roots) {
    return roots;
  }

  const cwd = process.cwd();
  const candidates = [join(cwd, 'public'), join(cwd, 'dist', 'sraswan-com', 'browser')];

  // When the built SSR server runs, the browser assets sit next to it.
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    candidates.push(join(here, '..', 'browser'), here);
  } catch {
    // import.meta unavailable — the cwd candidates above still apply.
  }

  roots = candidates.filter((dir) => existsSync(dir));
  return roots;
}

/** Reads a content file synchronously at build time (used for prerender params). */
export function readContentFile<T>(path: string): T | undefined {
  const file = findContentFile(path);
  return file ? (JSON.parse(readFileSync(file, 'utf-8')) as T) : undefined;
}
