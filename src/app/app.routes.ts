import { Routes } from '@angular/router';
import { About } from './about/about';
import { Art } from './art/art';
import { Blog } from './blog/blog';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';
// import { RenderMode, ServerRoute } from '@angular/ssr';

export const routes: Routes = [
  { path: '', component: About,
     data: {
      seo: {
        title: 'Shaurya Raswan - Software Engineer / UCSD Student',
        description: 'Portfolio, projects, art, and blog by Shaurya Raswan.',
        image: 'https://sraswan.github.io/sraswan.com/imgs/pfp.png',
        url: 'https://sraswan.github.io/sraswan.com/'
      }
    }},
  { path: 'about', redirectTo: '', pathMatch: 'full' },

  { path: 'art', component: Art },
  { path: 'blog', component: Blog },
  { path: 'projects', component: Projects },
  { path: 'resume', component: Resume },
];
