import { User } from './user';
import { Game } from './game';
import { MessageType } from './constants';

export class Message {
  timestamp: Date;
  message: string;
  user: User;
  game: Game;
  type: MessageType;

  constructor(data?: Object) {
    Object.keys(data || {}).forEach(key => (this[key] = data[key]));
  }
}
