import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'me',
  },
  {
    path: 'me',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: { hideLayout: false },
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
    data: { hideLayout: false },
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/errors/errors.routes').then((m) => m.errorRoutes),
  },
];
