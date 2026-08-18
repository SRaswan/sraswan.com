import { Routes } from '@angular/router';
import { About } from './about/about';
import { Art } from './art/art';
import { Blog } from './blog/blog';
import { blogPostSeoResolver } from './blog/blog-post-seo.resolver';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';

import { SITE_URL } from './seo.service';

export const routes: Routes = [
  {
    path: '',
    component: About,
    data: {
      seo: {
        title: 'Shaurya Raswan - Software Engineer / UCSD Student',
        description: 'Portfolio, projects, art, and blog by Shaurya Raswan.',
        image: `${SITE_URL}/imgs/pfp.png`,
        url: `${SITE_URL}/`,
      },
    },
  },
  { path: 'about', redirectTo: '', pathMatch: 'full' },
  {
    path: 'art',
    component: Art,
    data: {
      seo: {
        title: 'Art — Shaurya Raswan',
        description: 'A gallery of artwork by Shaurya Raswan.',
        url: `${SITE_URL}/art`,
        // The gallery page stays indexed, but the pieces themselves stay out
        // of Google Images rather than surfacing untitled next to photos of me.
        noimageindex: true,
      },
    },
  },
  {
    path: 'blog/:slug',
    component: Blog,
    // Title/description/image come from the post itself; the resolver also
    // sets noindex, so posts never compete with the About page for
    // "Shaurya Raswan". The /blog index below is still indexed.
    resolve: { seo: blogPostSeoResolver },
  },
  {
    path: 'blog',
    component: Blog,
    data: {
      seo: {
        title: 'Blog — Shaurya Raswan',
        description: 'Long-form writing and notes by Shaurya Raswan.',
        url: `${SITE_URL}/blog`,
        // The index stays indexed, but its post thumbnails stay out of Google
        // Images so they never surface alongside photos of me.
        noimageindex: true,
      },
    },
  },
  {
    path: 'projects',
    component: Projects,
    data: {
      seo: {
        title: 'Projects — Shaurya Raswan',
        description: 'Software, research, and hardware projects by Shaurya Raswan.',
        url: `${SITE_URL}/projects`,
      },
    },
  },
  {
    path: 'resume',
    component: Resume,
    data: {
      seo: {
        title: 'Resume — Shaurya Raswan',
        description: "Shaurya Raswan's resume.",
        url: `${SITE_URL}/resume`,
      },
    },
  },
];
