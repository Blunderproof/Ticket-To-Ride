import { Injectable } from '@angular/core';
import { Game } from '../classes/game';
import { User } from '../classes/user';
import { ServerProxy } from './server_proxy.service';
import { SocketCommunicator } from './socket_communicator.service';
import { UserState } from '../classes/constants';
import { Route } from '../classes/route';

@Injectable()
export class UserInfo {
  game: Game;
  user = new User();
  errorMessages = [];
  userState = UserState.LoggedOut;
  trainPathStates = {};
  viewDestinationCards = false;
  displayColorSelection = false;
  routeSelected: Route = null;

  constructor(private _serverProxy: ServerProxy, private socket: SocketCommunicator) {
    this.getGame();
    this.getUser();
    this.socket.updateGameState(state => {
      this.game = state;
      this.getUser();
    });
  }

  getGame() {
    this._serverProxy.getGame().then((x: any) => {
      if (x.success) {
        this.game = x.result;
        this.updateRoutes();
        if (this.game) {
          this.socket.joinRoom(this.game._id);
          this._serverProxy.getGameHistory();
          this._serverProxy.getChatHistory();
          this.socket.updateGameState(data => {
            console.log('Game State Updated');
            console.log(data);
            this.game = data;
            this.updateRoutes();
          });
        }
      } else {
        this.errorMessages.push(x.message);
      }
    });
  }

  getUser() {
    this._serverProxy.getUser().then((x: any) => {
      if (x.success) {
        this.user = new User(x.result) || new User();
      } else {
        this.errorMessages.push(x.message);
      }
    });
  }

  getUserGameStatus() {
    return this._serverProxy
      .getUserGameStatus()
      .then((x: any) => {
        if (x.success) {
          this.userState = x.result.status;
          return this.userState;
        } else {
          console.log(x.message);
          this.userState = UserState.LoggedOut;
          return this.userState;
        }
      })
      .catch(x => {
        this.userState = UserState.LoggedOut;
        return this.userState;
      });
  }

  isCurrentTurn() {
    if (this.user != null && this.game != null) {
      if (this.user._id != null && this.game.turnNumber >= 0) {
        if (this.user._id == this.game.userList[this.game.turnNumber % this.game.userList.length]._id) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  updateRoutes() {
    if (this.game) {
      if (this.game.turnNumber < 0) {
        this.trainPathStates = {};
      }
      this.game.userList.forEach(user => {
        user.claimedRouteList.forEach(route => {
          this.trainPathStates[`tp-${route.routeNumber}-${route.city1}-${route.city2}`] = user.color;
        });
      });
    }
  }
}
