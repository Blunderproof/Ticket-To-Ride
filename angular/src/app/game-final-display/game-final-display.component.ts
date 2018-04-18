import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { RGBAColor } from '../classes/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-final-display',
  templateUrl: './game-final-display.component.html',
  styleUrls: ['./game-final-display.component.scss'],
})
export class GameFinalDisplayComponent implements OnInit {
  winner = '';
  winningScore = 0;
  rgbaColorEnum = RGBAColor;
  display = true;
  message = null;

  constructor(public _userInfo: UserInfo, private _serverProxy: ServerProxy, private _router: Router) {}

  returnToLobby() {
    this._router.navigate(['/lobby']);
  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
    console.log(this._userInfo);
    this.winningScore = this._userInfo.game.userList[0].points.total;
    this.winner = this._userInfo.game.userList[0].username;

    for (let index = 0; index < this._userInfo.game.userList.length; index++) {
      const user = this._userInfo.game.userList[index];
      if (user.points.total > this.winningScore) {
        this.winningScore = user.points.total;
        this.winner = user.username;
      }
    }
  }
}
