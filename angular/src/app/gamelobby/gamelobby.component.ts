import { Component, OnInit } from '@angular/core';
import { PlayerInfo } from '../services/player_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { Router } from '@angular/router';
import { SocketCommunicator } from '../services/socket_communicator.service';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.scss']
})
export class GameLobbyComponent implements OnInit {
  errorMessages = [];

  constructor(public _playerInfo: PlayerInfo, private communicator: ServerProxy, private _router: Router,
     private _socket: SocketCommunicator) { }

  ngOnInit() {
    this.sockets();
  }

  startGame() {
    this.errorMessages = [];
    this.communicator.startGame()
      .then((x: any) => {
        // TODO: Don't navigate until socket emits to start game
        if (x.success) {
          this.errorMessages = [];
          this._router.navigate(['/game']);
        } else {
          this.errorMessages.push(x.message);
        }
      });
  }

  leaveGame() {
    this.errorMessages = [];
    this.communicator.leaveGame()
      .then((x: any) => {
        // TODO: Don't navigate until socket emits to start game
        if (x.success) {
          this.errorMessages = [];
          this._router.navigate(['/lobby']);
        } else {
          this.errorMessages.push(x.message);
        }
      });
  }

  deleteGame() {
    this.errorMessages = [];
    this.communicator.deleteGame()
      .then((x: any) => {
        // TODO: Don't navigate until socket emits to start game
        if (x.success) {
          this.errorMessages = [];
          this._router.navigate(['/lobby']);
        } else {
          this.errorMessages.push(x.message);
        }
      });
  }

  sockets() {
    this._socket.startGame(x => {
      this._router.navigate(['/game']);
    });
  }
}
