import { Injectable } from '@angular/core';
import { Game } from '../classes/game';
import { User } from '../classes/user';
import { ServerProxy } from './server_proxy.service';
import { SocketCommunicator } from './socket_communicator.service';
import { UserState } from '../classes/constants';

@Injectable()
export class UserInfo {
    game: Game;
    user = new User();
    errorMessages = [];
    userState = UserState.LoggedOut;

    constructor(private _serverProxy: ServerProxy, private socket: SocketCommunicator) {
        this.getGame();
        this.getUser();
    }

    getGame() {
        this._serverProxy.getGame()
            .then((x: any) => {
                if (x.success) {
                    this.game = x.result;
                    if (this.game) {
                        this.socket.joinRoom(this.game._id);
                        this._serverProxy.getGameHistory();
                        this._serverProxy.getChatHistory();
                        this.socket.updateGameState(data => {
                            console.log('Game State Updated');
                            console.log(data);
                            this.game = data;
                        });
                    }
                } else {
                    this.errorMessages.push(x.message);
                }
            });
    }

    getUser() {
        this._serverProxy.getUser()
            .then((x: any) => {
                if (x.success) {
                    this.user = new User(x.result) || new User();
                } else {
                    this.errorMessages.push(x.message);
                }
            });
    }

    getUserGameStatus() {
        return this._serverProxy.getUserGameStatus()
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
}
