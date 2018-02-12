import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {SocketIOClient} from 'socket.io-client';

@Injectable()
export class SocketCommunicator {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io();
    }

    receiveMessage(callback: any) {
        return this.socket.on('message', callback);
    }

    receiveGameList(callback: any) {
        return this.socket.on('gameList', callback);
    }

    receivePlayerList(callback: any) {
        return this.socket.on('playerList', callback);
    }

}
