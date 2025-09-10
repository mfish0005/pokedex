import { Component, input, output } from '@angular/core';
import { PokemonCardComponent } from '../../../../core/pokemon/components/pokemon-card/pokemon-card.component';
import { PokemonListItem } from '../../../../core/pokemon/models/pokemon.model';

@Component({
  selector: 'app-pokemon-grid',
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-grid.component.html',
  styleUrl: './pokemon-grid.component.scss'
})
export class PokemonGridComponent {
  pokemon = input.required<PokemonListItem[]>();
  
  pokemonSelect = output<PokemonListItem>();
  
  onPokemonSelect(pokemon: PokemonListItem) {
    this.pokemonSelect.emit(pokemon);
  }
}
