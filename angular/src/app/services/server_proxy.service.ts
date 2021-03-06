import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';
import { SocketCommunicator } from './socket_communicator.service';

@Injectable()
export class ServerProxy {
  constructor(private communicator: ClientCommunicator, private _socket: SocketCommunicator) {}

  createGame() {
    return this.communicator.send('createGame', {});
  }

  joinGame(gameID: string) {
    this._socket.joinRoom(gameID);
    return this.communicator.send('joinGame', {
      gameID: gameID,
    });
  }

  startGame() {
    return this.communicator.send('startGame', {});
  }

  leaveGame(gameID: string) {
    this._socket.leaveRoom(gameID);
    return this.communicator.send('leaveGame', {});
  }

  deleteGame() {
    return this.communicator.send('deleteGame', {});
  }

  login(username: string, password: string) {
    // needs to include username and password
    return this.communicator.send('login', {
      username: username,
      password: password,
    });
  }

  logout() {
    return this.communicator.send('logout', {});
  }

  register(username: string, password: string, confirmPassword: string) {
    // needs to include username password and confirmPassword
    return this.communicator.send('register', {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    });
  }

  requestGameList() {
    return this.communicator.send('getOpenGameList', {});
  }

  sendMessage(message: string) {
    return this.communicator.send('sendMessage', {
      message: message,
    });
  }

  getGame() {
    return this.communicator.send('getGame', {});
  }

  getUser() {
    return this.communicator.send('getUser', {});
  }

  getChatHistory() {
    return this.communicator.send('getChatHistory', {});
  }

  getGameHistory() {
    return this.communicator.send('getGameHistory', {});
  }

  initialSelectDestinationCard(data: string[]) {
    return this.communicator.send('initialSelectDestinationCard', {
      discardCards: data,
    });
  }

  setChooseDestinationCardState() {
    return this.communicator.send('setChooseDestinationCardState', {});
  }

  chooseDestinationCard(data: any) {
    return this.communicator.send('chooseDestinationCard', {
      keepCards: data,
    });
  }

  claimRoute(data: any) {
    return this.communicator.send('claimRoute', {
      color: data.color,
      routeNumber: data.routeNumber,
      city1: data.city1,
      city2: data.city2,
      colorToUse: data.colorToUse,
    });
  }

  chooseTrainCard(data: number) {
    return this.communicator.send('chooseTrainCard', {
      cardIndex: data,
    });
  }

  getUserGameStatus() {
    return this.communicator.send('getUserGameStatus', {});
  }

  endGame() {
    return this.communicator.send('endGame', {});
  }
}
