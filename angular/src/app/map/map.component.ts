import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { User } from '../classes/user';
import { RouteColor } from '../classes/constants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  errorMessages = [];
  overlayApplied = true;
  trainPathStates = {};
  routeColorEnum = RouteColor;

  constructor(public _gameHistory: GameHistory, public _userInfo: UserInfo, private communicator: ServerProxy) {}

  ngOnInit() {}

  mapClicked(event, correspondingTrainPath) {
    this.errorMessages = [];
    const routeInfo = event.path[2].id.split('-');
    const routeColor = this.routeColorEnum[routeInfo[0]];
    const routeNumber = routeInfo[1];
    const routeCity1 = routeInfo[2];
    const routeCity2 = routeInfo[3];

    const data = {
      city1: routeCity1,
      city2: routeCity2,
      color: routeColor,
      routeNumber: routeNumber,
      colorToUse: 'yellow' // TODO: Provide a way for the user to choose a color
    };

    console.log(data);

    this.communicator.claimRoute(data)
      .then((x: any) => {
        if (!x.success) {
          this.errorMessages.push(x.message);
        }
      });
  }
}
