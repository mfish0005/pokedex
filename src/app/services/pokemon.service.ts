import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getPokemon(): Pokemon[] {
    // Create an array to hold the GET urls
    let pokemonUrls: string[] = [];

    // Create the GET url for 151 pokemon
    for(let i = 1; i <= 151; i++) {
      // Create the url
      let url = 'https://pokeapi.co/api/v2/pokemon/';
      // Add the pokemon's id onto the end of it
      url = url.concat(i.toString())      
      // Push the url into the array
      pokemonUrls.push(url);
    }

    // Create an array to hold the pokemon
    let pokemonList: Pokemon[] = [];
    
    pokemonUrls.forEach(url => {
      this.http.get(url).subscribe((response: any) => {
        let pokemon: Pokemon = {
          id: response.id,
          name: response.name,
          sprites: response.sprites
        }
        // Push each pokemon into the array
        pokemonList.push(pokemon)
      });
    })

    return pokemonList;
    // Return the array as an observable
  }
}
