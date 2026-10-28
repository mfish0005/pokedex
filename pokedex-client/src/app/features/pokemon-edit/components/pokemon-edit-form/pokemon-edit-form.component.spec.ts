import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEditFormComponent } from './pokemon-edit-form.component';
import { Pokemon, PokemonInput } from '../../../../core/models/pokemon.model';

const charizard = {
  id: 6,
  name: 'charizard',
  height: 17,
  weight: 905,
  baseExperience: 240,
  imageUrl: 'https://img.test/6.png',
  types: [
    { slot: 1, type: { id: 2, name: 'fire', color: '#F08030' } },
    { slot: 2, type: { id: 10, name: 'flying', color: '#A890F0' } }
  ],
  stats: [{ baseStat: 78, effort: 0, stat: { id: 1, name: 'hp', displayName: 'HP' } }],
  abilities: [{ isHidden: false, slot: 1, ability: { id: 1, name: 'blaze', description: null } }]
} as Pokemon;

describe('PokemonEditFormComponent', () => {
  let fixture: ComponentFixture<PokemonEditFormComponent>;
  let component: PokemonEditFormComponent;
  let saved: PokemonInput[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PokemonEditFormComponent] }).compileComponents();

    fixture = TestBed.createComponent(PokemonEditFormComponent);
    component = fixture.componentInstance;
    saved = [];
    component.save.subscribe(input => saved.push(input));
    fixture.componentRef.setInput('pokemon', charizard);
    fixture.detectChanges();
  });

  function form() {
    return component['form'];
  }

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  function submit(): void {
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('fills the form from the Pokemon', () => {
    expect(form().controls.name.value).toBe('Charizard');
    expect(form().controls.height.value).toBe('17');
    expect(form().controls.types.getRawValue()).toEqual([
      { name: 'fire', color: '#F08030' },
      { name: 'flying', color: '#A890F0' }
    ]);
  });

  it('saves the edited values', () => {
    form().controls.weight.setValue('1000');

    submit();

    expect(saved.length).toBe(1);
    expect(saved[0].name).toBe('Charizard');
    expect(saved[0].weight).toBe(1000);
  });

  it('rejects the same type twice', () => {
    form().controls.types.at(1).setValue({ name: 'fire', color: '#F08030' });

    submit();

    expect(saved).toEqual([]);
    expect(text()).toContain('Each type can only be added once.');
  });

  it('shows server errors under the matching fields, including nested ones', () => {
    fixture.componentRef.setInput('serverErrors', {
      name: ['A Pokemon named Charizard already exists.'],
      'types[1].color': ['Color must be a hex code such as #A8A878.']
    });
    fixture.detectChanges();

    expect(form().controls.name.errors).toEqual({ server: 'A Pokemon named Charizard already exists.' });
    expect(form().controls.types.at(1).controls.color.errors).toEqual({ server: 'Color must be a hex code such as #A8A878.' });
    expect(text()).toContain('A Pokemon named Charizard already exists.');
  });

  it('clears a server error once the field is edited', () => {
    fixture.componentRef.setInput('serverErrors', { name: ['A Pokemon named Charizard already exists.'] });
    fixture.detectChanges();

    form().controls.name.setValue('Charizard X');

    expect(form().controls.name.errors).toBeNull();
  });

  it('asks to delete the Pokemon', () => {
    let deleteRequests = 0;
    component.delete.subscribe(() => deleteRequests++);

    (fixture.nativeElement.querySelector('.delete-button button') as HTMLButtonElement).click();

    expect(deleteRequests).toBe(1);
  });

  it('disables every action while deleting', () => {
    fixture.componentRef.setInput('deleting', true);
    fixture.detectChanges();

    const buttons = Array.from(fixture.nativeElement.querySelectorAll('.form-actions button')) as HTMLButtonElement[];
    expect(buttons.every(button => button.disabled)).toBeTrue();
    expect(text()).toContain('Deleting...');
  });
});
