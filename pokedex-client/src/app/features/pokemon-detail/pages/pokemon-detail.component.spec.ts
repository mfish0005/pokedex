import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PokemonDetailComponent } from './pokemon-detail.component';
import { Pokemon } from '../../../core/models/pokemon.model';
import { PokemonService } from '../../../core/services/pokemon.service';

const pikachu = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  baseExperience: 112,
  order: 35,
  imageUrl: 'https://img.test/25.png',
  shinyImageUrl: '',
  types: [{ slot: 1, type: { id: 4, name: 'electric', color: '#F8D030' } }],
  stats: [{ baseStat: 35, effort: 0, stat: { id: 1, name: 'hp', displayName: 'HP' } }],
  abilities: [{ isHidden: false, slot: 1, ability: { id: 1, name: 'static', description: null } }]
} as Pokemon;

describe('PokemonDetailComponent', () => {
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    pokemonService = jasmine.createSpyObj('PokemonService', [
      'getPokemon',
      'capitalizeName',
      'formatPokemonNumber',
      'getTypeColor'
    ]);
    pokemonService.capitalizeName.and.callFake(name => name);
    pokemonService.formatPokemonNumber.and.callFake(id => `#${id}`);

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent],
      providers: [
        provideRouter([]),
        { provide: PokemonService, useValue: pokemonService },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '25' })) } }
      ]
    }).compileComponents();
  });

  function render(): HTMLElement {
    fixture = TestBed.createComponent(PokemonDetailComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the Pokemon when it loads', () => {
    pokemonService.getPokemon.and.returnValue(of(pikachu));

    const element = render();

    expect(element.textContent).toContain('Battle Stats');
    expect(element.textContent).toContain('Edit Pokemon');
    expect(element.querySelector('.prev-button')?.textContent).toContain('#24');
    expect(element.querySelector('.next-button')?.textContent).toContain('#26');
  });

  it('says the Pokemon was not found on a 404', () => {
    pokemonService.getPokemon.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    const element = render();

    expect(element.textContent).toContain("We couldn't find that Pokemon");
    expect(element.textContent).not.toContain('Edit Pokemon');
  });

  it('shows the error and loads again when retried', () => {
    pokemonService.getPokemon.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 500, error: { title: 'Something went wrong' } })),
      of(pikachu)
    );

    const element = render();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Something went wrong');

    (element.querySelector('app-status-message fish-button button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(pokemonService.getPokemon).toHaveBeenCalledTimes(2);
    expect(element.textContent).toContain('Battle Stats');
  });
});
