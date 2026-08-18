import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResolveFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SeoData } from '../seo.service';
import { BlogsFile } from './blog';

/**
 * Per-post SEO metadata, read from `blogs.json` at navigation time.
 *
 * This is a resolver rather than something the Blog component sets, because
 * `NavigationEnd` — which is what `SeoService` listens to — fires *after*
 * component activation. A component calling into SeoService from `ngOnInit`
 * would be immediately overwritten by the route's own data. Resolvers run
 * before activation, and their result is merged into `route.data`, overriding
 * the static `data.seo` for the same key.
 *
 * Runs during prerendering too: navigation waits for resolvers, and the server
 * content interceptor serves `blogs.json` off disk.
 */
const FALLBACK: SeoData = {
  title: 'Blog — Shaurya Raswan',
  description: 'Long-form writing and notes by Shaurya Raswan.',
  noindex: true,
  noimageindex: true,
};

export const blogPostSeoResolver: ResolveFn<SeoData> = (route) => {
  const slug = route.paramMap.get('slug');

  return inject(HttpClient)
    .get<BlogsFile>('./blogs.json')
    .pipe(
      map((data) => {
        const post = (data.items || []).find((item) => item.slug === slug);

        if (!post) {
          return FALLBACK;
        }

        return {
          title: `${post.title} — Shaurya Raswan`,
          description: post.excerpt || FALLBACK.description,
          image: post.image,
          // Posts stay out of search results; this metadata is for the browser
          // tab and for link previews when a post is shared. noimageindex is
          // belt-and-braces: a noindex page has no landing page for its images
          // anyway, but this states the intent rather than relying on it.
          noindex: true,
          noimageindex: true,
        } satisfies SeoData;
      }),
      catchError(() => of(FALLBACK)),
    );
};
