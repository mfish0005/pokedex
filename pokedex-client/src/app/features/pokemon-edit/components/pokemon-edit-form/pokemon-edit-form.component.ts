import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@fish-ui/components';
import { PokemonAbilityFieldsComponent } from '../../../../core/components/pokemon-ability-fields/pokemon-ability-fields.component';
import { PokemonBasicFieldsComponent } from '../../../../core/components/pokemon-basic-fields/pokemon-basic-fields.component';
import { PokemonStatFieldsComponent } from '../../../../core/components/pokemon-stat-fields/pokemon-stat-fields.component';
import { PokemonTypeFieldsComponent } from '../../../../core/components/pokemon-type-fields/pokemon-type-fields.component';
import { applyServerErrors, createPokemonForm, PokemonForm } from '../../../../core/forms/pokemon-form';
import { FieldErrors, toFormValues, toPokemonInput } from '../../../../core/forms/pokemon-form.model';
import { Pokemon, PokemonInput } from '../../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-edit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    PokemonBasicFieldsComponent,
    PokemonTypeFieldsComponent,
    PokemonStatFieldsComponent,
    PokemonAbilityFieldsComponent
  ],
  templateUrl: './pokemon-edit-form.component.html',
  styleUrl: './pokemon-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonEditFormComponent implements OnInit {
  readonly pokemon = input.required<Pokemon>();
  readonly saving = input(false);
  readonly deleting = input(false);
  readonly serverErrors = input<FieldErrors>({});

  readonly save = output<PokemonInput>();
  readonly delete = output<void>();
  readonly cancel = output<void>();

  protected form!: PokemonForm;
  protected readonly busy = computed(() => this.saving() || this.deleting());
  protected readonly showSummary = signal(false);

  constructor() {
    effect(() => applyServerErrors(this.form, this.serverErrors()));
  }

  ngOnInit(): void {
    this.form = createPokemonForm(toFormValues(this.pokemon()));
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummary.set(true);
      return;
    }

    this.showSummary.set(false);
    this.save.emit(toPokemonInput(this.form.getRawValue()));
  }
}
