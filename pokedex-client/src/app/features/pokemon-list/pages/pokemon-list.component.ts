import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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

  protected readonly title = signal('Pokedex');
  protected readonly pokemon = signal<PokemonListItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentPage = signal(1);
  protected readonly searchQuery = signal('');
  protected readonly isSearching = signal(false);
  protected readonly hasMorePages = signal(true);
  protected readonly isInSearchMode = signal(false);
  private readonly pageSize = 12;

  ngOnInit() {        
    this.loadInitialPokemon();
  }  

  loadInitialPokemon() {    
    this.pokemonService.getPokemonList(this.pageSize, 1).subscribe({
      next: (response) => {                
        this.pokemon.set(response.results);
        this.loading.set(false);
        this.currentPage.set(2);
        this.hasMorePages.set(response.page < response.totalPages);
      },
      error: (err: any) => {
        console.error('Error loading Pokemon list:', err);
        if (this.loading()) {
          this.error.set('Failed to load Pokemon list');
          this.loading.set(false);
        }
      }
    });
  }

  loadMorePokemon() {    
    if (this.loadingMore() || !this.hasMorePages()) return;
        
    this.loadingMore.set(true);
      
    this.pokemonService.getPokemonList(this.pageSize, this.currentPage()).subscribe({
      next: (response) => {        
        this.pokemon.update(current => [...current, ...response.results]);
                
        this.currentPage.update(current => current + 1);
        this.hasMorePages.set(response.page < response.totalPages);
        this.loadingMore.set(false);
      },
      error: (err: any) => {
        console.error('Error loading more Pokemon:', err);
        this.loadingMore.set(false);
      }
    });
  }

  onPokemonSelect(pokemon: PokemonListItem) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.loading() || this.loadingMore() || this.error() || this.isSearching() || this.isInSearchMode() || !this.hasMorePages()) {
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
      this.isInSearchMode.set(false);
      this.isSearching.set(false);
      this.loadInitialPokemon();
      return;
    }

    this.isSearching.set(true);
    this.isInSearchMode.set(true);
    this.error.set(null);
    
    this.pokemonService.searchPartialPokemon(query.trim(), 20).subscribe({
      next: (results) => {        
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
    this.isInSearchMode.set(false);
    this.isSearching.set(false);
    this.error.set(null);
    this.loadInitialPokemon();
  }
}
