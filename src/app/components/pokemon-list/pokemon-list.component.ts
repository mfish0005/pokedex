import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [
    {
      id: 10,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 9,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 8,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 7,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 6,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 5,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 4,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 3,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 2,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },
    {
      id: 1,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },

    {
      id: 12,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },

    {
      id: 11,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
      },
      name: 'Ditto'
    },

    
  ];

  constructor() { }

  ngOnInit(): void {
    
    this.pokemonList.sort((a, b) => a.id - b.id);
    console.log(this.pokemonList)
  }

}
