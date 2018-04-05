import * as mongoose from 'mongoose';
import { PlayerColor, MessageType } from '../constants';
import { Schema } from 'mongoose';
import { IGameModel } from './Game';
import { IUserModel } from './User';

// TODO put this in another file?
export interface IMessage {
  game: IGameModel;
  user: IUserModel;
  message: string;
  timestamp: Date;
  type: MessageType;
  getObject(): any;
}

export interface IMessageModel extends IMessage, mongoose.Document {}

export var MessageSchema: mongoose.Schema = new mongoose.Schema({
  game: { type: Schema.Types.ObjectId, required: true, ref: 'Game' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
  type: String,
});

MessageSchema.methods.getObject = function() {
  let data = {
    game: this.game,
    user: this.user,
    message: this.message,
    timestamp: this.timestamp,
    type: this.type,
  };
  return data;
};

export const Message: mongoose.Model<IMessageModel> = mongoose.model<IMessageModel>('Message', MessageSchema);
