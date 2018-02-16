import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../classes/game';
import { ServerProxy } from '../services/server_proxy.service';
import { PlayerInfo } from '../services/player_info.service';

@Component({
  selector: 'app-gametile',
  templateUrl: './gametile.component.html',
  styleUrls: ['./gametile.component.scss']
})
export class GameTileComponent implements OnInit {
  @Input() game: Game;
  errorMessages = [];

  constructor(private communicator: ServerProxy, public playerinfo: PlayerInfo) { }

  ngOnInit() {
    console.log(this.playerinfo, this.game);
  }

  joinGame() {
    this.errorMessages = [];
    this.communicator.joinGame(this.game._id)
      .then((x: any) => {
        if (!x.success) {
          this.errorMessages.push(x.message);
        }
      });
  }

}
