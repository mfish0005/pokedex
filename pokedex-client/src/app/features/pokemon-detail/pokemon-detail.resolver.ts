import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PokemonService } from '../../core/pokemon/services/pokemon.service';
import { Pokemon } from '../../core/pokemon/models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailResolver implements Resolve<Pokemon | null> {

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Pokemon | null> {
    const idParam = route.paramMap.get('id');

    if (!idParam) {
      this.router.navigate(['/']);
      return of(null);
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id) || id <= 0) {
      this.router.navigate(['/']);
      return of(null);
    }

    return this.pokemonService.getPokemon(id).pipe(
      catchError((error) => {
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
