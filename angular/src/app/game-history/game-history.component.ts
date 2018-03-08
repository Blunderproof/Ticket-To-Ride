import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { SocketCommunicator } from '../services/socket_communicator.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {

  // https://www.youtube.com/watch?v=I317BhehZKM&t=37s
  historyList = [];

  constructor(public _gameHistory: GameHistory, private socket: SocketCommunicator) { }

  ngOnInit() {
    this.sockets();
  }

  sockets() {
    this.socket.updateGameHistory(data => {
      console.log(data);
      this.historyList = data;
    });
  }

}
