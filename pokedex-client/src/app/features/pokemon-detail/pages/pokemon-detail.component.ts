import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CardComponent, ButtonComponent, IconComponent } from '@fish-ui/components';
import { LoadingStateComponent } from '../../../core/pokemon/components/loading-state/loading-state.component';
import { PokemonBasicInfoComponent } from '../../../core/pokemon/components/pokemon-basic-info/pokemon-basic-info.component';
import { PokemonStatsComponent } from '../../../core/pokemon/components/pokemon-stats/pokemon-stats.component';
import { PokemonInfoComponent } from '../../../core/pokemon/components/pokemon-info/pokemon-info.component';
import { PokemonService } from '../../../core/pokemon/services/pokemon.service';
import { Pokemon } from '../../../core/pokemon/models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  imports: [
    CardComponent,
    ButtonComponent,
    LoadingStateComponent,
    IconComponent,
    PokemonBasicInfoComponent,
    PokemonStatsComponent,
    PokemonInfoComponent
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  providers: [PokemonService]
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pokemonService = inject(PokemonService);
  private routeSubscription?: Subscription;

  protected readonly pokemon = signal<Pokemon | null>(null);
  protected readonly loading = signal(false);
  protected readonly previousPokemon = signal<{ id: number; name: string } | null>(null);
  protected readonly nextPokemon = signal<{ id: number; name: string } | null>(null);

  ngOnInit() {    
    this.routeSubscription = this.route.data.subscribe(data => {
      const resolvedPokemon = data['pokemon'] as Pokemon | null;
      
      if (resolvedPokemon) {
        this.pokemon.set(resolvedPokemon);
        this.loadNavigationData(resolvedPokemon.id);
      } else {        
        console.log('No Pokemon data received, redirecting to home');
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  private loadNavigationData(currentId: number) {
    const previousId = this.pokemonService.getPreviousPokemonId(currentId);
    if (previousId !== currentId) {
      this.pokemonService.getPokemonBasicInfo(previousId).subscribe({
        next: (pokemonInfo) => this.previousPokemon.set(pokemonInfo),
        error: () => this.previousPokemon.set(null)
      });
    } else {
      this.previousPokemon.set(null);
    }
    
    const nextId = this.pokemonService.getNextPokemonId(currentId);
    this.pokemonService.getPokemonBasicInfo(nextId).subscribe({
      next: (pokemonInfo) => this.nextPokemon.set(pokemonInfo),
      error: () => this.nextPokemon.set(null)
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  navigateToPrevious() {
    const previousPokemon = this.previousPokemon();
    if (previousPokemon) {
      this.router.navigate(['/pokemon', previousPokemon.id]);
    }
  }

  navigateToNext() {
    const nextPokemon = this.nextPokemon();
    if (nextPokemon) {
      this.router.navigate(['/pokemon', nextPokemon.id]);
    }
  }
}