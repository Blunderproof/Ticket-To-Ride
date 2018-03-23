import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-game-final-display',
  templateUrl: './game-final-display.component.html',
  styleUrls: ['./game-final-display.component.scss']
})

export class GameFinalDisplayComponent implements OnInit {

  display = false;
  message = null;

  constructor(public _userInfo: UserInfo, private _serverProxy: ServerProxy) {}

  onCloseHandled() {
    this.display = false;
  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
    console.log(this._userInfo);
  }
}
