import { Component, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, InputComponent, SelectComponent, SelectOption } from '@fish-ui/components';
import { errorOf, TypeGroup, typeGroup } from '../../forms/pokemon-form';
import { pokemonLimits } from '../../forms/pokemon-form.validators';
import { POKEMON_TYPE_COLORS } from '../../models/pokemon.model';

const typeOptions: SelectOption[] = Object.keys(POKEMON_TYPE_COLORS).map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1)
}));

@Component({
  selector: 'app-pokemon-type-fields',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent],
  templateUrl: './pokemon-type-fields.component.html',
  styleUrl: './pokemon-type-fields.component.scss'
})
export class PokemonTypeFieldsComponent {
  readonly types = input.required<FormArray<TypeGroup>>();

  protected readonly typeOptions = typeOptions;
  protected readonly maxTypes = pokemonLimits.maxTypes;
  protected readonly errorOf = errorOf;

  protected add(): void {
    this.types().push(typeGroup());
  }

  protected remove(index: number): void {
    this.types().removeAt(index);
  }

  protected onTypeSelect(type: TypeGroup, typeName: string | number): void {
    type.controls.color.setValue(POKEMON_TYPE_COLORS[typeName] ?? '');
  }
}
