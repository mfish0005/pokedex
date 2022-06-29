import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { DetailComponent } from './components/detail/pokemon-detail.component';

const routes: Routes = [
  { path: '', component: BookComponent },
  { path: 'pokemon-list', component: PokemonListComponent },
  { path: 'pokemon-detail', component: DetailComponent, },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
