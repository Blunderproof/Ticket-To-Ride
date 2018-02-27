import * as mongoose from 'mongoose';
import { Route, IRouteModel } from './Route';
import { TrainCard, ITrainCardModel } from './TrainCard';
import { DestinationCard, IDestinationCardModel } from './DestinationCard';
import { PlayerColor } from '../constants';
import { Schema } from 'mongoose';

export enum UserState {
  LoggedOut = 1,
  LoggedIn,
  InGame,
}

// TODO put this in another file?
export interface IUser {
  username: string;
  hashedPassword: string;
  claimedRouteList: IRouteModel[];
  trainCardHand: ITrainCardModel[];
  destinationCardHand: IDestinationCardModel[];
  score: number;
  color: PlayerColor;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  hashedPassword: { type: String, required: true },
  claimedRouteList: [
    { type: Schema.Types.ObjectId, required: true, ref: 'Route' },
  ],
  trainCardHand: [
    { type: Schema.Types.ObjectId, required: true, ref: 'TrainCard' },
  ],
  destinationCardHand: [
    { type: Schema.Types.ObjectId, required: true, ref: 'DestinationCard' },
  ],
  score: Number,
  color: String,
});

UserSchema.methods.calculateNewPointValues = function() {
  // pass
};

UserSchema.methods.createRouteGraph = function() {
  // pass
};

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>(
  'User',
  UserSchema
);
