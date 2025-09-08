import { Component } from '@angular/core';

@Component({
  selector: 'app-variables',
  template: `
    <div class="docs-container">
      <div class="docs-header">
        <h1>📊 Variables</h1>
        <p>Explore available SCSS variables and customization options.</p>
      </div>
      <div class="coming-soon">
        <h2>Coming Soon!</h2>
        <p>Variables documentation is being prepared...</p>
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
export class VariablesComponent {}
