import { TrainColor } from '../constants';

export class RouteModel {
  _id?: string;
  color?: TrainColor;
  length?: number;
  routeNumber?: number;
  city1?: string;
  city2?: string;

  constructor(data?: any) {
    this._id = data._id;
    Object.keys(data || {}).forEach(k => ((this as any)[k] = data[k]));
  }

  get pointValue() {
    const points: any = {
      1: 1,
      2: 2,
      3: 4,
      4: 7,
      5: 10,
      6: 15,
    };
    return this.length && points[this.length] ? points[this.length] : 0;
  }
}
