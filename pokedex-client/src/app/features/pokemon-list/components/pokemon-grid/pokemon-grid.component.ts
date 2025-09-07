import { Component, input, output } from '@angular/core';
import { PokemonCardComponent } from '../../../../core/pokemon/components/pokemon-card/pokemon-card.component';
import { Pokemon } from '../../../../core/pokemon/models/pokemon.model';

@Component({
  selector: 'app-pokemon-grid',
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-grid.component.html',
  styleUrl: './pokemon-grid.component.scss'
})
export class PokemonGridComponent {
  pokemon = input.required<Pokemon[]>();
  
  pokemonSelect = output<Pokemon>();
  
  onPokemonSelect(pokemon: Pokemon) {
    this.pokemonSelect.emit(pokemon);
  }
}
