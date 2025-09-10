import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputComponent, TextareaComponent, SelectComponent, SelectOption } from 'fish-ui';
import { PokemonService } from '../../../core/pokemon/services/pokemon.service';
import { UpdatePokemonRequest, POKEMON_TYPE_COLORS, Pokemon } from '../../../core/pokemon/models/pokemon.model';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, TextareaComponent, SelectComponent],
  templateUrl: './pokemon-edit.component.html',
  styleUrls: ['./pokemon-edit.component.scss']
})
export class PokemonEditComponent implements OnInit {
  pokemonForm: FormGroup;
  isLoading = signal(false);
  isLoadingData = signal(true);
  error = signal<string | null>(null);
  pokemonId = signal<number | null>(null);
  pokemon = signal<Pokemon | null>(null);

  typeOptions: SelectOption[] = Object.keys(POKEMON_TYPE_COLORS).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

  statOptions: SelectOption[] = [
    { value: 'hp', label: 'HP' },
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'special-attack', label: 'Special Attack' },
    { value: 'special-defense', label: 'Special Defense' },
    { value: 'speed', label: 'Speed' }
  ];

  constructor(
    private fb: FormBuilder,
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pokemonForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonId.set(Number(id));
      this.loadPokemon(Number(id));
    } else {
      this.router.navigate(['/pokemon']);
    }
  }

  private loadPokemon(id: number): void {
    this.isLoadingData.set(true);
    this.error.set(null);

    this.pokemonService.getPokemon(id).subscribe({
      next: (pokemon) => {
        this.pokemon.set(pokemon);
        this.populateForm(pokemon);
        this.isLoadingData.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load Pokemon data. Please try again.');
        this.isLoadingData.set(false);
        console.error('Error loading Pokemon:', error);
      }
    });
  }

  private populateForm(pokemon: Pokemon): void {    
    while (this.types.length !== 0) {
      this.types.removeAt(0);
    }
    while (this.stats.length !== 0) {
      this.stats.removeAt(0);
    }
    while (this.abilities.length !== 0) {
      this.abilities.removeAt(0);
    }
            
    this.pokemonForm.patchValue({
      name: this.pokemonService.capitalizeName(pokemon.name),
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.baseExperience,
      imageUrl: pokemon.imageUrl || ''
    });
    
    pokemon.types.forEach(type => {
      this.types.push(this.fb.group({
        name: [type.type.name, [Validators.required]],
        color: [type.type.color, [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
      }));
    });

    pokemon.stats.forEach(stat => {
      this.stats.push(this.fb.group({
        name: [stat.stat.name, [Validators.required]],
        displayName: [stat.stat.displayName, [Validators.required]],
        baseStat: [stat.baseStat, [Validators.required, Validators.min(0), Validators.max(255)]]
      }));
    });

    pokemon.abilities.forEach(ability => {
      this.abilities.push(this.fb.group({
        name: [ability.ability.name, [Validators.required, Validators.maxLength(100)]],
        isHidden: [ability.isHidden]
      }));
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      height: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      weight: [1, [Validators.required, Validators.min(1), Validators.max(10000)]],
      baseExperience: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      types: this.fb.array([]),
      stats: this.fb.array([]),
      abilities: this.fb.array([])
    });
  }

  private createTypeGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });
  }

  private createStatGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      baseStat: [1, [Validators.required, Validators.min(0), Validators.max(255)]]
    });
  }

  private createAbilityGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      isHidden: [false]
    });
  }

  get types(): FormArray {
    return this.pokemonForm.get('types') as FormArray;
  }

  get stats(): FormArray {
    return this.pokemonForm.get('stats') as FormArray;
  }

  get abilities(): FormArray {
    return this.pokemonForm.get('abilities') as FormArray;
  }

  addType(): void {
    this.types.push(this.createTypeGroup());
  }

  removeType(index: number): void {
    if (this.types.length > 1) {
      this.types.removeAt(index);
    }
  }

  addStat(): void {
    this.stats.push(this.createStatGroup());
  }

  removeStat(index: number): void {
    if (this.stats.length > 1) {
      this.stats.removeAt(index);
    }
  }

  addAbility(): void {
    this.abilities.push(this.createAbilityGroup());
  }

  removeAbility(index: number): void {
    if (this.abilities.length > 1) {
      this.abilities.removeAt(index);
    }
  }

  onTypeSelect(index: number, typeName: string): void {
    const typeGroup = this.types.at(index) as FormGroup;
    const color = POKEMON_TYPE_COLORS[typeName as keyof typeof POKEMON_TYPE_COLORS];
    typeGroup.patchValue({
      name: typeName,
      color: color
    });
  }

  onStatSelect(index: number, statName: string): void {
    const statGroup = this.stats.at(index) as FormGroup;
    const displayName = this.statOptions.find(opt => opt.value === statName)?.label || statName;
    statGroup.patchValue({
      name: statName,
      displayName: displayName
    });
  }

  onSubmit(): void {
    if (this.pokemonForm.valid && !this.isLoading() && this.pokemonId()) {
      this.isLoading.set(true);
      this.error.set(null);

      const formValue = this.pokemonForm.value;
      const updateRequest: UpdatePokemonRequest = {
        name: formValue.name,
        height: parseInt(formValue.height, 10),
        weight: parseInt(formValue.weight, 10),
        baseExperience: parseInt(formValue.baseExperience, 10),
        imageUrl: formValue.imageUrl || undefined,
        types: formValue.types,
        stats: formValue.stats.map((stat: any) => ({
          ...stat,
          baseStat: parseInt(stat.baseStat, 10)
        })),
        abilities: formValue.abilities
      };

      this.pokemonService.updatePokemon(this.pokemonId()!, updateRequest).subscribe({
        next: (updatedPokemon) => {
          this.isLoading.set(false);
          this.router.navigate(['/pokemon', updatedPokemon.id]);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set('Failed to update Pokemon. Please try again.');
          console.error('Error updating Pokemon:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.pokemonForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancel(): void {
    const id = this.pokemonId();
    if (id) {
      this.router.navigate(['/pokemon', id]);
    } else {
      this.router.navigate(['/pokemon']);
    }
  }

  onDelete(): void {
    if (this.pokemonId() && confirm('Are you sure you want to delete this Pokemon? This action cannot be undone.')) {
      this.isLoading.set(true);
      this.error.set(null);

      this.pokemonService.deletePokemon(this.pokemonId()!).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set('Failed to delete Pokemon. Please try again.');
          console.error('Error deleting Pokemon:', error);
        }
      });
    }
  }

  capitalizeName(name: string): string {
    return this.pokemonService.capitalizeName(name);
  }
}
