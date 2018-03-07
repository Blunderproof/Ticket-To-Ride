import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IDestinationCardModel extends mongoose.Document {
  city1: string,
  city2: string,
  pointValue: number
}

export var DestinationCardSchema: Schema = new Schema({
  city1: String,
  city2: String,
  pointValue: Number
});

DestinationCardSchema.methods.isCompletedFromPath = function() {
    //pass
};


DestinationCardSchema.virtual('fullID').get(function(this: IDestinationCardModel) {
    return [this.city1, this.city2].join('-')
});



export const DestinationCard: mongoose.Model<IDestinationCardModel> = mongoose.model<IDestinationCardModel>(
   "DestinationCard",
    DestinationCardSchema
);
