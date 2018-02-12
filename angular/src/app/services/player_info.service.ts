import { Injectable } from '@angular/core';
import { ClientCommunicator } from './client_communicator.service';
import { Game } from '../classes/game';

@Injectable()
export class PlayerInfo {
    id: string;
    game: Game;

    constructor() { }

}
