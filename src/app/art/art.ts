import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Artwork {
  filename: string;
  include?: boolean;
}

@Component({
  selector: 'app-art',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './art.html',
  styleUrls: ['./art.css']
})
export class Art implements OnInit, OnDestroy {
  items: Artwork[] = [];
  active?: Artwork;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Artwork[]>('./artworks.json').subscribe({
      next: list => {
        this.items = list.filter(item => item.include);
        // after items are set, schedule layout
      },
      error: err => console.log('Failed to load artworks', err)
    });
  }

  open(item: Artwork) {
    this.active = item;
    const modal = document.getElementById('artModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal, { backdrop: true });
      bootstrapModal.show();
    }
  }

  clear() {
    this.active = undefined;
  }

  ngOnDestroy() {
    // Nothing to clean up for CSS-only layout
  }
}
