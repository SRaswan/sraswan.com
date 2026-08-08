import { RenderMode, ServerRoute } from '@angular/ssr';
import { readContentFile } from './server-content.interceptor';
import type { BlogsFile } from './blog/blog';

/**
 * Every route is prerendered to a real static HTML file so GitHub Pages serves
 * it with a 200 instead of falling through to 404.html, and so crawlers get
 * page content without executing JavaScript.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  // Legacy alias that redirects to '' — still needs a server entry to build.
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'art', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const blogs = readContentFile<BlogsFile>('blogs.json');
      return (blogs?.items || []).map((item) => ({ slug: item.slug }));
    },
  },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'resume', renderMode: RenderMode.Prerender },
];
