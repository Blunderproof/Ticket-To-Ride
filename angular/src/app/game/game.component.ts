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
<<<<<<< HEAD

=======
    console.log('YES');
>>>>>>> 37a7ec91c227c5c81789f5283bc44bc00414b0d5
  }
}
