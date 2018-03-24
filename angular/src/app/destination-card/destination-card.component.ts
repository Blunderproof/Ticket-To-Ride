import { Component, OnInit, Input } from '@angular/core';
import { DestinationCard } from '../classes/destination-card';

@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.component.html',
  styleUrls: ['./destination-card.component.scss'],
})
export class DestinationCardComponent implements OnInit {
  @Input() card: DestinationCard;
  @Input() clickable: boolean;
  @Input() complete?: boolean;

  constructor() {}

  cardClick() {
    if (this.clickable) {
      this.card.selected = !this.card.selected;
    }
  }

  ngOnInit() {
    this.card.selected = false;
  }
}
