import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';

@Injectable()
export class ServerProxy {
    constructor(private communicator: ClientCommunicator) { }

    createGame() {
        this.communicator.send('createGame', {});
    }

    joinGame(gameID: string) {
        this.communicator.send('joinGame', {
            gameID: gameID
        });
    }

    // login(username: string, password: string) {
    //     // needs to include username and password
    //     this.communicator.send({'methodName': 'login', 'username': username, 'password': password});
    // }

    login(username: string, password: string) {
        // needs to include username and password
        this.communicator.send('login', {
            username: username,
            password: password
        }).then(x => {
            console.log(x);
        }).catch(err => {
            console.error(err);
        });
    }

    register(username: string, password: string, confirmPassword: string) {
        // needs to include username password and confirmPassword
        // tslint:disable-next-line:max-line-length
        this.communicator.send('register', {
            username: username,
            password: password,
            confirmPassword: confirmPassword
        });
    }
}
