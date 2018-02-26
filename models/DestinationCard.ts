import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export interface  DestinationCardModel extends mongoose.Document {
  city1: string,
  city2: string,
  pointValue: number
}

export var DestinationCardSchema: Schema = new Schema({
  city1: String,
  city2: String,
  pointValue: Number
});

export const DestinationCard: mongoose.Model<DestinationCardModel> = mongoose.model<DestinationCardModel>(
   "DestinationCard",
    DestinationCardSchema
);
