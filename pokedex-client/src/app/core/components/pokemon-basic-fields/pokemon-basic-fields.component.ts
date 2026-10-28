import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@fish-ui/components';
import { errorOf, PokemonForm } from '../../forms/pokemon-form';

@Component({
  selector: 'app-pokemon-basic-fields',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './pokemon-basic-fields.component.html',
  styleUrl: './pokemon-basic-fields.component.scss'
})
export class PokemonBasicFieldsComponent {
  readonly form = input.required<PokemonForm>();

  protected readonly errorOf = errorOf;
}
