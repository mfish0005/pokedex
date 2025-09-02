import { Component } from '@angular/core';

// Re-export all components for convenience
export * from './button/button';
export * from './spinner/spinner';
export * from './card/card';
export * from './badge/badge';

@Component({
  selector: 'fish-fish-ui',
  imports: [],
  template: `
    <p>
      fish-ui works!
    </p>
  `,
  styles: ``
})
export class FishUi {

}
