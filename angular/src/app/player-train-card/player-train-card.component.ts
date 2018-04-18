import { Component, OnInit, Input } from '@angular/core';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-player-train-card',
  templateUrl: './player-train-card.component.html',
  styleUrls: ['./player-train-card.component.scss'],
})
export class PlayerTrainCardComponent implements OnInit {
  @Input() color: string;
  @Input() displayNonzero: boolean;
  image: string;
  class: string;

  constructor(private _userInfo: UserInfo) {}

  ngOnInit() {
    this.image = `../../assets/images/traincards/${this.color}.png`;
    this.class = `${this.color}-cards card-container`;
  }

  count() {
    if (this._userInfo.game) {
      return this._userInfo.user.trainCardCount[this.color];
    }
  }
}
