import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor } from '../../constants';

export default class DestinationCardTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard() {
    // can't choose train cards after choosing to select destination cards
    this.error = "You can't choose train cards after viewing destination cards!";
    return null;
  }

  chooseDestinationCard() {
    // TODO implement
    return null;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor) {
    // can't claim route after choosing one train card
    this.error = "You can't claim routes after viewing destination cards!";
    return null;
  }
}
