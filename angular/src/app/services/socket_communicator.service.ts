import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {SocketIOClient} from 'socket.io-client';

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

    joinGame(gameID: string) {
        return this.socket.emit('join', {
            room: gameID
        });
    }

}
