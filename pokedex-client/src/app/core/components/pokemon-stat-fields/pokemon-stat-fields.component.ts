import { Component, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, InputComponent, SelectComponent, SelectOption } from '@fish-ui/components';
import { errorOf, StatGroup, statGroup } from '../../forms/pokemon-form';

const statOptions: SelectOption[] = [
  { value: 'hp', label: 'HP' },
  { value: 'attack', label: 'Attack' },
  { value: 'defense', label: 'Defense' },
  { value: 'special-attack', label: 'Special Attack' },
  { value: 'special-defense', label: 'Special Defense' },
  { value: 'speed', label: 'Speed' }
];

@Component({
  selector: 'app-pokemon-stat-fields',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, SelectComponent],
  templateUrl: './pokemon-stat-fields.component.html',
  styleUrl: './pokemon-stat-fields.component.scss'
})
export class PokemonStatFieldsComponent {
  readonly stats = input.required<FormArray<StatGroup>>();

  protected readonly statOptions = statOptions;
  protected readonly errorOf = errorOf;

  protected add(): void {
    this.stats().push(statGroup());
  }

  protected remove(index: number): void {
    this.stats().removeAt(index);
  }

  protected onStatSelect(stat: StatGroup, statName: string | number): void {
    const label = statOptions.find(option => option.value === statName)?.label ?? String(statName);
    stat.controls.displayName.setValue(label);
  }
}
