import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements AfterViewInit {
  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}