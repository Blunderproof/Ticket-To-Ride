import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  overlayApplied = true;
  trainPathStates = {};
  constructor(public _gameHistory: GameHistory, public _userInfo: UserInfo) { }

  ngOnInit() {
  }

  isCurrentTurn(){
    if (this._userInfo.user.userIndex == (this._userInfo.game.turnNumber % this._userInfo.game.userList.length)){
      return true;
    } else{
      return false;
    }
  }

  mapClicked(correspondingTrainPath) {
    this.trainPathStates[correspondingTrainPath] = this._userInfo.user.color;
  }

}
