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
}
