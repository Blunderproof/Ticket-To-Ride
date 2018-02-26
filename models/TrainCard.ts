import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { TrainColor } from "../constants";

export interface ITrainCardModel extends mongoose.Document {
  color: TrainColor
}

export var TrainCardSchema: Schema = new Schema({
  color: String
});

export const TrainCard: mongoose.Model<ITrainCardModel> = mongoose.model<ITrainCardModel>(
  "TrainCard",
  TrainCardSchema
);
