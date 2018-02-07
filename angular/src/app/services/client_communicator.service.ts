import {Http} from '@angular/http';

export class ClientCommunicator {

    private http: Http;

    constructor(in_http: Http) {
        this.http = in_http;
    }

    send(method: string, data: object) {
        this.http.post('/command', {
            method: method,
            data: data
        });
    }
}
