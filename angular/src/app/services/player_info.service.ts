import { Injectable } from '@angular/core';
import { Game } from '../classes/game';

@Injectable()
export class PlayerInfo {
    id: string;
    game: Game;
    username: string;

    constructor() { }

}
