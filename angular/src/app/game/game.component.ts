import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  historyOpen = true;
  gameStart = false;

  constructor(public _gameHistory: GameHistory, public _userInfo: UserInfo) {}

  ngOnInit() {
    this._userInfo.getUser();
    this._userInfo.getGame();
    this.printUserInfo();
  }

  printUserInfo() {
    console.log(this._userInfo);
    console.log('YES');
  }
}
