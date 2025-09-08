import { Component } from '@angular/core';
import { CardComponent } from '@fish-ui/components';

@Component({
  selector: 'app-card-demo',
  imports: [CardComponent],
  templateUrl: './card-demo.component.html',
  styleUrl: './card-demo.component.scss'
})
export class CardDemoComponent {
  onCardClick(type: string) {
    console.log(`${type} card clicked!`);
  }
}
