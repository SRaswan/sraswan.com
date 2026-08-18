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
  /**
   * Keep the page out of search results. It stays crawlable and its links are
   * still followed, so link equity flows on to the rest of the site — it just
   * never appears as a result itself. Such a page also gets no canonical:
   * "don't index me" and "here is my canonical URL" are contradictory signals.
   */
  noindex?: boolean;
  /**
   * Keep this page's images out of Google Images while the page itself stays
   * indexed. Used on `/blog`, which lists post thumbnails: the posts are
   * already `noindex`, but the index that displays their images is not.
   */
  noimageindex?: boolean;
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

    // Open Graph stays on noindex pages: it drives link previews when the post
    // is shared, which is unrelated to whether search engines index it.
    if (seo.image) {
      const image = absolute(seo.image);
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    const directives: string[] = [];
    if (seo.noindex) {
      directives.push('noindex', 'follow');
    }
    if (seo.noimageindex) {
      directives.push('noimageindex');
    }

    // The removeTag branch matters as much as the set one — client-side
    // navigation reuses the same <head>, so a stale tag would leak onto the
    // next page.
    if (directives.length) {
      this.meta.updateTag({ name: 'robots', content: directives.join(', ') });
    } else {
      this.meta.removeTag('name="robots"');
    }

    // Only noindex drops the canonical. A noimageindex page is still indexed
    // and still needs one.
    this.setCanonical(seo.noindex ? undefined : canonical);
  }

  private setCanonical(href: string | undefined): void {
    const link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!href) {
      link?.remove();
      return;
    }

    if (link) {
      link.setAttribute('href', href);
      return;
    }

    const created = this.document.createElement('link');
    created.setAttribute('rel', 'canonical');
    created.setAttribute('href', href);
    this.document.head.appendChild(created);
  }
}

/** Open Graph and Twitter cards reject relative URLs. */
function absolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}/${url.replace(/^\.?\//, '')}`;
}
