import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, POKEMON_TYPE_COLORS } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private readonly noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  constructor(private http: HttpClient) {}

  /**
   * Get a list of Pokémon with pagination
   * 
   * @param limit - The number of Pokémon to return
   * @param offset - The offset from the first Pokémon to return
   * @returns An Observable of PokemonListResponse
   */
  getPokemonList(limit: number = 12, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
      { headers: this.noCacheHeaders }
    );
  }

  /**
   * Get detailed information for a specific Pokémon
   * 
   * @param nameOrId - The name or ID of the Pokémon
   * @returns An Observable of Pokemon
   */
  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`, { headers: this.noCacheHeaders });
  }

  /**
   * Format Pokémon number with leading zeros
   * 
   * @param id - The ID of the Pokémon
   * @returns A string with the formatted Pokémon number
   */
  formatPokemonNumber(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  /**
   * Capitalize the first letter of a string (for Pokemon names and types)
   * 
   * @param str - The string to capitalize
   * @returns A string with the first letter capitalized
   */
  capitalizeName(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get the color for a specific Pokemon type
   * 
   * @param typeName - The name of the Pokemon type
   * @returns A string with the color of the Pokemon type
   */
  getTypeColor(typeName: string): string {
    return POKEMON_TYPE_COLORS[typeName] || '#68A090';
  }

  /**
   * Get the previous ID of a Pokemon
   * 
   * @param currentId - The current ID of the Pokémon
   * @returns The previous ID of the Pokémon
   */
  getPreviousPokemonId(currentId: number): number {
    return currentId <= 1 ? 1 : currentId - 1;
  }

  /**
   * Get the next ID of a Pokemon
   * 
   * @param currentId - The current ID of the Pokémon
   * @returns The next ID of the Pokémon
   */
  getNextPokemonId(currentId: number): number {
    return currentId + 1;
  }

  /**
   * Get basic info for a specific Pokemon (name) for navigation
   * 
   * @param id - The ID of the Pokémon
   * @returns An Observable of { id: number; name: string } | null
   */
  getPokemonBasicInfo(id: number): Observable<{ id: number; name: string } | null> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`, { headers: this.noCacheHeaders }).pipe(
      map(pokemon => ({
        id: pokemon.id,
        name: this.capitalizeName(pokemon.name)
      })),
      catchError(() => of(null))
    );
  }
} 
