import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';

import { ButtonComponent, CardComponent, IconComponent } from '@fish-ui/components';
import { LoadingStateComponent } from '../../../core/components/loading-state/loading-state.component';
import { PokemonBasicInfoComponent } from '../../../core/components/pokemon-basic-info/pokemon-basic-info.component';
import { PokemonStatsComponent } from '../../../core/components/pokemon-stats/pokemon-stats.component';
import { PokemonInfoComponent } from '../../../core/components/pokemon-info/pokemon-info.component';
import { StatusMessageComponent } from '../../../core/components/status-message/status-message.component';
import { isNotFound, toProblemMessage } from '../../../core/http/problem-message';
import { PokemonService } from '../../../core/services/pokemon.service';
import { Pokemon } from '../../../core/models/pokemon.model';

type ViewState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'success'; pokemon: Pokemon };

const loading: ViewState = { status: 'loading' };
const notFound: ViewState = { status: 'not-found' };

const unexpectedMessage = 'Something went wrong while loading this Pokemon. Please try again.';

@Component({
  selector: 'app-pokemon-detail',
  imports: [
    ButtonComponent,
    CardComponent,
    LoadingStateComponent,
    IconComponent,
    PokemonBasicInfoComponent,
    PokemonStatsComponent,
    PokemonInfoComponent,
    StatusMessageComponent
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);
  private readonly refresh = new Subject<void>();

  private readonly id$ = this.route.paramMap.pipe(map(params => Number(params.get('id'))));

  protected readonly state = toSignal(
    combineLatest([this.id$, this.refresh.pipe(startWith(undefined))]).pipe(
      switchMap(([id]) => this.load(id))
    ),
    { initialValue: loading }
  );

  protected retry(): void {
    this.refresh.next();
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected navigateTo(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

  protected editPokemon(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id, 'edit']);
  }

  protected capitalizeName(name: string): string {
    return this.pokemonService.capitalizeName(name);
  }

  protected formatPokemonNumber(id: number): string {
    return this.pokemonService.formatPokemonNumber(id);
  }

  protected hasHiddenAbility(pokemon: Pokemon): boolean {
    return pokemon.abilities.some(ability => ability.isHidden);
  }

  private load(id: number): Observable<ViewState> {
    if (!isPokemonId(id)) {
      return of(notFound);
    }

    return this.pokemonService.getPokemon(id).pipe(
      map((pokemon): ViewState => ({ status: 'success', pokemon })),
      catchError(error =>
        of<ViewState>(isNotFound(error) ? notFound : { status: 'error', message: toProblemMessage(error, unexpectedMessage) })
      ),
      startWith(loading)
    );
  }
}

function isPokemonId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}
