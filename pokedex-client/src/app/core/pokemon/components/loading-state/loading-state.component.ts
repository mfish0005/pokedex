import { Component, input } from '@angular/core';
import { SpinnerComponent } from '@fish-ui/components';

@Component({
  selector: 'app-loading-state',
  imports: [SpinnerComponent],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.scss'
})
export class LoadingStateComponent {
  size = input<'small' | 'medium' | 'large' | 'extra-large'>('large');
  variant = input<'primary' | 'secondary' | 'white'>('primary');
  message = input<string>('Loading...');
}
