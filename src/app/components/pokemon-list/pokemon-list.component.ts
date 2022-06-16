import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemon: Pokemon[] = [
    {
      id: 132,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
