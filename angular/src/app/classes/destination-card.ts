export class DestinationCard {
    city1: string;
    city2: string;
    pointValue: number;

    constructor(data?: Object) {
        Object.keys(data || {}).forEach(key => this[key] = data[key]);
    }
}
