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
    console.log('creatingState Object');
    console.log('user.turnState', user.turnState);
    if (user.turnState == TurnState.BeginningOfTurn) return new BeginningTurnStateObject(user);
    if (user.turnState == TurnState.OneTrainCardChosen) return new TrainCardTurnStateObject(user);
    if (user.turnState == TurnState.ChoosingDestinationCards) return new DestinationCardTurnStateObject(user);
  }
}
