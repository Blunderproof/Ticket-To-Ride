import { TrainColor } from './constants';

export class Route {
    color: TrainColor;
    length: number;
    routeNumber: number;
    city1: string;
    city2: string;

    constructor(data?: Object) {
        Object.keys(data || {}).forEach(key => this[key] = data[key]);
    }
}
