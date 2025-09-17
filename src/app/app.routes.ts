import { Routes } from '@angular/router';
import { About } from './about/about';
import { Art } from './art/art';
import { Blog } from './blog/blog';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: About },
  { path: 'art', component: Art },
  { path: 'blog', component: Blog },
  { path: 'projects', component: Projects },
  { path: 'resume', component: Resume }
];
