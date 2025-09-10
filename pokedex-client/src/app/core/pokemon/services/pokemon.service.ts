import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, POKEMON_TYPE_COLORS } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://localhost:44373/api';
  private readonly noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  constructor(private http: HttpClient) {}

  /**
   * Get a list of Pokémon with pagination
   * 
   * @param pageSize - The number of Pokémon to return per page
   * @param page - The page number (1-based)
   * @param search - Optional search term to filter by name
   * @returns An Observable of PokemonListResponse
   */
  getPokemonList(pageSize: number = 12, page: number = 1, search?: string): Observable<PokemonListResponse> {
    let url = `${this.baseUrl}/pokemon?page=${page}&pageSize=${pageSize}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    return this.http.get<PokemonListResponse>(url, { headers: this.noCacheHeaders });
  }

  /**
   * Get detailed information for a specific Pokémon
   * 
   * @param id - The ID of the Pokémon
   * @returns An Observable of Pokemon
   */
  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`, { headers: this.noCacheHeaders });
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
   * Search for Pokemon by name
   *
   * @param name - The search query (name)
   * @returns An Observable of Pokemon or null if not found
   */
  getPokemonByName(name: string): Observable<Pokemon | null> {
    if (!name || name.trim() === '') {
      return of(null);
    }

    const searchTerm = name.trim().toLowerCase();
    
    return this.http.get<Pokemon[]>(`${this.baseUrl}/pokemon/search?search=${encodeURIComponent(searchTerm)}`, { headers: this.noCacheHeaders }).pipe(
      map(results => results.length > 0 ? results[0] : null),
      catchError(() => of(null))
    );
  }

  /**
   * Search for Pokemon with partial name matching
   * This method attempts to find Pokemon by partial name match
   *
   * @param query - The search query
   * @param limit - Maximum number of results to return
   * @returns An Observable of Pokemon array
   */
  searchPartialPokemon(query: string, limit: number = 10): Observable<Pokemon[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const searchQuery = query.trim().toLowerCase();
    
    return this.http.get<Pokemon[]>(`${this.baseUrl}/pokemon/search?search=${encodeURIComponent(searchQuery)}`, { headers: this.noCacheHeaders }).pipe(
      map(results => results.slice(0, limit)),
      catchError(() => of([]))
    );
  }

  /**
   * Get basic info for a specific Pokemon for navigation
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
