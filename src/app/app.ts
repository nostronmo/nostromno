import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs';
import { Metaballs } from './components/metaballs/metaballs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, Footer, Metaballs],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  showLayout = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap((route) => route.data),
      map((data) => !data['hideLayout']),
    ),
    { initialValue: true },
  );

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {});
  }
}
