import { User } from '../classes/user';
import { Route } from './route';
import { TrainCard } from './train-card';
import { DestinationCard } from './destination-card';

export class Game {
  host: User;
  userList: User[];
  gameState: number;
  lastRound: number;
  unclaimedRoutes: Route[];
  trainCardDeck: TrainCard[];
  destinationCardDeck: DestinationCard[];
  turnNumber: number;
  playersReady: string[];
  _id: string;

  constructor(data?: Object) {
    Object.keys(data || {}).forEach(key => (this[key] = data[key]));

    this.userList = (this.userList || []).map(x => new User(x));
    this.unclaimedRoutes = (this.unclaimedRoutes || []).map(x => new Route(x));
    this.trainCardDeck = (this.trainCardDeck || []).map(x => new TrainCard(x));
    this.destinationCardDeck = (this.destinationCardDeck || []).map(
      x => new DestinationCard(x)
    );
  }
}
