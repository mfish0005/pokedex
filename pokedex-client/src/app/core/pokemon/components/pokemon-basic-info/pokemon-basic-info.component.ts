import { Component, input, inject } from '@angular/core';
import { BadgeComponent } from '../../../../../../projects/fish-ui/src/public-api';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-basic-info',
  imports: [BadgeComponent],
  templateUrl: './pokemon-basic-info.component.html',
  styleUrl: './pokemon-basic-info.component.scss'
})
export class PokemonBasicInfoComponent {
  private pokemonService = inject(PokemonService);
  
  pokemon = input.required<Pokemon>();

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
