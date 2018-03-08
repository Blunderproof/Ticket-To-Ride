import { TrainColor } from './constants';

export class TrainCard {
    color: TrainColor;

    constructor(data?: Object) {
        Object.keys(data || {}).forEach(key => this[key] = data[key]);
    }
}
