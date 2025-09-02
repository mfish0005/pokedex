import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

// Import our Fish UI components
import { Card, Badge, Button, Spinner } from '../../projects/fish-ui/src/public-api';

// Import our services and models
import { PokemonService } from './services/pokemon.service';
import { Pokemon, POKEMON_TYPE_COLORS } from './models/pokemon.interface';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HttpClientModule,
    Card,
    Badge,
    Button,
    Spinner
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [PokemonService]
})
export class App implements OnInit {
  protected readonly title = signal('Pokédex');
  protected readonly pokemon = signal<Pokemon[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadInitialPokemon();
  }

  loadInitialPokemon() {
    this.loading.set(true);
    this.error.set(null);

    // Get first 12 Pokémon
    this.pokemonService.getPokemonList(12, 0).subscribe({
      next: (response) => {
        // Get detailed data for each Pokémon
        const requests = response.results.map(pokemon => 
          this.pokemonService.getPokemon(pokemon.name)
        );
        
        forkJoin(requests).subscribe({
          next: (pokemonDetails) => {
            this.pokemon.set(pokemonDetails);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading Pokémon details:', err);
            this.error.set('Failed to load Pokémon details');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading Pokémon list:', err);
        this.error.set('Failed to load Pokémon list');
        this.loading.set(false);
      }
    });
  }

  loadMorePokemon() {
    // For now, just reload the same 12 Pokémon
    this.loadInitialPokemon();
  }

  getTypeColor(typeName: string): string {
    return POKEMON_TYPE_COLORS[typeName] || '#68A090';
  }

  formatPokemonNumber(id: number): string {
    return this.pokemonService.formatPokemonNumber(id);
  }

  capitalizeName(name: string): string {
    return this.pokemonService.capitalizeFirstLetter(name);
  }
}
