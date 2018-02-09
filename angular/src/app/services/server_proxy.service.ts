import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';

@Injectable()
export class ServerProxy {
    constructor(private communicator: ClientCommunicator) { }

    createGame() {
        this.communicator.send({'methodName': 'createGame'});
    }

    joinGame() {
        this.communicator.send({'methodName': 'joinGame'});
    }

    login(username: string, password: string) {
        // needs to include username and password
        this.communicator.send({'methodName': 'login', 'username': username, 'password': password});
    }

    register(username: string, password: string, confirmPassword: string) {
        // needs to include username password and confirmPassword
        // tslint:disable-next-line:max-line-length
        this.communicator.send({'methodName': 'register', 'username': username, 'password': password, 'confirmPassword': confirmPassword});
    }
}
