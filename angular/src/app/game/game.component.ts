import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  historyOpen = true;
  gameStart = false;

  constructor(public _gameHistory: GameHistory) { }

  ngOnInit() {
  }

}
