import * as mongoose from "mongoose";
import { User, IUserModel } from "./User";
import { Schema } from "mongoose";
import { Route, IRouteModel } from "./Route";
import { ITrainCardModel } from "./TrainCard";
import { IDestinationCardModel } from "./DestinationCard";

export enum GameState {
  Open = 1,
  InProgress,
  Ended,
}

export interface IGameModel extends mongoose.Document {
  host: IUserModel;
  playerList: IUserModel[];
  gameState: GameState;
  unclaimedRouteFiles: IRouteModel[];
  faceUpTrainCards: ITrainCardModel[];
  trainCardDeck: ITrainCardModel[];
  trainCardDiscardPile: ITrainCardModel[];
  destinationCardDeck: IDestinationCardModel[];
  destinationCardDiscardPile: IDestinationCardModel[];
}

export var GameSchema: Schema = new Schema({
  host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  playerList: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  gameState: Number,
  unclaimedRouteFiles: [{ type: Schema.Types.ObjectId, required: true, ref: "Route" }],
  faceUpTrainCards: [{ type: Schema.Types.ObjectId, required: true, ref: "TrainCard" }],
  trainCardDeck: [{ type: Schema.Types.ObjectId, required: true, ref: "TrainCard" }],
  trainCardDiscardPile: [{ type: Schema.Types.ObjectId, required: true, ref: "TrainCard" }],
  destinationCardDeck: [{ type: Schema.Types.ObjectId, required: true, ref: "DestinationCard" }],
  destinationCardDiscardPile: [{ type: Schema.Types.ObjectId, required: true, ref: "DestinationCard" }]
});

export const Game: mongoose.Model<IGameModel> = mongoose.model<IGameModel>(
  "Game",
  GameSchema
);
