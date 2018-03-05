import { User } from './user';
import { Game } from './game';

export class Message {
    timestamp: Date;
    message: string;
    user: User;
    game: Game;

    constructor() { }
}
