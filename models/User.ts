import * as mongoose from 'mongoose';
import { Route, IRouteModel } from './Route';
import { TrainCard, ITrainCardModel } from './TrainCard';
import { DestinationCard, IDestinationCardModel } from './DestinationCard';
import { PlayerColor, TurnState } from '../constants';
import { Schema } from 'mongoose';
import TurnStateObject from './user-states/TurnStateObject';
import TurnStateObjectLoader from './user-states/TurnStateObjectLoader';

export interface IUser {
  username: string;
  hashedPassword: string;
  claimedRouteList: IRouteModel[];
  trainCardHand: ITrainCardModel[];
  destinationCardHand: IDestinationCardModel[];

  score: number;
  tokenCount: number;
  color: PlayerColor;

  publicPoints: Promise<any>;
  privatePoints: Promise<any>;
  routePoints: Promise<any>;
  longestRoutePoints: Promise<any>;
  destinationCardNegativePoints: Promise<any>;
  destinationCardPositivePoints: Promise<any>;

  turnState: TurnState;
  getTurnStateObject(): TurnStateObject;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    hashedPassword: { type: String, required: true },
    claimedRouteList: [{ type: Schema.Types.ObjectId, ref: 'Route' }],
    trainCardHand: [{ type: Schema.Types.ObjectId, ref: 'TrainCard' }],
    destinationCardHand: [{ type: Schema.Types.ObjectId, ref: 'DestinationCard' }],

    score: Number,
    tokenCount: Number,
    color: String,

    turnState: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

UserSchema.methods.getTurnStateObject = function() {
  return TurnStateObjectLoader.instanceOf().createStateObject(this);
};

UserSchema.methods.publicPoints = function() {
  return Promise.all([this.routePoints(), this.longestRoutePoints()]).then(resolved => {
    //sum all results
    return resolved.reduce((a, b) => a + b, 0);
  });
};

UserSchema.methods.privatePoints = function() {
  return Promise.all([this.destinationCardNegativePoints(), this.destinationCardPositivePoints()]).then(resolved => {
    //sum all results
    return resolved.reduce((a, b) => a + b, 0);
  });
};

UserSchema.methods.routePoints = async function() {
  if (!this.claimedRouteList) return 0;

  let points = 0;
  let routes = await this.populate('claimedRouteList').execPopulate();
  for (let i = 0; i < this.claimedRouteList.length; i++) {
    points += this.claimedRouteList[i].pointValue;
  }
  return points;
};

UserSchema.methods.longestRoutePoints = function() {};

UserSchema.methods.destinationCardNegativePoints = function() {};

UserSchema.methods.destinationCardPositivePoints = function() {};

var DestinationCardFulfilled = (routes: IRouteModel[], destinationCard: IDestinationCardModel) => {
  let visited: string[] = [];

  var traverse = (curCity: string, findCity: string): any => {
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].city1 == curCity || (routes[i].city2 == curCity && visited.indexOf(routes[i]._id) === -1)) {
        visited.push(routes[i]._id);
        let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;

        if (newCity === findCity || traverse(newCity, findCity)) return true;
      }
    }
    return false;
  };
};

UserSchema.virtual('trainCardCount').get(function(this: IUserModel) {
  let counts = {
    pink: 0,
    black: 0,
    green: 0,
    blue: 0,
    white: 0,
    yellow: 0,
    orange: 0,
    red: 0,
    rainbow: 0,
  };
  for (let i = 0; i < this.trainCardHand.length; i++) {
    (counts as any)[this.trainCardHand[i].color]++;
  }
  return counts;
});

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
