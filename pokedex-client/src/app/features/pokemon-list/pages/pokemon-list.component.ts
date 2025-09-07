import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PokemonGridComponent } from '../components/pokemon-grid/pokemon-grid.component';
import { PokemonService } from '../../../core/pokemon/services/pokemon.service';
import { Pokemon, PokemonListItem } from '../../../core/pokemon/models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    LoadingStateComponent,    
    PokemonGridComponent
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
    if (this.loading() || this.loadingMore() || this.error()) {
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
}