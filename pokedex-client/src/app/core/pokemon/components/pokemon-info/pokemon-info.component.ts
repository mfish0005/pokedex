import { Component, input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-info',
  imports: [],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.scss'
})
export class PokemonInfoComponent {
  pokemon = input.required<Pokemon>();

  formatHeight(height: number): string {
    const meters = height / 10;
    return `${meters}m`;
  }

  formatWeight(weight: number): string {
    const kg = weight / 10;
    return `${kg}kg`;
  }
}
