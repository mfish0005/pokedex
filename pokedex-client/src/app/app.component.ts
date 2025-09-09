import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { PokedexHeaderComponent } from './features/pokemon-list/components/pokedex-header/pokedex-header.component';

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
    this.router.events.subscribe(() => {
      this.updateHeaderVisibility();
    });
    
    this.updateHeaderVisibility();
  }

  private updateHeaderVisibility() {
    const currentUrl = this.router.url;
    const shouldShowHeader = currentUrl === '/' || currentUrl.startsWith('/pokemon-list');
    
    this.showHeader.set(shouldShowHeader);
  }
}
