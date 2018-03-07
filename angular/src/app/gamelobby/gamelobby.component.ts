import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
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

  constructor(public _userInfo: UserInfo, private communicator: ServerProxy, private _router: Router,
     private _socket: SocketCommunicator) { }

  ngOnInit() {
    this.sockets();
    this._userInfo.getGame();
  }

  startGame() {
    this.errorMessages = [];
    this.communicator.startGame()
      .then((x: any) => {
        if (x.success) {
          this.errorMessages = [];
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
