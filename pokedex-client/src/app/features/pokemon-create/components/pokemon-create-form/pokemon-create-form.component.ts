import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@fish-ui/components';
import { PokemonAbilityFieldsComponent } from '../../../../core/components/pokemon-ability-fields/pokemon-ability-fields.component';
import { PokemonBasicFieldsComponent } from '../../../../core/components/pokemon-basic-fields/pokemon-basic-fields.component';
import { PokemonStatFieldsComponent } from '../../../../core/components/pokemon-stat-fields/pokemon-stat-fields.component';
import { PokemonTypeFieldsComponent } from '../../../../core/components/pokemon-type-fields/pokemon-type-fields.component';
import { applyServerErrors, createPokemonForm } from '../../../../core/forms/pokemon-form';
import { emptyFormValues, FieldErrors, toPokemonInput } from '../../../../core/forms/pokemon-form.model';
import { PokemonInput } from '../../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    PokemonBasicFieldsComponent,
    PokemonTypeFieldsComponent,
    PokemonStatFieldsComponent,
    PokemonAbilityFieldsComponent
  ],
  templateUrl: './pokemon-create-form.component.html',
  styleUrl: './pokemon-create-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonCreateFormComponent {
  readonly creating = input(false);
  readonly serverErrors = input<FieldErrors>({});

  readonly create = output<PokemonInput>();
  readonly cancel = output<void>();

  protected readonly form = createPokemonForm(emptyFormValues);
  protected readonly showSummary = signal(false);

  constructor() {
    effect(() => applyServerErrors(this.form, this.serverErrors()));
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummary.set(true);
      return;
    }

    this.showSummary.set(false);
    this.create.emit(toPokemonInput(this.form.getRawValue()));
  }
}
