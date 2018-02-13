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

  constructor(private communicator: ServerProxy, public playerinfo: PlayerInfo) { }

  ngOnInit() {
    console.log(this.playerinfo, this.game);
  }

  joinGame() {
    this.communicator.joinGame(this.game._id)
      .then((x: any) => {
        if (x.success) {
          this.playerinfo.game = this.game;
        }
      });
  }

}
