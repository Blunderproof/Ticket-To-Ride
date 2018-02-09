import { Component, OnInit } from '@angular/core';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss']
})
export class GamelistComponent implements OnInit {

  constructor(private communicator: ServerProxy) { }

  ngOnInit() {
  }

  createGame() {
    this.communicator.createGame();
  }

}
