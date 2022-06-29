import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  
  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {    
    this.pokemonList = this.pokemonService.getPokemonList();    
  }

  pokemonClicked(id: number) {    
    this.pokemonService.setPokemonId(id);
  }
}


