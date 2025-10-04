import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: 'about', renderMode: RenderMode.Server },
  { path: 'art', renderMode: RenderMode.Client },
  { path: 'blog', renderMode: RenderMode.Server },
  { path: 'projects', renderMode: RenderMode.Client },
  { path: 'resume', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server }
];