import { Pokemon, PokemonInput } from '../models/pokemon.model';

export type FieldErrors = Record<string, string[]>;

export interface TypeValues {
  name: string;
  color: string;
}

export interface StatValues {
  name: string;
  displayName: string;
  baseStat: string;
}

export interface AbilityValues {
  name: string;
  isHidden: boolean;
}

export interface PokemonFormValues {
  name: string;
  imageUrl: string;
  height: string;
  weight: string;
  baseExperience: string;
  types: TypeValues[];
  stats: StatValues[];
  abilities: AbilityValues[];
}

export const emptyFormValues: PokemonFormValues = {
  name: '',
  imageUrl: '',
  height: '',
  weight: '',
  baseExperience: '',
  types: [{ name: '', color: '' }],
  stats: [{ name: '', displayName: '', baseStat: '' }],
  abilities: [{ name: '', isHidden: false }]
};

export function toFormValues(pokemon: Pokemon): PokemonFormValues {
  return {
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    imageUrl: pokemon.imageUrl ?? '',
    height: String(pokemon.height),
    weight: String(pokemon.weight),
    baseExperience: String(pokemon.baseExperience),
    types: pokemon.types.map(({ type }) => ({ name: type.name, color: type.color })),
    stats: pokemon.stats.map(({ stat, baseStat }) => ({
      name: stat.name,
      displayName: stat.displayName,
      baseStat: String(baseStat)
    })),
    abilities: pokemon.abilities.map(({ ability, isHidden }) => ({ name: ability.name, isHidden }))
  };
}

export function toPokemonInput(values: PokemonFormValues): PokemonInput {
  return {
    name: values.name.trim(),
    imageUrl: values.imageUrl.trim() || null,
    height: Number(values.height),
    weight: Number(values.weight),
    baseExperience: Number(values.baseExperience),
    types: values.types.map(type => ({ name: type.name.trim(), color: type.color.trim() })),
    stats: values.stats.map(stat => ({
      name: stat.name.trim(),
      displayName: stat.displayName.trim(),
      baseStat: Number(stat.baseStat)
    })),
    abilities: values.abilities.map(ability => ({ name: ability.name.trim(), isHidden: ability.isHidden }))
  };
}
