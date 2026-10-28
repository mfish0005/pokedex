import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-status-message',
  standalone: true,
  templateUrl: './status-message.component.html',
  styleUrl: './status-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusMessageComponent {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly tone = input<'info' | 'error'>('info');
}
