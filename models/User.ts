import * as mongoose from 'mongoose';
import { Route, IRouteModel } from './Route';
import { TrainCard, ITrainCardModel } from './TrainCard';
import { DestinationCard, IDestinationCardModel } from './DestinationCard';
import { PlayerColor, TurnState } from '../constants';
import { Schema } from 'mongoose';
import TurnStateObject from './user-states/TurnStateObject';
import TurnStateObjectLoader from './user-states/TurnStateObjectLoader';
import { resolve } from 'path';

export interface IUser {
  username: string;
  hashedPassword: string;
  claimedRouteList: IRouteModel[];
  trainCardHand: ITrainCardModel[];
  destinationCardHand: IDestinationCardModel[];
  metDestinationCards: IDestinationCardModel[];
  unmetDestinationCards: IDestinationCardModel[];
  score: number;
  tokenCount: number;
  turnState: TurnState;
  color: PlayerColor;
  points: {
    public: number;
    private: number;
    total: number;
    detailed: {
      routes: number;
      longestRoute: number;
      positiveDestinationCards: number;
      negativeDestinationCards: number;
    };
  };
  longestRoute: number;

  getPublicPoints(): Promise<any>;
  getPrivatePoints(): Promise<any>;
  routePoints(): Promise<any>;
  getLongestRoute(): Promise<any>;
  getTurnStateObject(): TurnStateObject;
  destinationCardPoints(): Promise<any>;
  updatePoints(): Promise<any>;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    hashedPassword: { type: String, required: true },
    claimedRouteList: [{ type: Schema.Types.ObjectId, ref: 'Route' }],
    trainCardHand: [{ type: Schema.Types.ObjectId, ref: 'TrainCard' }],
    destinationCardHand: [{ type: Schema.Types.ObjectId, ref: 'DestinationCard' }],
    unmetDestinationCards: [{ type: Schema.Types.ObjectId, ref: 'DestinationCard' }],
    metDestinationCards: [{ type: Schema.Types.ObjectId, ref: 'DestinationCard' }],

    score: Number,
    tokenCount: Number,
    color: String,
    points: {
      public: Number,
      private: Number,
      total: Number,
      detailed: {
        routes: Number,
        longestRoute: Number,
        positiveDestinationCards: Number,
        negativeDestinationCards: Number,
      },
    },
    turnState: String,
    longestRoute: Number,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

UserSchema.methods.getTurnStateObject = function() {
  return TurnStateObjectLoader.instanceOf().createStateObject(this);
};

UserSchema.methods.updatePoints = function() {
  return Promise.all([this.getPublicPoints(), this.getPrivatePoints()]).then(resolved => {
    this.points.total = resolved[0] + resolved[1] + this.points.detailed.negativeDestinationCards;
    return this.points.total;
  });
};

UserSchema.methods.getPublicPoints = function() {
  return this.routePoints().then((resolve: any) => {
    this.points.public = resolve + this.points.detailed.longestRoute;
    return resolve;
  });
};

UserSchema.methods.getPrivatePoints = function() {
  return this.destinationCardPoints().then((resolved: any) => {
    this.points.private = resolved.positive;
    return this.points.private;
  });
};

UserSchema.methods.routePoints = async function() {
  if (!this.claimedRouteList) return 0;

  let points = 0;
  await this.populate('claimedRouteList').execPopulate();
  for (let i = 0; i < this.claimedRouteList.length; i++) {
    points += this.claimedRouteList[i].pointValue;
  }
  this.points.detailed.routes = points;
  return points;
};

UserSchema.methods.destinationCardPoints = async function() {
  let points = {
    positive: 0,
    negative: 0,
  };

  if (!this.destinationCardHand) return points;

  if (!this.unmetDestinationCards) this.unmetDestinationCards = [];
  if (!this.metDestinationCards) this.metDestinationCards = [];

  for (let i = 0; i < this.destinationCardHand.length; i++) {
    if (this.unmetDestinationCards.indexOf(this.destinationCardHand[i]) == -1 && this.metDestinationCards.indexOf(this.destinationCardHand[i]) == -1) {
      this.unmetDestinationCards.push(this.destinationCardHand[i]);
    }
  }

  let remove: any[] = [];
  await this.populate('unmetDestinationCards').execPopulate();
  await this.populate('claimedRouteList').execPopulate();
  for (let i = 0; i < this.unmetDestinationCards.length; i++) {
    if (DestinationCardFulfilled(this.claimedRouteList, this.unmetDestinationCards[i])) {
      this.metDestinationCards.push(this.unmetDestinationCards[i]._id);
      remove.push(this.unmetDestinationCards[i]._id);
    } else {
      points.negative += this.unmetDestinationCards[i].pointValue;
    }
  }

  await this.populate('metDestinationCards').execPopulate();

  for (let i = 0; i < this.metDestinationCards.length; i++) {
    points.positive += this.metDestinationCards[i].pointValue;
  }

  //depopulate met & unmet destination cards
  this.unmetDestinationCards = depopulate(this.unmetDestinationCards);
  this.metDestinationCards = depopulate(this.metDestinationCards);
  this.claimedRouteList = depopulate(this.claimedRouteList);
  this.unmetDestinationCards = this.unmetDestinationCards.filter((e: any) => {
    return remove.indexOf(e) === -1;
  });

  this.points.detailed.positiveDestinationCards = points.positive;
  this.points.detailed.negativeDestinationCards = points.negative;

  return points;
};

UserSchema.methods.getLongestRoute = async function() {
  await this.populate('claimedRouteList').execPopulate();
  let lengths: number[] = [];

  for (let i = 0; i < this.claimedRouteList.length; i++) {
    lengths.push(LongestRoute(this.claimedRouteList, this.claimedRouteList[i].city1));
    lengths.push(LongestRoute(this.claimedRouteList, this.claimedRouteList[i].city2));
  }
  let max = lengths.reduce((a, b) => Math.max(a, b), 0);
  this.longestRoute = max;

  return max;
};

var LongestRoute = (routes: IRouteModel[], city: string) => {
  let visited: string[] = [];

  var traverse = (curCity: string): any => {
    let lengths: number[] = [];
    for (var i = 0; i < routes.length; i++) {
      if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]._id) === -1) {
        visited.push(routes[i]._id);
        let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;
        lengths.push(traverse(newCity) + routes[i].length);
      }
    }
    return lengths.reduce((a, b) => Math.max(a, b), 0);
  };

  return traverse(city);
};

var DestinationCardFulfilled = (routes: IRouteModel[], destinationCard: IDestinationCardModel) => {
  console.log(routes, destinationCard);
  let visited: string[] = [];

  var traverse = (curCity: string, findCity: string): any => {
    for (var i = 0; i < routes.length; i++) {
      if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]._id) === -1) {
        visited.push(routes[i]._id);
        let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;

        if (newCity === findCity || traverse(newCity, findCity)) return true;
      }
    }
    return false;
  };

  return traverse(destinationCard.city1, destinationCard.city2);
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

var depopulate = (arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i]._id;
  }
  return arr;
};

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
