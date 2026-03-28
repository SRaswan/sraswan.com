import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

export interface BlogItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  image?: string;
  markdownFile: string;
}

export interface BlogsFile {
  lastUpdated?: string;
  items: BlogItem[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MarkdownModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  blogs: BlogItem[] = [];
  loading = true;
  error?: string;
  updatedAt?: Date;
  activeSlug?: string;
  activeBlog?: BlogItem;
  shareCopied = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading = false;
      return;
    }

    this.http.get<BlogsFile>('./blogs.json').subscribe({
      next: data => {
        this.blogs = [...(data.items || [])].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.updatedAt = data.lastUpdated ? new Date(data.lastUpdated) : undefined;

        this.route.paramMap.subscribe(params => {
          this.activeSlug = params.get('slug') || undefined;
          this.activeBlog = this.activeSlug
            ? this.blogs.find(blog => blog.slug === this.activeSlug)
            : undefined;
          this.shareCopied = false;

          if (this.activeSlug && !this.activeBlog) {
            this.error = 'Blog post not found.';
          } else {
            this.error = undefined;
          }

          this.loading = false;
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
      },
      error: () => {
        this.error = 'Failed to load blog metadata';
        this.loading = false;
      }
    });
  }

  getMarkdownPath(item: BlogItem): string {
    return `./blog/${item.markdownFile}`;
  }

  async copyCurrentPostUrl(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const url = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.shareCopied = true;
      window.setTimeout(() => {
        this.shareCopied = false;
      }, 1800);
    } catch {
      this.shareCopied = false;
    }
  }

}
