import * as mongoose from 'mongoose';
import { User, IUserModel } from './User';
import { Schema } from 'mongoose';
import { TrainColor } from '../constants';

export interface IRouteModel extends mongoose.Document {
  color: TrainColor;
  length: number;
  routeNumber: number;
  city1: string;
  city2: string;
  pointValue(): number;
}

export var RouteSchema: Schema = new Schema({
  color: String,
  length: Number,
  routeNumber: Number,
  city1: String,
  city2: String,
});

RouteSchema.virtual('pointValue').get(function(this: IRouteModel) {
  const points: any = {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 10,
    6: 15,
  };
  return this.length && points[this.length] ? points[this.length] : 0;
});

export const Route: mongoose.Model<IRouteModel> = mongoose.model<IRouteModel>('Route', RouteSchema);
