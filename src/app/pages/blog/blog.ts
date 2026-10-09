import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { marked } from 'marked';

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
})
export class Blog implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  postHtml = signal<SafeHtml | null>(null);
  loading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.loading.set(false);
      return;
    }

    this.http
      .get(`assets/blogs/${slug}.md`, { responseType: 'text' })
      .subscribe(async (markdownText) => {
        if (markdownText) {
          const rawHtml = await marked.parse(markdownText);
          this.postHtml.set(this.sanitizer.bypassSecurityTrustHtml(rawHtml));
        }
        this.loading.set(false);
      });
  }
}
