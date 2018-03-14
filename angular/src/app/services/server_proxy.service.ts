import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';

@Injectable()
export class ServerProxy {
  constructor(private communicator: ClientCommunicator) {}

  createGame() {
    return this.communicator.send('createGame', {});
  }

  joinGame(gameID: string) {
    return this.communicator.send('joinGame', {
      gameID: gameID,
    });
  }

  startGame() {
      return this.communicator.send('startGame', {});
  }

  leaveGame() {
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
      message: message
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
      discardCards: data
    });
  }

  chooseDestinationCard(data: any) {
    return this.communicator.send('chooseDestinationCard', {});
  }

  claimRoute(data: any) {
    return this.communicator.send('claimRoute', {});
  }

  chooseTrainCard(data: any) {
    return this.communicator.send('chooseTrainCard', {});
  }

  getUserGameStatus() {
    return this.communicator.send('getUserGameStatus', {});
  }
}
