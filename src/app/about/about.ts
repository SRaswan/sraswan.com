import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Role {
  text: string;
  url?: string;
  title?: string;
}

export interface Social {
  label: string;
  icon: string;
  url: string;
}

export interface Profile {
  name: string;
  image: string;
  roles: Role[];
  bio: string;
  socials: Social[];
}

export interface Education {
  school: string;
  note?: string;
  period: string;
  location: string;
}

export interface ExperienceDetail {
  prefix?: string;
  label: string;
  url?: string;
}

export interface Experience {
  role: string;
  org: string;
  orgUrl?: string;
  period: string;
  location: string;
  details?: ExperienceDetail[];
}

export interface AboutFile {
  profile: Profile;
  education: Education[];
  experience: Experience[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements OnInit {
  profile?: Profile;
  education: Education[] = [];
  experience: Experience[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.http.get<AboutFile>('./about.json').subscribe({
      next: (data) => {
        this.profile = data.profile;
        this.education = data.education || [];
        this.experience = data.experience || [];
      },
      error: (err) => console.error('Failed to load about content', err),
    });
  }
}
