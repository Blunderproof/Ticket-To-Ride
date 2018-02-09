import { Component, OnInit } from '@angular/core';
import { Game } from '../classes/game';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-gametile',
  templateUrl: './gametile.component.html',
  styleUrls: ['./gametile.component.scss']
})
export class GameTileComponent implements OnInit {
  game: Game;

  constructor(private communicator: ServerProxy) { }

  ngOnInit() {
  }

  joinGame() {
    this.communicator.joinGame(this.game.id);
  }

}
