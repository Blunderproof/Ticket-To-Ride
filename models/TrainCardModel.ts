import { TrainColor } from '../constants';

export class TrainCardModel {
  _id?: string;
  color?: TrainColor;
  constructor(data?: any) {
    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.color = data.color;
  }

  getObject() {
    let data = {
      _id: this._id,
      color: this.color,
    };
    return data;
  }
}
