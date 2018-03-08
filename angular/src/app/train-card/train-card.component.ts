import { Component, OnInit, Input } from '@angular/core';
import { TrainCard } from '../classes/train-card';

@Component({
  selector: 'app-train-card',
  templateUrl: './train-card.component.html',
  styleUrls: ['./train-card.component.scss']
})
export class TrainCardComponent implements OnInit {
  @Input() trainCard: TrainCard;

  constructor() { }

  ngOnInit() {
  }

}
