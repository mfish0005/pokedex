import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class DetailComponent implements OnInit {
  pokemon: any;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {    
    const pokemonId = this.pokemonService.getPokemonId();

    this.pokemon = this.pokemonService.getPokemonById(pokemonId).subscribe((response: any) => {
      // Build a Pokemon object using the data that's returned
      this.pokemon = {
        id: response.id,
        sprites: response.sprites,
        name: response.name        
      };       
    });
  }

}

