export class DestinationCard {
  city1: string;
  city2: string;
  pointValue: number;
  selected: boolean;
  _id: string;

  constructor(data?: Object) {
    Object.keys(data || {}).forEach(key => (this[key] = data[key]));
  }
}
