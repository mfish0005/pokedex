import { Component, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, InputComponent } from '@fish-ui/components';
import { AbilityGroup, abilityGroup, errorOf } from '../../forms/pokemon-form';

@Component({
  selector: 'app-pokemon-ability-fields',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './pokemon-ability-fields.component.html',
  styleUrl: './pokemon-ability-fields.component.scss'
})
export class PokemonAbilityFieldsComponent {
  readonly abilities = input.required<FormArray<AbilityGroup>>();

  protected readonly errorOf = errorOf;

  protected add(): void {
    this.abilities().push(abilityGroup());
  }

  protected remove(index: number): void {
    this.abilities().removeAt(index);
  }
}
