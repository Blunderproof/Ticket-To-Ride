import { Component, OnInit } from '@angular/core';
import { ServerProxy } from '../services/server_proxy.service';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { Game } from '../classes/game';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss']
})
export class GameListComponent implements OnInit {
  gameList: Game[];

  constructor(private communicator: ServerProxy, private socket: SocketCommunicator) {
    this.sockets();
   }

  ngOnInit() {
    this.communicator.requestGameList();

  }

  createGame() {
    this.communicator.createGame();
  }

  sockets() {
    this.socket.receiveGameList(data => {
      console.log(data);
      this.gameList = data;
    });
  }

}
