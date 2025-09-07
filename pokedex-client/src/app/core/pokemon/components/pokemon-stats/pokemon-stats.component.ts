import { Component, input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-stats',
  imports: [],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss'
})
export class PokemonStatsComponent {
  pokemon = input.required<Pokemon>();

  formatStatName(statName: string): string {
    return statName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getStatPercentage(statValue: number): number {    
    return Math.min((statValue / 255) * 100, 100);
  }
}
