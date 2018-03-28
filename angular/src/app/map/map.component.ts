import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { User } from '../classes/user';
import { RouteColor } from '../classes/constants';
import { Route } from '../classes/route';

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
  displayColorSelection = false;
  routeSelected: Route = null;

  playerCities =[];

  constructor(public _gameHistory: GameHistory, public _userInfo: UserInfo, private communicator: ServerProxy) {}


  ngOnInit() {
    let playerCities = [];
    let userInfo = this._userInfo;
    userInfo.user.destinationCardHand.forEach(function (card){
      playerCities.push(card.city1);
      playerCities.push(card.city2);
      //console.log(card);
    });
    console.log(playerCities);
    this.playerCities = playerCities;
    console.log(this.playerCities);
  }

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
    };

    if (routeColor == RouteColor.Gy) {
      this._userInfo.displayColorSelection = true;
      this._userInfo.routeSelected = new Route(data);
      return;
    }

    console.log(data);

    this.communicator.claimRoute(data).then((x: any) => {
      if (!x.success) {
        this.errorMessages.push(x.message);
      }
    });
  }

  cityHightlighted(cityName: string){

  }

  canClaimRoute(){
    let userInfo = this._userInfo;
    if(userInfo.isCurrentTurn()){
      if(userInfo.user.turnState != "OneTrainCardChosen"){
        return true;
      }
    }
    return false;
  }
}
