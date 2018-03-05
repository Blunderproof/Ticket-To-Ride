import {User} from '../classes/user';


export class Game {
    name: string;
    userList: User[];
    host: User;
    gameState: string;
    _id: string;

    constructor() {

    }
}
