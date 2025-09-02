import { Component, Input } from '@angular/core';

export type CardElevation = 'none' | 'small' | 'medium' | 'large';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

@Component({
  selector: 'fish-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
  @Input() elevation: CardElevation = 'small';
  @Input() padding: CardPadding = 'medium';
  @Input() hoverable = false;
  @Input() clickable = false;


}
