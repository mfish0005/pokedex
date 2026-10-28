import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type Rule = (value: string) => string | null;

export const pokemonLimits = {
  nameMaxLength: 100,
  imageUrlMaxLength: 500,
  maxHeight: 1000,
  maxWeight: 10000,
  maxBaseExperience: 1000,
  maxTypes: 2,
  statDisplayNameMaxLength: 50,
  maxBaseStat: 255,
  abilityNameMaxLength: 100
} as const;

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;
const httpUrlPattern = /^https?:\/\/\S+$/i;

export function validate(...rules: readonly Rule[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    for (const rule of rules) {
      const message = rule(value);

      if (message !== null) {
        return { invalid: message };
      }
    }

    return null;
  };
}

export function uniqueNames(noun: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const names = (control.value as { name: string }[])
      .map(item => item.name.trim().toLowerCase())
      .filter(name => name !== '');

    return new Set(names).size === names.length ? null : { invalid: `Each ${noun} can only be added once.` };
  };
}

const required = (label: string): Rule => value =>
  value.trim() === '' ? `${label} is required.` : null;

const maxLength = (label: string, max: number): Rule => value =>
  value.trim().length > max ? `${label} must be ${max} characters or fewer.` : null;

const isWholeNumber = (label: string): Rule => value =>
  Number.isInteger(Number(value)) ? null : `${label} must be a whole number.`;

const between = (label: string, min: number, max: number): Rule => value => {
  const number = Number(value);

  return number >= min && number <= max ? null : `${label} must be between ${min} and ${max}.`;
};

const optionalHttpUrl = (label: string): Rule => value =>
  value.trim() === '' || httpUrlPattern.test(value.trim()) ? null : `${label} must start with http:// or https://.`;

const hexColor: Rule = value =>
  hexColorPattern.test(value.trim()) ? null : 'Color must be a hex code such as #A8A878.';

const wholeNumberBetween = (label: string, min: number, max: number): Rule[] => [
  required(label),
  isWholeNumber(label),
  between(label, min, max)
];

export const pokemonFieldRules = {
  name: [required('Name'), maxLength('Name', pokemonLimits.nameMaxLength)],
  imageUrl: [maxLength('Image URL', pokemonLimits.imageUrlMaxLength), optionalHttpUrl('Image URL')],
  height: wholeNumberBetween('Height', 1, pokemonLimits.maxHeight),
  weight: wholeNumberBetween('Weight', 1, pokemonLimits.maxWeight),
  baseExperience: wholeNumberBetween('Base experience', 1, pokemonLimits.maxBaseExperience)
} as const satisfies Record<string, readonly Rule[]>;

export const typeFieldRules = {
  name: [required('Type')],
  color: [required('Color'), hexColor]
} as const satisfies Record<string, readonly Rule[]>;

export const statFieldRules = {
  name: [required('Stat')],
  displayName: [required('Display name'), maxLength('Display name', pokemonLimits.statDisplayNameMaxLength)],
  baseStat: wholeNumberBetween('Base value', 0, pokemonLimits.maxBaseStat)
} as const satisfies Record<string, readonly Rule[]>;

export const abilityFieldRules = {
  name: [required('Ability name'), maxLength('Ability name', pokemonLimits.abilityNameMaxLength)]
} as const satisfies Record<string, readonly Rule[]>;
