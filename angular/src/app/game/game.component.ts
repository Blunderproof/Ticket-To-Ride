import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { User } from '../classes/user';
import { Message } from '../classes/message';
import { MessageType, TurnState } from '../classes/constants';
import { ServerProxy } from '../services/server_proxy.service';
import { GameHistory } from '../services/game-history.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  historyOpen = true;
  gameStart = false;
  drawDest = false;
  viewPlayerCards = true;

  leftCollapsed = true;


  intentoryOverlayApplied = true;

  gameOver = true;

  simState = 0;
  turnStateEnum = TurnState;

  constructor(
    private _serverProxy: ServerProxy,
    public _gameHistory: GameHistory,
    public _userInfo: UserInfo
  ) {}

  ngOnInit() {
    this._userInfo.getUser();
    this._userInfo.getGame();
    this.printUserInfo();
  }

  leftCollapsedToggle(){
    this.leftCollapsed = !this.leftCollapsed;
  }

  printUserInfo() {
    console.log(this._userInfo);
  }

  drawDestinationCards() {
    this.drawDest = true;
  }
}
