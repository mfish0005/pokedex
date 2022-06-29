import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {    
  pokemonId: number = 0;

  constructor(private http: HttpClient) { }

  setPokemonId(id: number): void {
    this.pokemonId = id;    
  }

  getPokemonId(): number {
    return this.pokemonId;
  }

  getPokemonList(): Pokemon[] {
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

  // Gets a single pokemon
  // @parameter: id: The pokedex number of the pokemon you want to get
  // @returns: An observable containing a Pokemon object
  getPokemonById(id: number): Observable<Pokemon> {    
    const url = 'https://pokeapi.co/api/v2/pokemon/' + id;

    // Make a GET request using the url to get the pokemon
    return this.http.get<Pokemon>(url);
  }
}

