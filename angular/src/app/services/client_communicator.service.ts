import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClientCommunicator {

    constructor(private _http: HttpClient) { }

    send(data: object) {
        this._http.post('http://localhost:3000/execute', data).subscribe(
            (x: any) => { }
        );
    }
}
