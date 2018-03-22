import TurnStateObject from './TurnStateObject';
import { TurnState } from '../../constants';
import BeginningTurnStateObject from './BeginningTurnStateObject';
import TrainCardTurnStateObject from './TrainCardTurnStateObject';
import DestinationCardTurnStateObject from './DestinationCardTurnStateObject';
import { IUserModel } from '../User';

export default class TurnStateObjectLoader {
  stateLookupTable: any = {};
  private constructor() {
    let beginningOfTurn = TurnState.BeginningOfTurn;
    let oneTrainCardChosen = TurnState.OneTrainCardChosen;
    let choosingDestinationCards = TurnState.ChoosingDestinationCards;

    this.stateLookupTable = {
      beginningOfTurn: BeginningTurnStateObject,
      oneTrainCardChosen: TrainCardTurnStateObject,
      choosingDestinationCards: DestinationCardTurnStateObject,
    };
  }

  private static instance = new TurnStateObjectLoader();
  static instanceOf() {
    if (!this.instance) {
      this.instance = new TurnStateObjectLoader();
    }
    return this.instance;
  }

  createStateObject(user: IUserModel) {
    return this.stateLookupTable[user.turnState](user);
  }
}
