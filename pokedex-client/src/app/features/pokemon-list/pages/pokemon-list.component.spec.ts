import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../../../core/services/pokemon.service';
import { PokemonListItem, PokemonListResponse } from '../../../core/models/pokemon.model';

@Component({ selector: 'fish-search', template: '', standalone: true })
class FishSearchStub {}

@Component({ selector: 'app-loading-state', template: '', standalone: true })
class LoadingStateStub {}

@Component({ selector: 'app-pokemon-grid', template: '', standalone: true })
class PokemonGridStub {
  pokemon = input<PokemonListItem[]>([]);
}

@Component({ selector: 'fish-button', template: '', standalone: true })
class FishButtonStub {
  variant = input('');
  onClick = output<void>();
}

@Component({ selector: 'app-status-message', template: '', standalone: true })
class StatusMessageStub {
  title = input('');
  message = input('');
  tone = input('info');
}

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let router: Router;

  const mockListResponse: PokemonListResponse = {
    count: 2,
    page: 1,
    pageSize: 12,
    totalPages: 2,
    results: [
      { id: 1, name: 'bulbasaur', imageUrl: '', types: [] },
      { id: 2, name: 'ivysaur', imageUrl: '', types: [] }
    ]
  };

  beforeEach(async () => {
    pokemonService = jasmine.createSpyObj('PokemonService', [
      'getPokemonList',
      'searchPartialPokemon'
    ]);
    pokemonService.getPokemonList.and.returnValue(of(mockListResponse));
    pokemonService.searchPartialPokemon.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [provideRouter([])]
    })
      .overrideComponent(PokemonListComponent, {
        set: {
          imports: [FishSearchStub, FishButtonStub, LoadingStateStub, PokemonGridStub, StatusMessageStub],
          providers: [{ provide: PokemonService, useValue: pokemonService }]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial pokemon on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(pokemonService.getPokemonList).toHaveBeenCalledWith(12, 1);
    expect(component['pokemon']().length).toBe(2);
    expect(component['loading']()).toBeFalse();
    expect(component['currentPage']()).toBe(2);
  });

  it('should set error when initial load fails', async () => {
    pokemonService.getPokemonList.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['error']()).toBe('Something went wrong while loading the Pokedex. Please try again.');
    expect(component['loading']()).toBeFalse();
  });

  it('should navigate when a pokemon is selected', () => {
    const selected: PokemonListItem = { id: 1, name: 'bulbasaur', imageUrl: '', types: [] };

    component.onPokemonSelect(selected);

    expect(router.navigate).toHaveBeenCalledWith(['/pokemon', 1]);
  });

  it('should search and update results', async () => {
    const searchResults: PokemonListItem[] = [
      { id: 25, name: 'pikachu', imageUrl: '', types: [] }
    ];
    pokemonService.searchPartialPokemon.and.returnValue(of(searchResults));

    fixture.detectChanges();
    await fixture.whenStable();

    component.onSearch('pika');
    await fixture.whenStable();

    expect(pokemonService.searchPartialPokemon).toHaveBeenCalledWith('pika', 20);
    expect(component['isInSearchMode']()).toBeTrue();
    expect(component['pokemon']()).toEqual(searchResults);
    expect(component['isSearching']()).toBeFalse();
  });

  it('should reload list when search is cleared', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    pokemonService.getPokemonList.calls.reset();

    component.onSearchClear();
    await fixture.whenStable();

    expect(component['searchQuery']()).toBe('');
    expect(component['isInSearchMode']()).toBeFalse();
    expect(pokemonService.getPokemonList).toHaveBeenCalled();
  });

  it('should not load more when already loading more', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    pokemonService.getPokemonList.calls.reset();
    component['loadingMore'].set(true);

    component.loadMorePokemon();

    expect(pokemonService.getPokemonList).not.toHaveBeenCalled();
  });
});
