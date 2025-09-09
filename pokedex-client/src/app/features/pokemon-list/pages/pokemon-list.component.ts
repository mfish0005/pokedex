import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LoadingStateComponent } from '../../../core/pokemon/components/loading-state/loading-state.component';
import { PokemonGridComponent } from '../components/pokemon-grid/pokemon-grid.component';
import { PokemonService } from '../../../core/pokemon/services/pokemon.service';
import { Pokemon, PokemonListItem } from '../../../core/pokemon/models/pokemon.model';
import { SearchComponent } from '../../../../../projects/fish-ui/src/public-api';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    LoadingStateComponent,
    PokemonGridComponent,
    SearchComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  providers: [PokemonService]
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  protected readonly title = signal('Pokédex');
  protected readonly pokemon = signal<Pokemon[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentOffset = signal(0);
  protected readonly searchQuery = signal('');
  protected readonly isSearching = signal(false);
  protected readonly searchResults = signal<Pokemon[]>([]);
  protected readonly allPokemon = signal<Pokemon[]>([]);
  private readonly pageSize = 12;

  ngOnInit() {        
    this.loadInitialPokemon();
  }  

  loadInitialPokemon() {
    // Get the names of the initial pokemon
    this.pokemonService.getPokemonList(this.pageSize, 0).subscribe({
      next: (response) => {        
        // Create requests for each pokemon's name
        const requests = response.results.map((pokemon: PokemonListItem) =>
          this.pokemonService.getPokemon(pokemon.name)
        );
        // Join the requests together to get detailed info for each pokemon
        forkJoin(requests).subscribe({
          next: (pokemonDetails: Pokemon[]) => {
            // Update the pokemon signal with the detailed info
            if (this.loading()) {
              this.pokemon.set(pokemonDetails);
              this.allPokemon.set(pokemonDetails);
              this.loading.set(false);
              this.currentOffset.set(this.pageSize);
            }
          },
          error: (err: any) => {
            console.error('Error loading Pokémon details:', err);
            if (this.loading()) {
              this.error.set('Failed to load Pokémon details');
              this.loading.set(false);
            }
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading Pokémon list:', err);
        if (this.loading()) {
          this.error.set('Failed to load Pokémon list');
          this.loading.set(false);
        }
      }
    });
  }

  loadMorePokemon() {    
    if (this.loadingMore()) return;
        
    this.loadingMore.set(true);
  
    // Get the names of more pokemon starting from current offset
    this.pokemonService.getPokemonList(this.pageSize, this.currentOffset()).subscribe({
      next: (response) => {
        // Create requests for each pokemon's name
        const requests = response.results.map((pokemon: PokemonListItem) => 
          this.pokemonService.getPokemon(pokemon.name)
        );
        
        // Join the requests together to get detailed info for each pokemon
        forkJoin(requests).subscribe({
          next: (pokemonDetails: Pokemon[]) => {
            // Add the new pokemon to the existing list
            this.pokemon.update(current => [...current, ...pokemonDetails]);
            this.allPokemon.update(current => [...current, ...pokemonDetails]);
            
            // Update the offset for the next batch
            this.currentOffset.update(current => current + this.pageSize);
            this.loadingMore.set(false);
          },
          error: (err: any) => {
            console.error('Error loading more Pokémon:', err);
            this.loadingMore.set(false);
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading more Pokémon:', err);
        this.loadingMore.set(false);
      }
    });
  }

  onPokemonSelect(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.loading() || this.loadingMore() || this.error() || this.isSearching()) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const threshold = 200;
    const within200pxOfBottom = documentHeight - (scrollTop + windowHeight) < threshold;

    if (within200pxOfBottom) {
      this.loadMorePokemon();
    }
  }

  onSearch(query: string) {
    this.searchQuery.set(query);

    if (!query.trim()) {
      // If search is empty, show all pokemon
      this.pokemon.set(this.allPokemon());
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);
    this.error.set(null);

    // Try exact search
    this.pokemonService.getPokemonByName(query.trim()).subscribe({
      next: (result) => {
        if (result) {
          // Found exact match
          this.searchResults.set([result]);
          this.pokemon.set([result]);
          this.isSearching.set(false);
        } else {
          // No exact match, try partial search
          this.performPartialSearch(query.trim());
        }
      },
      error: () => {
        // Exact search failed, try partial search
        this.performPartialSearch(query.trim());
      }
    });
  }

  private performPartialSearch(query: string) {
    // Search through all loaded pokemon first (faster)
    const localResults = this.allPokemon().filter(pokemon =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localResults.length > 0) {
      this.searchResults.set(localResults);
      this.pokemon.set(localResults);
      this.isSearching.set(false);
      return;
    }

    // If no local results, try API search
    this.pokemonService.searchPartialPokemon(query, 20).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.pokemon.set(results);
        this.isSearching.set(false);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error.set('Search failed. Please try again.');
        this.isSearching.set(false);
      }
    });
  }

  onSearchClear() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.pokemon.set(this.allPokemon());
    this.isSearching.set(false);
    this.error.set(null);
  }
}
