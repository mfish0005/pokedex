import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FieldErrors, PokemonFormValues } from './pokemon-form.model';
import {
  abilityFieldRules,
  pokemonFieldRules,
  Rule,
  statFieldRules,
  typeFieldRules,
  uniqueNames,
  validate
} from './pokemon-form.validators';

export type TypeGroup = ReturnType<typeof typeGroup>;
export type StatGroup = ReturnType<typeof statGroup>;
export type AbilityGroup = ReturnType<typeof abilityGroup>;
export type PokemonForm = ReturnType<typeof createPokemonForm>;

export function createPokemonForm(values: PokemonFormValues) {
  const form = new FormGroup({
    name: field(pokemonFieldRules.name),
    imageUrl: field(pokemonFieldRules.imageUrl),
    height: field(pokemonFieldRules.height),
    weight: field(pokemonFieldRules.weight),
    baseExperience: field(pokemonFieldRules.baseExperience),
    types: new FormArray(values.types.map(() => typeGroup()), uniqueNames('type')),
    stats: new FormArray(values.stats.map(() => statGroup()), uniqueNames('stat')),
    abilities: new FormArray(values.abilities.map(() => abilityGroup()), uniqueNames('ability'))
  });

  form.setValue(values);

  return form;
}

export function typeGroup() {
  return new FormGroup({
    name: field(typeFieldRules.name),
    color: field(typeFieldRules.color)
  });
}

export function statGroup() {
  return new FormGroup({
    name: field(statFieldRules.name),
    displayName: field(statFieldRules.displayName),
    baseStat: field(statFieldRules.baseStat)
  });
}

export function abilityGroup() {
  return new FormGroup({
    name: field(abilityFieldRules.name),
    isHidden: new FormControl(false, { nonNullable: true })
  });
}

export function errorOf(control: AbstractControl): string | null {
  if (!control.touched) {
    return null;
  }

  return (control.errors?.['invalid'] ?? control.errors?.['server'] ?? null) as string | null;
}

export function applyServerErrors(form: PokemonForm, errors: FieldErrors): void {
  for (const [field, messages] of Object.entries(errors)) {
    const control = form.get(field.replace(/\[(\d+)\]/g, '.$1'));

    if (control) {
      control.setErrors({ server: messages.join(' ') });
      control.markAsTouched();
    }
  }
}

function field(rules: readonly Rule[]): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: [validate(...rules)] });
}
