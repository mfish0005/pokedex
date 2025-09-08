import { Component } from '@angular/core';

@Component({
  selector: 'app-theming',
  template: `
    <div class="docs-container">
      <div class="docs-header">
        <h1>🎨 Theming</h1>
        <p>Customize the look and feel of Fish UI components.</p>
      </div>
      <div class="coming-soon">
        <h2>Coming Soon!</h2>
        <p>Theming documentation is being prepared...</p>
      </div>
    </div>
  `,
  styles: [`
    .docs-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    .docs-header h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
      color: #374151;
    }
    .coming-soon {
      margin-top: 3rem;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 8px;
    }
  `]
})
export class ThemingComponent {}
