import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';
import { CreatePokemonRequest, Pokemon, PokemonListResponse } from '../models/pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('pure helpers', () => {
    it('formatPokemonNumber pads id with leading zeros', () => {
      expect(service.formatPokemonNumber(1)).toBe('#0001');
      expect(service.formatPokemonNumber(152)).toBe('#0152');
    });

    it('capitalizeName capitalizes the first letter', () => {
      expect(service.capitalizeName('bulbasaur')).toBe('Bulbasaur');
    });

    it('getTypeColor returns known type color or default', () => {
      expect(service.getTypeColor('fire')).toBe('#F08030');
      expect(service.getTypeColor('unknown-type')).toBe('#68A090');
    });

    it('getPreviousPokemonId does not go below 1', () => {
      expect(service.getPreviousPokemonId(1)).toBe(1);
      expect(service.getPreviousPokemonId(5)).toBe(4);
    });

    it('getNextPokemonId increments id', () => {
      expect(service.getNextPokemonId(151)).toBe(152);
    });
  });

  describe('HTTP', () => {
    it('getPokemonList requests paginated endpoint', () => {
      const mockResponse: PokemonListResponse = {
        count: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1,
        results: [{ id: 1, name: 'bulbasaur', imageUrl: '', types: [] }]
      };

      service.getPokemonList(12, 1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:5150/api/pokemon?page=1&pageSize=12');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('getPokemonList appends search query when provided', () => {
      let completed = false;
      service.getPokemonList(12, 1, 'char').subscribe(() => (completed = true));

      const req = httpMock.expectOne(
        'http://localhost:5150/api/pokemon?page=1&pageSize=12&search=char'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ count: 0, page: 1, pageSize: 12, totalPages: 0, results: [] });
      expect(completed).toBeTrue();
    });

    it('getPokemonByName returns null without HTTP when name is empty', () => {
      let result: Pokemon | null | undefined;
      service.getPokemonByName('  ').subscribe(value => (result = value));

      httpMock.expectNone('http://localhost:5150/api/pokemon/search?search=');
      expect(result).toBeNull();
    });

    it('searchPartialPokemon maps API shape to PokemonListItem', () => {
      service.searchPartialPokemon('bulba', 10).subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('bulbasaur');
        expect(results[0].types[0].name).toBe('grass');
      });

      const req = httpMock.expectOne(
        'http://localhost:5150/api/pokemon/search?search=bulba'
      );
      req.flush([
        {
          id: 1,
          name: 'bulbasaur',
          imageUrl: 'http://img.test/1.png',
          types: [{ id: 5, name: 'grass', color: '#78C850' }]
        }
      ]);
    });

    it('searchPartialPokemon returns empty array on HTTP error', () => {
      service.searchPartialPokemon('fail').subscribe(results => {
        expect(results).toEqual([]);
      });

      const req = httpMock.expectOne(
        'http://localhost:5150/api/pokemon/search?search=fail'
      );
      req.error(new ProgressEvent('error'));
    });

    it('createPokemon posts to collection endpoint', () => {
      const payload: CreatePokemonRequest = {
        name: 'mewtwo',
        height: 20,
        weight: 1220,
        baseExperience: 306,
        types: [],
        stats: [],
        abilities: []
      };
      const created = { id: 152, name: 'mewtwo' } as Pokemon;

      service.createPokemon(payload).subscribe(pokemon => {
        expect(pokemon.id).toBe(152);
      });

      const req = httpMock.expectOne('http://localhost:5150/api/pokemon');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(created);
    });

    it('deletePokemon sends DELETE request', () => {
      service.deletePokemon(7).subscribe();

      const req = httpMock.expectOne('http://localhost:5150/api/pokemon/7');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
