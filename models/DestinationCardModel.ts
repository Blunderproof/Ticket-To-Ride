export class DestinationCardModel {
  _id?: string;
  city1?: string;
  city2?: string;
  pointValue?: number;

  constructor(data?: any) {
    this._id = data._id;
    Object.keys(data || {}).forEach(k => ((this as any)[k] = data[k]));
  }

  get fullID() {
    return [this.city1, this.city2].join('-');
  }
}
