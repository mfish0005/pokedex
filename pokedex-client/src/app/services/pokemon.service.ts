import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, PokemonListItem } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  /**
   * Get a list of Pokémon with pagination
   */
  getPokemonList(limit: number = 12, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Get detailed information for a specific Pokémon
   */
  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  /**
   * Get multiple Pokémon details at once
   */
  getMultiplePokemon(pokemonList: PokemonListItem[]): Observable<Pokemon[]> {
    const requests = pokemonList.map(pokemon => 
      this.getPokemon(pokemon.name)
    );
    
    return forkJoin(requests);
  }

  /**
   * Get the first 12 Pokémon (for our initial display)
   */
  getInitialPokemon(): Observable<Pokemon[]> {
    return this.getPokemonList(12, 0).pipe(
      switchMap(response => {
        const requests = response.results.map(pokemon => 
          this.getPokemon(pokemon.name)
        );
        return forkJoin(requests);
      })
    );
  }

  /**
   * Extract Pokémon ID from URL
   */
  extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  /**
   * Format Pokémon number with leading zeros
   */
  formatPokemonNumber(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  /**
   * Capitalize the first letter of a string
   */
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
} 