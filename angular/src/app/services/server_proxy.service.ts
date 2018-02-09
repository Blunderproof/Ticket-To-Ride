import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';
import { Http } from '@angular/http';

@Injectable()
export class ServerProxy {
    communicator: ClientCommunicator;

    constructor(private http: Http) {
        this.communicator = new ClientCommunicator(http);
    }

    createGame() {
        this.communicator.send('createGame', {});
    }

    joinGame() {
        this.communicator.send('joinGame', {});
    }

    login(username: String, password: String) {
        this.communicator.send('login', {'username': username, 'password': password }); // needs to include username and password
    }

    register(username: String, password: String, confirmPassword: String) {
        // tslint:disable-next-line:max-line-length
        this.communicator.send('register', {'username': username, 'password': password, 'confirmPassword': confirmPassword}); // needs to include username password and confirmPassword
    }
}
