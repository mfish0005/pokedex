import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from 'fish-ui';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokedex-header',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './pokedex-header.component.html',
  styleUrl: './pokedex-header.component.scss'
})
export class PokedexHeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;
  
  protected readonly isOnPokemonListPage = signal(false);

  ngOnInit() {    
    this.updatePageState();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageState();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private updatePageState() {    
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    
    const routeData = route.snapshot.data;
    const hideViewAllButton = routeData['hideViewAllButton'] || false;
    
    this.isOnPokemonListPage.set(hideViewAllButton);
  }
}

