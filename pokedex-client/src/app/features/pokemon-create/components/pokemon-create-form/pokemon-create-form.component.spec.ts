import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCreateFormComponent } from './pokemon-create-form.component';
import { PokemonInput } from '../../../../core/models/pokemon.model';

describe('PokemonCreateFormComponent', () => {
  let fixture: ComponentFixture<PokemonCreateFormComponent>;
  let component: PokemonCreateFormComponent;
  let created: PokemonInput[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PokemonCreateFormComponent] }).compileComponents();

    fixture = TestBed.createComponent(PokemonCreateFormComponent);
    component = fixture.componentInstance;
    created = [];
    component.create.subscribe(input => created.push(input));
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

  it('starts empty with one row for types, stats and abilities', () => {
    expect(form().controls.name.value).toBe('');
    expect(form().controls.types.length).toBe(1);
    expect(form().controls.stats.length).toBe(1);
    expect(form().controls.abilities.length).toBe(1);
  });

  it('shows every problem instead of creating from an invalid form', () => {
    submit();

    expect(created).toEqual([]);
    expect(text()).toContain('Name is required.');
    expect(text()).toContain('Height is required.');
    expect(text()).toContain('Type is required.');
    expect(text()).toContain('Fix the highlighted fields and try again.');
  });

  it('emits a trimmed, numeric input when the form is valid', () => {
    form().setValue({
      name: '  Mewtwo ',
      imageUrl: ' ',
      height: '20',
      weight: '1220',
      baseExperience: '306',
      types: [{ name: 'psychic', color: '#F85888' }],
      stats: [{ name: 'hp', displayName: 'HP', baseStat: '106' }],
      abilities: [{ name: ' pressure ', isHidden: false }]
    });

    submit();

    expect(created).toEqual([
      {
        name: 'Mewtwo',
        imageUrl: null,
        height: 20,
        weight: 1220,
        baseExperience: 306,
        types: [{ name: 'psychic', color: '#F85888' }],
        stats: [{ name: 'hp', displayName: 'HP', baseStat: 106 }],
        abilities: [{ name: 'pressure', isHidden: false }]
      }
    ]);
  });

  it('shows a server error under the matching field', () => {
    fixture.componentRef.setInput('serverErrors', { name: ['A Pokemon named Mewtwo already exists.'] });
    fixture.detectChanges();

    expect(form().controls.name.errors).toEqual({ server: 'A Pokemon named Mewtwo already exists.' });
    expect(text()).toContain('A Pokemon named Mewtwo already exists.');
  });

  it('disables the actions while creating', () => {
    fixture.componentRef.setInput('creating', true);
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBeTrue();
    expect(submitButton.textContent).toContain('Creating...');
  });
});
