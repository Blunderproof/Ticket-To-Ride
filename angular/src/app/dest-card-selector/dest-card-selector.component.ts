import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-dest-card-selector',
  templateUrl: './dest-card-selector.component.html',
  styleUrls: ['./dest-card-selector.component.scss'],
})
export class DestCardSelectorComponent implements OnInit {
  display = true;

  selectedCard = [ false, false, false ];

  constructor(public _userInfo: UserInfo) { }

  onCloseHandled() {
    let numberSelected = this.selectedCard.filter( (value, index) => { return value }).length;
    console.log(numberSelected);
    // this.display = false;
  }

  selectDestCard(event) {
    this.selectedCard[event.path[0].id] = !this.selectedCard[event.path[0].id];
    console.log(event.path[0].id);
  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
    console.log("HAND");
    console.log(this._userInfo);
  }
}
