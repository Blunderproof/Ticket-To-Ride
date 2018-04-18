import { TrainColor } from '../constants';

export class RouteModel {
  _id?: string;
  color?: TrainColor;
  length?: number;
  routeNumber?: number;
  city1?: string;
  city2?: string;

  constructor(data?: any) {
    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.city1 = data.city1;
    this.city2 = data.city2;
    this.routeNumber = data.routeNumber;
    this.length = data.length;
    this.color = data.color;
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

  getObject() {
    let data = {
      _id: this._id,
      color: this.color,
      length: this.length,
      routeNumber: this.routeNumber,
      city1: this.city1,
      city2: this.city2,
    };
    return data;
  }
}
