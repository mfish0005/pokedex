import { Component } from '@angular/core';

@Component({
  selector: 'app-helpers',
  standalone: true,
  imports: [],
  templateUrl: './helpers.component.html',
  styleUrl: './helpers.component.scss'
})
export class HelpersComponent {
  isVisible = true;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
