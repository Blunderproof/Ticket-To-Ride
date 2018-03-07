import { Route } from './route';
import { TrainCard } from './train-card';
import { DestinationCard } from './destination-card';
import { PlayerColor } from './constants';

export class User {
    id: string;
    username: string;
    claimedRouteList: Route[];
    trainCardHand: TrainCard[];
    destinationCardHand: DestinationCard[];
    score: number;
    color: PlayerColor;

    constructor() {

    }
}
