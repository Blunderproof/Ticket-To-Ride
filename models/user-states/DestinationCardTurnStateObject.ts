import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor, TurnState } from '../../constants';
import { IGameModel } from '../Game';

export default class DestinationCardTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard(cardIndex: number, game: IGameModel) {
    // can't choose train cards after choosing to select destination cards
    this.error = "You can't choose train cards after viewing destination cards!";
    return null;
  }

  chooseDestinationCard(keepCards: Array<string>, game: IGameModel) {
    let top3 = game.destinationCardDeck.slice(0, 3);

    let discard = top3.filter(function(card) {
      return keepCards.indexOf(card._id.toString()) < 0;
    });

    let keep = top3.filter(function(card) {
      return keepCards.indexOf(card._id.toString()) >= 0;
    });

    this.user.destinationCardHand = this.user.destinationCardHand.concat(keep);
    game.destinationCardDiscardPile = game.destinationCardDiscardPile.concat(discard);
    game.destinationCardDeck = game.destinationCardDeck.splice(3);

    if (game.destinationCardDeck.length == 0 && game.destinationCardDiscardPile.length > 0) {
      game.reshuffleDestinationCards();
    }

    this.user.turnState = TurnState.BeginningOfTurn;
    game.turnNumber += 1;

    return this.user;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor, game: IGameModel) {
    // can't claim route after viewing destination cards
    this.error = "You can't claim routes after viewing destination cards!";
    return null;
  }

  setChooseDestinationCardState() {
    this.error = "You can't set choose destination card state if you're already in it!";
    return null;
  }
}
