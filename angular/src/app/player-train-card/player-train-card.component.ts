import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-train-card',
  templateUrl: './player-train-card.component.html',
  styleUrls: ['./player-train-card.component.scss']
})
export class PlayerTrainCardComponent implements OnInit {
@Input() count: number;
@Input() color: string;
image: string;
class: string;

  constructor() {}

  ngOnInit() {
    this.image = `../../assets/images/traincards/${this.color}.png`;
    this.class = `${this.color}-cards card-container`;
  }

}
