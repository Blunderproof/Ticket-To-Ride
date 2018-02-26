import { Injectable } from '@angular/core';
import { Game } from '../classes/game';
import { User } from '../classes/user';

@Injectable()
export class UserInfo {
    game: Game;
    user = new User();

    constructor() { }

}
