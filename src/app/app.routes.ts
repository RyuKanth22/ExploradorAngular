import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'peliculas' },
  {
    path: 'peliculas',
    title: 'Películas · Explora',
    data: { dataset: 'movies' },
    loadComponent: () => import('./features/explore/explore-page').then((m) => m.ExplorePage),
  },
  {
    path: 'clima',
    title: 'Clima · Explora',
    data: { dataset: 'weather' },
    loadComponent: () => import('./features/explore/explore-page').then((m) => m.ExplorePage),
  },
  { path: '**', redirectTo: 'peliculas' },
];
