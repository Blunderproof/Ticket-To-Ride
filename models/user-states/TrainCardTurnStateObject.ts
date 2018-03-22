import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor } from '../../constants';

export default class TrainCardTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard() {
    // TODO implement
    this.error = 'not implemented yet but will be';
    return null;
  }

  chooseDestinationCard() {
    // can't choose destination cards after choosing one train card
    this.error = "You can't choose destination cards after choosing a train card!";
    return null;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor) {
    // can't claim route after choosing one train card
    this.error = "You can't claim a route after choosing a train card!";
    return null;
  }
}
