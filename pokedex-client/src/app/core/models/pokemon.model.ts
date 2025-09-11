export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  order: number;
  imageUrl: string;
  shinyImageUrl: string;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonType {
  slot: number;
  type: {
    id: number;
    name: string;
    color: string;
  };
}

export interface PokemonStat {
  baseStat: number;
  effort: number;
  stat: {
    id: number;
    name: string;
    displayName: string;
  };
}

export interface PokemonAbility {
  isHidden: boolean;
  slot: number;
  ability: {
    id: number;
    name: string;
    description: string | null;
  };
}

export interface PokemonListResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string;
  types: {
    id: number;
    name: string;
    color: string;
  }[];
}

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export interface CreatePokemonRequest {
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  imageUrl?: string;
  types: CreatePokemonTypeRequest[];
  stats: CreatePokemonStatRequest[];
  abilities: CreatePokemonAbilityRequest[];
}

export interface CreatePokemonTypeRequest {
  name: string;
  color: string;
}

export interface CreatePokemonStatRequest {
  name: string;
  displayName: string;
  baseStat: number;
}

export interface CreatePokemonAbilityRequest {
  name: string;
  isHidden: boolean;
}

export interface UpdatePokemonRequest {
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  imageUrl?: string;
  types: UpdatePokemonTypeRequest[];
  stats: UpdatePokemonStatRequest[];
  abilities: UpdatePokemonAbilityRequest[];
}

export interface UpdatePokemonTypeRequest {
  name: string;
  color: string;
}

export interface UpdatePokemonStatRequest {
  name: string;
  displayName: string;
  baseStat: number;
}

export interface UpdatePokemonAbilityRequest {
  name: string;
  isHidden: boolean;
}
