import { Routes } from '@angular/router';

export const errorRoutes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found').then((m) => m.default),
    data: { hideLayout: true },
  },
  {
    path: '500',
    loadComponent: () => import('./internal-server/internal-server').then((m) => m.default),
    data: { hideLayout: true },
  },
];
