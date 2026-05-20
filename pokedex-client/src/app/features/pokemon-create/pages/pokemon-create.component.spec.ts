import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { PokemonCreateComponent } from './pokemon-create.component';
import { PokemonService } from '../../../core/services/pokemon.service';

describe('PokemonCreateComponent', () => {
  let component: PokemonCreateComponent;
  let fixture: ComponentFixture<PokemonCreateComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let router: Router;

  beforeEach(async () => {
    pokemonService = jasmine.createSpyObj('PokemonService', ['createPokemon']);
    pokemonService.createPokemon.and.returnValue(of({ id: 152, name: 'mewtwo' } as any));

    await TestBed.configureTestingModule({
      imports: [PokemonCreateComponent],
      providers: [
        provideRouter([]),
        { provide: PokemonService, useValue: pokemonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCreateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create with a valid form structure', () => {
    expect(component).toBeTruthy();
    expect(component.pokemonForm).toBeTruthy();
    expect(component.types.length).toBe(1);
    expect(component.stats.length).toBe(1);
    expect(component.abilities.length).toBe(1);
  });

  it('should mark form invalid when name is empty', () => {
    component.pokemonForm.patchValue({ name: '' });
    expect(component.pokemonForm.valid).toBeFalse();
  });

  it('should add and remove type rows', () => {
    component.addType();
    expect(component.types.length).toBe(2);

    component.removeType(1);
    expect(component.types.length).toBe(1);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(pokemonService.createPokemon).not.toHaveBeenCalled();
  });

  it('should submit and navigate on valid form', () => {
    component.pokemonForm.patchValue({
      name: 'Mewtwo',
      height: 20,
      weight: 1220,
      baseExperience: 306,
      imageUrl: ''
    });
    component.types.at(0).patchValue({ name: 'psychic', color: '#F85888' });
    component.stats.at(0).patchValue({
      name: 'hp',
      displayName: 'HP',
      baseStat: 106
    });
    component.abilities.at(0).patchValue({ name: 'pressure', isHidden: false });

    component.onSubmit();

    expect(pokemonService.createPokemon).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/pokemon', 152]);
    expect(component.isLoading()).toBeFalse();
  });
});
