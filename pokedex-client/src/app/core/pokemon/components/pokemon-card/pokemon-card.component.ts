import { Component, input, output, inject } from '@angular/core';
import { CardComponent, BadgeComponent } from '../../../../../../projects/fish-ui/src/public-api';
import { PokemonListItem } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  imports: [CardComponent, BadgeComponent],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent {
  private pokemonService = inject(PokemonService);
  
  pokemon = input.required<PokemonListItem>();
  
  cardClick = output<PokemonListItem>();
  
  onCardClick() {
    this.cardClick.emit(this.pokemon());
  }
  
  getTypeColor(typeName: string): string {
    return this.pokemonService.getTypeColor(typeName);
  }

  formatPokemonNumber(id: number): string {
    return this.pokemonService.formatPokemonNumber(id);
  }

  capitalizeName(name: string): string {
    return this.pokemonService.capitalizeName(name);
  }
}
