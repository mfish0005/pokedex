import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PokemonCreateComponent } from './pokemon-create.component';
import { PokemonCreateFormComponent } from '../components/pokemon-create-form/pokemon-create-form.component';
import { Pokemon, PokemonInput } from '../../../core/models/pokemon.model';
import { PokemonService } from '../../../core/services/pokemon.service';

const input: PokemonInput = {
  name: 'Mewtwo',
  height: 20,
  weight: 1220,
  baseExperience: 306,
  imageUrl: null,
  types: [{ name: 'psychic', color: '#F85888' }],
  stats: [{ name: 'hp', displayName: 'HP', baseStat: 106 }],
  abilities: [{ name: 'pressure', isHidden: false }]
};

describe('PokemonCreateComponent', () => {
  let fixture: ComponentFixture<PokemonCreateComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let router: Router;

  beforeEach(async () => {
    pokemonService = jasmine.createSpyObj('PokemonService', ['createPokemon']);

    await TestBed.configureTestingModule({
      imports: [PokemonCreateComponent],
      providers: [provideRouter([]), { provide: PokemonService, useValue: pokemonService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCreateComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  function form(): PokemonCreateFormComponent {
    return fixture.debugElement.query(By.directive(PokemonCreateFormComponent)).componentInstance;
  }

  it('renders the create form', () => {
    expect(form()).toBeTruthy();
  });

  it('creates the Pokemon and opens it', () => {
    pokemonService.createPokemon.and.returnValue(of({ id: 152, name: 'mewtwo' } as Pokemon));

    form().create.emit(input);

    expect(pokemonService.createPokemon).toHaveBeenCalledWith(input);
    expect(router.navigate).toHaveBeenCalledWith(['/pokemon', 152], { replaceUrl: true });
  });

  it('shows the server message and passes field errors to the form', () => {
    const conflict = new HttpErrorResponse({
      status: 409,
      error: { title: 'Pokemon already exists', detail: 'A Pokemon named Mewtwo already exists.', errors: { name: ['A Pokemon named Mewtwo already exists.'] } }
    });
    pokemonService.createPokemon.and.returnValue(throwError(() => conflict));

    form().create.emit(input);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(alert.textContent).toContain('A Pokemon named Mewtwo already exists.');
    expect(form().serverErrors()).toEqual({ name: ['A Pokemon named Mewtwo already exists.'] });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('returns to the Pokedex on cancel', () => {
    form().cancel.emit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
