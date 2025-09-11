import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent, TextareaComponent, SelectComponent, SelectOption } from 'fish-ui';
import { PokemonService } from '../../../core/services/pokemon.service';
import { CreatePokemonRequest, POKEMON_TYPE_COLORS } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, TextareaComponent, SelectComponent],
  templateUrl: './pokemon-create.component.html',
  styleUrls: ['./pokemon-create.component.scss']
})
export class PokemonCreateComponent {
  pokemonForm: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);

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
    private router: Router
  ) {
    this.pokemonForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      height: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      weight: [1, [Validators.required, Validators.min(1), Validators.max(10000)]],
      baseExperience: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      types: this.fb.array([this.createTypeGroup()]),
      stats: this.fb.array([this.createStatGroup()]),
      abilities: this.fb.array([this.createAbilityGroup()])
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
    if (this.pokemonForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.error.set(null);

      const formValue = this.pokemonForm.value;
      const createRequest: CreatePokemonRequest = {
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

      this.pokemonService.createPokemon(createRequest).subscribe({
        next: (createdPokemon) => {
          this.isLoading.set(false);
          this.router.navigate(['/pokemon', createdPokemon.id]);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set('Failed to create Pokemon. Please try again.');
          console.error('Error creating Pokemon:', error);
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
    this.router.navigate(['/pokemon']);
  }
}
