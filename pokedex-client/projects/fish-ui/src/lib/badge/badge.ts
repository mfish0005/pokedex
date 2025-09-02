import { Component, Input } from '@angular/core';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
export type BadgeSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'fish-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class Badge {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'medium';
  @Input() rounded = false;
  @Input() outline = false;
  @Input() customColor?: string; // For custom Pokémon type colors



  get customStyles(): any {
    if (this.variant === 'custom' && this.customColor) {
      return {
        'background-color': this.customColor,
        'color': 'white'
      };
    }
    return {};
  }
}
