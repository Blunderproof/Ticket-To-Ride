import { Component, OnInit } from '@angular/core';
import { ServerProxy } from '../services/server_proxy.service';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { Game } from '../classes/game';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss']
})
export class GameListComponent implements OnInit {
  gameList: Game[];
  errorMessages = [];

  constructor(private communicator: ServerProxy, private socket: SocketCommunicator, public _userInfo: UserInfo) {
    this.sockets();
   }

  ngOnInit() {
    this.communicator.requestGameList();

  }

  createGame() {
    this.errorMessages = [];
    this.communicator.createGame()
      .then((x: any) => {
        if (!x.success) {
          this.errorMessages.push(x.message);
        }
      });
  }

  sockets() {
    this.socket.receiveGameList(data => {
      this.gameList = data;

      if (this._userInfo.game) {
        this.socket.joinRoom(this._userInfo.game._id);
      }
    });
  }

}
