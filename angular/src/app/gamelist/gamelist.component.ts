import { Component, OnInit } from '@angular/core';
import { ServerProxy } from '../services/server_proxy.service';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { Game } from '../classes/game';
import { PlayerInfo } from '../services/player_info.service';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss']
})
export class GameListComponent implements OnInit {
  gameList: Game[];
  errorMessages = [];

  constructor(private communicator: ServerProxy, private socket: SocketCommunicator, public _playerInfo: PlayerInfo) {
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
      // tslint:disable-next-line:max-line-length
      this._playerInfo.game = this.gameList.filter(x => x.playerList
                                            .indexOf(x.playerList
                                              .find(y => y.username === this._playerInfo.player.username)) !== -1)[0] || null;
    });
  }

}
