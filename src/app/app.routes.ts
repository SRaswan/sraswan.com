import { Routes } from '@angular/router';
import { About } from './about/about';
import { Art } from './art/art';
import { Blog } from './blog/blog';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';

const SITE_URL = 'https://sraswan.github.io/sraswan.com';

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
      },
    },
  },
  {
    path: 'blog/:slug',
    component: Blog,
    data: {
      seo: {
        title: 'Blog — Shaurya Raswan',
        description: 'Long-form writing and notes by Shaurya Raswan.',
        url: `${SITE_URL}/blog`,
      },
    },
  },
  {
    path: 'blog',
    component: Blog,
    data: {
      seo: {
        title: 'Blog — Shaurya Raswan',
        description: 'Long-form writing and notes by Shaurya Raswan.',
        url: `${SITE_URL}/blog`,
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
