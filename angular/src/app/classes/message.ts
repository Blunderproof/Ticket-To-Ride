import { User } from './user';

export class Message {
    timestamp: Date;
    text: string;
    sender: User;

    constructor() { }
}
