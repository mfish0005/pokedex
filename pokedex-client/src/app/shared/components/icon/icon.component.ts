import { Component, input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type IconName = 
  | 'chevron-left' 
  | 'chevron-right' 
  | 'arrow-left' 
  | 'arrow-right'
  | 'home'
  | 'search'
  | 'heart'
  | 'star'
  | 'info'
  | 'refresh'
  | 'close'
  | 'check'
  | 'warning'
  | 'error';

@Component({
  selector: 'app-icon',
  imports: [NgSwitch, NgSwitchCase],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(24);
  
  viewBox() {
    return '0 0 24 24';
  }
}
