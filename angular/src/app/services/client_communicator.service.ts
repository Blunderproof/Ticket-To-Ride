import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClientCommunicator {

    constructor(private _http: HttpClient) { }

    send(method: string, data: object) {
        return new Promise((accept, reject) => {
            this._http.post('/execute', {
                methodName: method,
                data: data
            }).subscribe(
                (x: any) =>  {
                    console.log(x);
                    accept(x);
                },
                (x: any) => {
                    console.error(x);
                    reject(x);
                }
            );
        });
    }
}
