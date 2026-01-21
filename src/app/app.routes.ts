import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.Home),
    title: 'Rishiraj Sajeev - Full-Stack Developer'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then(m => m.NotFound),
    title: '404 - Lost in the Void'
  }
];
