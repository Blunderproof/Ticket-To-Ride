import { TrainColor } from '../constants';

export class TrainCardModel {
  _id?: string;
  color?: TrainColor;
  constructor(data?: any) {
    Object.keys(data || {}).forEach(k => ((this as any)[k] = data[k]));
    this._id = data._id;
  }
}
