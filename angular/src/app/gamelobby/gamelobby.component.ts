import { Component, OnInit } from '@angular/core';
import { PlayerInfo } from '../services/player_info.service';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.scss']
})
export class GameLobbyComponent implements OnInit {

  constructor(public _playerInfo: PlayerInfo) { }

  ngOnInit() {
  }

}
