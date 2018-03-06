import { Injectable } from '@angular/core';
import { Game } from '../classes/game';
import { User } from '../classes/user';
import { ServerProxy } from './server_proxy.service';
import { SocketCommunicator } from './socket_communicator.service';

@Injectable()
export class UserInfo {
    game: Game;
    user = new User();
    errorMessages = [];

    constructor(private _serverProxy: ServerProxy) {
        this.getGame();
    }

    getGame() {
        this._serverProxy.getGame()
            .then((x: any) => {
                if (x.success) {
                    this.game = x.result;
                } else {
                    this.errorMessages.push(x.message);
                }
            });
    }
}
