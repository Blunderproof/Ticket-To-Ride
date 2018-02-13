import { Component, OnInit } from '@angular/core';
import { PlayerInfo } from '../services/player_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.scss']
})
export class GameLobbyComponent implements OnInit {

  constructor(public _playerInfo: PlayerInfo, private communicator: ServerProxy, private _router: Router) { }

  ngOnInit() {
  }

  startGame() {
    this.communicator.startGame()
      .then((x: any) => {
        // TODO: Don't navigate until socket emits to start game
        if (x.success) {
          this._router.navigate(['/game']);
        }
      });
  }
}
