import { Routes } from '@angular/router';
import { getCaseStudy } from './data/case-studies';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then((m) => m.Home),
    title: 'Rishiraj Sajeev - Full Stack Engineer | NestJS, Angular, React, Next.js',
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./pages/case-study').then((m) => m.CaseStudyPage),
    title: (route) => {
      const study = getCaseStudy(route.paramMap.get('slug') ?? '');
      return study
        ? `${study.title} Case Study | Rishiraj Sajeev`
        : 'Case Study | Rishiraj Sajeev';
    },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
    title: '404 - Lost in the Void',
  },
];
