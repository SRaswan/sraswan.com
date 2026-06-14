import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Shaurya Raswan');
  activeIndex = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.init();
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }
}
