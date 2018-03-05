import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public _userInfo: UserInfo, private _gameHistory: GameHistory) { }

  ngOnInit() { }
}
