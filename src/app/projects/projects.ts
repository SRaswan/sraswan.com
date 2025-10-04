import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe, isPlatformBrowser } from '@angular/common';

export interface ProjectsFile {
  lastUpdated?: string;
  items: Project[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  skills: string[];
  description: string;
  image: string;
  blogUrl?: string;
  links?: ProjectLink[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, HttpClientModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']

})
export class Projects implements OnInit {
  projects: Project[] = [];
  loading = true;
  error?: string;
  projectsFile?: ProjectsFile;
  updatedAt?: Date;

  constructor(
    private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<ProjectsFile>('./projects.json').subscribe({
        next: data => {
          this.projectsFile = data;
          this.projects = data.items || [];
          this.updatedAt = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
          this.loading = false;
          console.log(this.projects);
        },
        error: () => { this.error = 'Failed to load projects'; this.loading = false; }
      });
    }
  }
}
