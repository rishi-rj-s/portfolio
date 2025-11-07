import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Rishiraj Sajeev - Full-Stack Developer'
  },
  {
    path: 'case-study/tagtics',
    loadComponent: () => import('./pages/case-studies/tagtics/tagtics').then(m => m.TagticsComponent),
    title: 'Tagtics Case Study - Rishiraj Sajeev'
  },
  {
    path: 'case-study/eezy-cabs',
    loadComponent: () => import('./pages/case-studies/eezy-cabs/eezy-cabs').then(m => m.EezyCabsComponent),
    title: 'EEZY-CABS Case Study - Rishiraj Sajeev'
  },
  {
    path: 'case-study/apply-log',
    loadComponent: () => import('./pages/case-studies/apply-log/apply-log').then(m => m.ApplyLogComponent),
    title: 'Apply Log Case Study - Rishiraj Sajeev'
  },
  {
    path: 'case-study/fashion-studio',
    loadComponent: () => import('./pages/case-studies/fashion-studio/fashion-studio').then(m => m.FashionStudioComponent),
    title: 'Fashion Studio Case Study - Rishiraj Sajeev'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
