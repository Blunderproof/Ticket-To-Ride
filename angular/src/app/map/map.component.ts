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

  trainPathStates = {};
  constructor(public _gameHistory: GameHistory, public _userInfo: UserInfo) { }

  ngOnInit() {
  }

  mapClicked(event, correspondingTrainPath){
    //console.log("MAP CLICKED");
    //console.log(event);
    console.log("MAP STRING");
    console.log(correspondingTrainPath);
    this.trainPathStates[correspondingTrainPath] = this._userInfo.user.color;
    console.log(this.trainPathStates[correspondingTrainPath]);
  }

}
