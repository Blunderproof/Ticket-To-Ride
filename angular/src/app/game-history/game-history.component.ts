import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {

  // https://www.youtube.com/watch?v=I317BhehZKM&t=37s

  constructor(public _gameHistory: GameHistory) { }

  ngOnInit() {
  }

}
