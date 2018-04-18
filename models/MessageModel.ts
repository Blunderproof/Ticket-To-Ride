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
    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.message = data.message;
    this.timestamp = data.timestamp;
    this.type = data.type;

    this.game = new GameModel(data.game || {});
    this.user = new UserModel(data.user || {});
  }

  getObject(): any {
    let data = {
      game: typeof this.game == 'string' ? this.game : this.game.getObject(),
      user: typeof this.user == 'string' ? this.user : this.user.getObject(),
      message: this.message,
      timestamp: this.timestamp,
      type: this.type,
    };
    return data;
  }
}
