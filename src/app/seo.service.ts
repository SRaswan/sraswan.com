import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const DEFAULT_SEO: SeoData = {
  title: 'Shaurya Raswan',
  description: 'Shaurya Raswan - Software Engineer / UCSD Student. Portfolio, projects, art, and blog.',
  image: 'imgs/pfp.png',
};

/**
 * Reads `data.seo` from the active route and keeps the document title and the
 * Open Graph / Twitter meta tags in sync on every navigation. Routes that omit
 * `data.seo` fall back to DEFAULT_SEO.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
  ) {}

  init(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => {
          let active = this.route;
          while (active.firstChild) {
            active = active.firstChild;
          }
          return active.snapshot.data['seo'] as SeoData | undefined;
        }),
      )
      .subscribe((seo) => this.apply({ ...DEFAULT_SEO, ...(seo || {}) }));
  }

  private apply(seo: SeoData): void {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    if (seo.image) {
      this.meta.updateTag({ property: 'og:image', content: seo.image });
      this.meta.updateTag({ name: 'twitter:image', content: seo.image });
    }
    if (seo.url) {
      this.meta.updateTag({ property: 'og:url', content: seo.url });
    }
  }
}
