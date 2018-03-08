import { Component, OnInit, Input } from '@angular/core';
import { TrainCard } from '../classes/train-card';

@Component({
  selector: 'app-train-card',
  templateUrl: './train-card.component.html',
  styleUrls: ['./train-card.component.scss']
})
export class TrainCardComponent implements OnInit {
@Input() count: number
@Input() color: string
image: string;
class: string;

  constructor() {
  }

  ngOnInit() {
    this.image = `../../assets/images/traincards/${this.color}.png`
    this.class = `${this.color}-cards card-container`
  }

}
