import { MessageType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { GameModel } from './GameModel';
import { UserModel } from './UserModel';

export class MessageModel {
    _id?: string;
    game: GameModel;
  user: UserModel;
  message?: string;
  timestamp?: Date;
  type?: MessageType;

  constructor(data?: any) {
    Object.keys(data || {}).forEach(k => ((this as any)[k] = data[k]));

    this.game = new GameModel(data.game || {});
    this.user = new UserModel(data.user || {});
  }

  getObject(): any {
    let data = {
      game: this.game,
      user: this.user,
      message: this.message,
      timestamp: this.timestamp,
      type: this.type,
    };
    return data;
  }
}
