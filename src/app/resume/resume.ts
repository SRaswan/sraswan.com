import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resume',
  standalone: true,
  templateUrl: './resume.html',
  styleUrls: ['./resume.css'],
  imports: [DatePipe]
})
export class Resume implements OnInit {
  private sanitizer = inject(DomSanitizer);

  // To update the resume: drop a new PDF in public/resumes/ named YY-MM-DD.pdf
  // and set `filename` to match. The "Updated" date is derived from the name.
  filename = '26-03-26';
  pdfUrl!: SafeResourceUrl;
  updatedAt?: Date;

  ngOnInit() {
    const [yy, mm, dd] = this.filename.split('-').map(Number);
    const year = 2000 + yy;
    this.updatedAt = new Date(year, mm - 1, dd);

    const url = `resumes/${this.filename}.pdf`;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
