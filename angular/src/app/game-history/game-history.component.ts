import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {

  // https://www.youtube.com/watch?v=I317BhehZKM&t=37s
  historyList = [];

  constructor(public _gameHistory: GameHistory, private socket: SocketCommunicator,private _serverProxy: ServerProxy) { }

  ngOnInit() {
    this.sockets();
    this._serverProxy.getGameHistory()
  }

  sockets() {
    this.socket.updateGameHistory(data => {
      console.log(data);
      this.historyList = data;
    });
  }

}
