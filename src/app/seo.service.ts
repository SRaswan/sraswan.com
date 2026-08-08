import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Canonical host — the single place the site's public address is defined.
 * Every indexable URL is this plus the router path. The GitHub Pages copy
 * serves the same build and canonicalises back here, so search engines
 * consolidate all ranking signal onto this host. Change this one line (and
 * `src/robots.txt` / `src/sitemap.xml`) to move to a custom domain.
 */
export const SITE_URL = 'https://sraswan.vercel.app';

const DEFAULT_SEO: SeoData = {
  title: 'Shaurya Raswan',
  description: 'Shaurya Raswan - Software Engineer / UCSD Student. Portfolio, projects, art, and blog.',
  image: `${SITE_URL}/imgs/pfp.png`,
};

/**
 * Reads `data.seo` from the active route and keeps the document title, the
 * canonical link, and the Open Graph / Twitter meta tags in sync on every
 * navigation. Routes that omit `data.seo` fall back to DEFAULT_SEO.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  init(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => {
          let active = this.route;
          while (active.firstChild) {
            active = active.firstChild;
          }
          return {
            seo: active.snapshot.data['seo'] as SeoData | undefined,
            url: event.urlAfterRedirects,
          };
        }),
      )
      .subscribe(({ seo, url }) => this.apply({ ...DEFAULT_SEO, ...(seo || {}) }, url));
  }

  private apply(seo: SeoData, routerUrl: string): void {
    // Derived from the live router path rather than route data, so parameterised
    // routes (blog/:slug) get their own canonical instead of sharing one.
    // Trailing slash matters: each route is prerendered to `<route>/index.html`,
    // and static hosts redirect `/projects` to `/projects/`. Pointing the
    // canonical at the redirect target avoids a canonical->redirect chain.
    const path = routerUrl.split('?')[0].split('#')[0];
    const canonical = SITE_URL + (path.endsWith('/') ? path : `${path}/`);

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    if (seo.image) {
      const image = absolute(seo.image);
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }
}

/** Open Graph and Twitter cards reject relative URLs. */
function absolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}/${url.replace(/^\.?\//, '')}`;
}
