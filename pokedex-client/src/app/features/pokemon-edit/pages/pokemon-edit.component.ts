import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@fish-ui/components';
import { catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { LoadingStateComponent } from '../../../core/components/loading-state/loading-state.component';
import { StatusMessageComponent } from '../../../core/components/status-message/status-message.component';
import { FieldErrors } from '../../../core/forms/pokemon-form.model';
import { ServerFailure, toServerFailure } from '../../../core/forms/server-failure';
import { isNotFound, toProblemMessage } from '../../../core/http/problem-message';
import { Pokemon, PokemonInput } from '../../../core/models/pokemon.model';
import { PokemonService } from '../../../core/services/pokemon.service';
import { PokemonEditFormComponent } from '../components/pokemon-edit-form/pokemon-edit-form.component';

type LoadState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; pokemon: Pokemon };

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'deleting' }
  | { status: 'gone' }
  | ({ status: 'failed' } & ServerFailure);

const loading: LoadState = { status: 'loading' };
const notFound: LoadState = { status: 'not-found' };
const idle: SaveState = { status: 'idle' };
const gone: SaveState = { status: 'gone' };

const unexpectedLoadMessage = 'Something went wrong while loading this Pokemon. Please try again.';
const unexpectedSaveMessage = 'Something went wrong while saving this Pokemon. Please try again.';
const unexpectedDeleteMessage = 'Something went wrong while deleting this Pokemon. Please try again.';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [ButtonComponent, LoadingStateComponent, PokemonEditFormComponent, StatusMessageComponent],
  templateUrl: './pokemon-edit.component.html',
  styleUrls: ['./pokemon-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh = new Subject<void>();

  private readonly id$ = this.route.paramMap.pipe(map(params => Number(params.get('id'))));

  protected readonly noFieldErrors: FieldErrors = {};
  protected readonly saveState = signal<SaveState>(idle);

  protected readonly state = toSignal(
    combineLatest([this.id$, this.refresh.pipe(startWith(undefined))]).pipe(
      switchMap(([id]) => this.load(id))
    ),
    { initialValue: loading }
  );

  protected retry(): void {
    this.refresh.next();
  }

  protected save(pokemon: Pokemon, input: PokemonInput): void {
    this.saveState.set({ status: 'saving' });

    this.pokemonService
      .updatePokemon(pokemon.id, input)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/pokemon', pokemon.id], { replaceUrl: true }),
        error: error =>
          this.saveState.set(isNotFound(error) ? gone : { status: 'failed', ...toServerFailure(error, unexpectedSaveMessage) })
      });
  }

  protected delete(pokemon: Pokemon): void {
    if (!confirm(`Delete ${this.capitalizeName(pokemon.name)}? This cannot be undone.`)) {
      return;
    }

    this.saveState.set({ status: 'deleting' });

    this.pokemonService
      .deletePokemon(pokemon.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.goHome(),
        error: error => {
          if (isNotFound(error)) {
            this.goHome();
            return;
          }

          this.saveState.set({
            status: 'failed',
            message: toProblemMessage(error, unexpectedDeleteMessage),
            fieldErrors: {}
          });
        }
      });
  }

  protected cancel(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  protected goHome(): void {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  protected capitalizeName(name: string): string {
    return this.pokemonService.capitalizeName(name);
  }

  private load(id: number): Observable<LoadState> {
    if (!Number.isInteger(id) || id <= 0) {
      return of(notFound);
    }

    return this.pokemonService.getPokemon(id).pipe(
      map((pokemon): LoadState => ({ status: 'ready', pokemon })),
      catchError(error =>
        of<LoadState>(isNotFound(error) ? notFound : { status: 'error', message: toProblemMessage(error, unexpectedLoadMessage) })
      ),
      startWith(loading)
    );
  }
}
