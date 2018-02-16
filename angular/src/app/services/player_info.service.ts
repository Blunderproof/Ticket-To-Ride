import { Injectable } from '@angular/core';
import { Game } from '../classes/game';
import { Player } from '../classes/player';

@Injectable()
export class PlayerInfo {
    game: Game;
    player = new Player();

    constructor() { }

}
