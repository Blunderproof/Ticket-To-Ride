import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  errorMessages = [];

  constructor(public _userInfo: UserInfo, public _gameHistory: GameHistory, private _serverProxy: ServerProxy, private _router: Router) { }

  ngOnInit() { }

  logout() {
    this.errorMessages = [];
    this._serverProxy.logout()
        .then((x: any) => {
          if (x.success) {
            this._router.navigate(['/login']);
          } else {
            this.errorMessages.push(x.message);
          }
        });
  }
}
