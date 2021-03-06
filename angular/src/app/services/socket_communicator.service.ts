import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketIOClient } from 'socket.io-client';

@Injectable()
export class SocketCommunicator {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io();
  }

  receiveGameList(callback: any) {
    return this.socket.on('gameList', callback);
  }

  startGame(callback: any) {
    return this.socket.on('startGame', callback);
  }

  joinRoom(gameID?: string) {
    return this.socket.emit('join', {
      room: gameID,
    });
  }

  leaveRoom(gameID?: string) {
    return this.socket.emit('leave', {
      room: gameID,
    });
  }

  updateChatHistory(callback: any) {
    return this.socket.on('updateChatHistory', callback);
  }

  updateGameHistory(callback: any) {
    return this.socket.on('updateGameHistory', callback);
  }

  updateGameState(callback: any) {
    return this.socket.on('updateGameState', callback);
  }
}
