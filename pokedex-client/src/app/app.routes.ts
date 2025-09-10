import { Routes } from '@angular/router';
import { PokemonDetailResolver } from './features/pokemon-detail/pokemon-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/pokemon-list/pages/pokemon-list.component').then(m => m.PokemonListComponent),
    data: { showHeader: true, hideViewAllButton: true }
  },
  {
    path: 'pokemon/create',
    loadComponent: () => import('./features/pokemon-create/pages/pokemon-create.component').then(m => m.PokemonCreateComponent),
    data: { showHeader: true, hideViewAllButton: false }
  },
  {
    path: 'pokemon/:id/edit',
    loadComponent: () => import('./features/pokemon-edit/pages/pokemon-edit.component').then(m => m.PokemonEditComponent),
    data: { showHeader: true, hideViewAllButton: false }
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./features/pokemon-detail/pages/pokemon-detail.component').then(m => m.PokemonDetailComponent),
    resolve: {
      pokemon: PokemonDetailResolver
    },
    data: { showHeader: false, hideViewAllButton: false },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
