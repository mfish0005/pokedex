import { Routes } from '@angular/router';
import { PokemonDetailResolver } from './features/pokemon-detail/pokemon-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/pokemon-list/pages/pokemon-list.component').then(m => m.PokemonListComponent),
    data: { showHeader: true }
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./features/pokemon-detail/pages/pokemon-detail.component').then(m => m.PokemonDetailComponent),
    resolve: {
      pokemon: PokemonDetailResolver
    },
    data: { showHeader: false },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
