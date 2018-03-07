import {User} from '../classes/user';
import { Route } from './route';
import { TrainCard } from './train-card';
import { DestinationCard } from './destination-card';

export class Game {
    host: User;
    userList: User[];
    gameState: string;
    unclaimedRoutes: Route[];
    trainCardDeck: TrainCard[];
    trainCardDiscardPile: TrainCard[];
    destinationCardDeck: DestinationCard[];
    destinationCardDiscardPile: DestinationCard[];
    turnNumber: number;
    numberOfPlayersReady: number;
    _id: string;

    constructor() { }
}
