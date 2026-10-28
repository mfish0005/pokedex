import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FieldErrors } from '../../../core/forms/pokemon-form.model';
import { ServerFailure, toServerFailure } from '../../../core/forms/server-failure';
import { PokemonInput } from '../../../core/models/pokemon.model';
import { PokemonService } from '../../../core/services/pokemon.service';
import { PokemonCreateFormComponent } from '../components/pokemon-create-form/pokemon-create-form.component';

type CreateState = { status: 'idle' } | { status: 'saving' } | ({ status: 'failed' } & ServerFailure);

const idle: CreateState = { status: 'idle' };

const unexpectedMessage = 'Something went wrong while creating this Pokemon. Please try again.';

@Component({
  selector: 'app-pokemon-create',
  standalone: true,
  imports: [PokemonCreateFormComponent],
  templateUrl: './pokemon-create.component.html',
  styleUrls: ['./pokemon-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonCreateComponent {
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly noFieldErrors: FieldErrors = {};
  protected readonly state = signal<CreateState>(idle);

  protected create(input: PokemonInput): void {
    this.state.set({ status: 'saving' });

    this.pokemonService
      .createPokemon(input)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: created => this.router.navigate(['/pokemon', created.id], { replaceUrl: true }),
        error: error => this.state.set({ status: 'failed', ...toServerFailure(error, unexpectedMessage) })
      });
  }

  protected cancel(): void {
    this.router.navigate(['/']);
  }
}
