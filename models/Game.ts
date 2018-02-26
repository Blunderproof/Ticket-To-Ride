import * as mongoose from "mongoose";
import { User, IUserModel } from "./User";
import { Schema } from "mongoose";

export enum GameState {
  Open = 1,
  InProgress,
  Ended,
}

export interface IGameModel extends mongoose.Document {
  host: IUserModel;
  userList: IUserModel[];
  gameState: GameState;
}

export var GameSchema: Schema = new Schema({
  host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  userList: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  gameState: Number,
});

export const Game: mongoose.Model<IGameModel> = mongoose.model<IGameModel>(
  "Game",
  GameSchema
);
