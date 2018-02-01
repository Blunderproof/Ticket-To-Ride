import * as mongoose from "mongoose";
import { User, IUserModel } from "./User";
import { Schema } from "mongoose";

enum GameState {
  Open = 1,
  InProgress,
  Ended,
}

export interface IGameModel extends mongoose.Document {
  host: IUserModel;
  playerList: IUserModel[];
  gameState: GameState;
}

export var GameSchema: Schema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: "User" },
  playerList: [{ type: Schema.Types.ObjectId, ref: "User" }],
  gameState: Number,
});

export const Game: mongoose.Model<IGameModel> = mongoose.model<IGameModel>(
  "Game",
  GameSchema
);
