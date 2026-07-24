import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ slug: 'tagtics' }, { slug: 'green-power-india' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
