import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  historyOpen = true;
  gameStart = false;

  constructor(public _gameHistory: GameHistory, private _userInfo: UserInfo) { }

  ngOnInit() {
    this.printUserInfo();
  }

  printUserInfo(){
    console.log(this._userInfo);
  }

}
