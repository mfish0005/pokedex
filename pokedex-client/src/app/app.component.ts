import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PokedexHeaderComponent } from './features/pokemon-list/components/pokedex-header/pokedex-header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    PokedexHeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  
  showHeader = signal(true);

  constructor() {    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderVisibility();
      });
    
    this.updateHeaderVisibility();
  }

  private updateHeaderVisibility() {    
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    
    const routeData = route.snapshot.data;
    const shouldShowHeader = routeData['showHeader'] || false;
    
    this.showHeader.set(shouldShowHeader);
  }
}
