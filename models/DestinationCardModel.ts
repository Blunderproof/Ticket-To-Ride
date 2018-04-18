export class DestinationCardModel {
  _id?: string;
  city1?: string;
  city2?: string;
  pointValue?: number;

  constructor(data?: any) {
    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.city1 = data.city1;
    this.city2 = data.city2;
    this.pointValue = data.pointValue;
  }

  get fullID() {
    return [this.city1, this.city2].join('-');
  }

  getObject() {
    let data = {
      _id: this._id,
      pointValue: this.pointValue,
      city1: this.city1,
      city2: this.city2,
    };
    return data;
  }
}
